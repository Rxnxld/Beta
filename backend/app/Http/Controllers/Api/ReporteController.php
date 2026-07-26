<?php

namespace App\Http\Controllers\Api;

use App\Exports\ClientesExport;
use App\Exports\ProductosExport;
use App\Exports\VentasExport;
use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\MovimientoInventario;
use App\Models\Producto;
use App\Models\Venta;
use App\Models\VentaProducto;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ReporteController extends Controller
{
    public function ventas(Request $request): JsonResponse
    {
        $query = Venta::with(['cliente', 'productos.producto'])->where('estado', 'completada');

        if ($desde = $request->get('desde')) {
            $query->whereDate('created_at', '>=', $desde);
        }

        if ($hasta = $request->get('hasta')) {
            $query->whereDate('created_at', '<=', $hasta);
        }

        $ventas = $query->orderBy('created_at', 'desc')->get();

        $totales = [
            'total_ventas' => $ventas->count(),
            'subtotal' => $ventas->sum('subtotal'),
            'iva' => $ventas->sum('iva'),
            'descuento' => $ventas->sum('descuento'),
            'total' => $ventas->sum('total'),
        ];

        return response()->json([
            'ventas' => $ventas,
            'totales' => $totales,
        ]);
    }

    public function productos(): JsonResponse
    {
        $productos = Producto::with('categoria')->get()->map(function ($producto) {
            $ventas = VentaProducto::where('producto_id', $producto->id)
                ->whereHas('venta', function ($q) {
                    $q->where('estado', 'completada');
                })
                ->selectRaw('SUM(cantidad) as total_vendido, SUM(subtotal) as total_ingresos')
                ->first();

            return [
                'id' => $producto->id,
                'codigo' => $producto->codigo,
                'nombre' => $producto->nombre,
                'categoria' => $producto->categoria->nombre ?? 'N/A',
                'stock' => $producto->stock,
                'precio_compra' => $producto->precio_compra,
                'precio_venta' => $producto->precio_venta,
                'total_vendido' => (int) ($ventas->total_vendido ?? 0),
                'total_ingresos' => (float) ($ventas->total_ingresos ?? 0),
            ];
        })->sortByDesc('total_vendido')->values();

        return response()->json($productos);
    }

    public function clientes(): JsonResponse
    {
        $clientes = Cliente::where('estado', true)->get()->map(function ($cliente) {
            return [
                'id' => $cliente->id,
                'nombre' => $cliente->nombreCompleto,
                'cedula' => $cliente->cedula,
                'telefono' => $cliente->telefono,
                'correo' => $cliente->correo,
                'total_compras' => $cliente->comprasTotal,
                'total_compras_count' => $cliente->ventas()->where('estado', 'completada')->count(),
                'deuda_actual' => $cliente->deudaTotal,
            ];
        })->sortByDesc('total_compras')->values();

        return response()->json($clientes);
    }

    public function inventario(): JsonResponse
    {
        $productos = Producto::with('categoria')
            ->where('estado', true)
            ->get()
            ->map(function ($producto) {
                return [
                    'id' => $producto->id,
                    'codigo' => $producto->codigo,
                    'nombre' => $producto->nombre,
                    'categoria' => $producto->categoria->nombre ?? 'N/A',
                    'stock' => $producto->stock,
                    'stock_minimo' => $producto->stock_minimo,
                    'precio_compra' => $producto->precio_compra,
                    'precio_venta' => $producto->precio_venta,
                    'valor_inventario' => $producto->stock * $producto->precio_compra,
                    'ganancia_potencial' => $producto->stock * ($producto->precio_venta - $producto->precio_compra),
                    'bajo_stock' => $producto->bajoStock,
                ];
            });

        $totales = [
            'total_productos' => $productos->count(),
            'valor_total_inventario' => $productos->sum('valor_inventario'),
            'ganancia_potencial_total' => $productos->sum('ganancia_potencial'),
            'productos_bajo_stock' => $productos->where('bajo_stock', true)->count(),
        ];

        return response()->json([
            'productos' => $productos,
            'totales' => $totales,
        ]);
    }

    public function ganancias(Request $request): JsonResponse
    {
        $desde = $request->get('desde', Carbon::now()->startOfYear()->toDateString());
        $hasta = $request->get('hasta', Carbon::now()->toDateString());

        $ventas = Venta::where('estado', 'completada')
            ->whereDate('created_at', '>=', $desde)
            ->whereDate('created_at', '<=', $hasta)
            ->get();

        $ingresos = $ventas->sum('total');

        $costos = VentaProducto::whereHas('venta', function ($q) use ($desde, $hasta) {
            $q->where('estado', 'completada')
                ->whereDate('created_at', '>=', $desde)
                ->whereDate('created_at', '<=', $hasta);
        })
            ->join('productos', 'venta_productos.producto_id', '=', 'productos.id')
            ->selectRaw('SUM(venta_productos.cantidad * productos.precio_compra) as total_costos')
            ->value('total_costos');

        $ganancia = $ingresos - ($costos ?? 0);

        $mensual = Venta::where('estado', 'completada')
            ->whereDate('created_at', '>=', Carbon::now()->subMonths(11)->startOfMonth())
            ->whereDate('created_at', '<=', $hasta)
            ->selectRaw('YEAR(created_at) as anio, MONTH(created_at) as mes, SUM(total) as ingresos')
            ->groupBy('anio', 'mes')
            ->orderBy('anio')
            ->orderBy('mes')
            ->get()
            ->map(function ($item) {
                $costos = VentaProducto::whereHas('venta', function ($q) use ($item) {
                    $q->where('estado', 'completada')
                        ->whereYear('created_at', $item->anio)
                        ->whereMonth('created_at', $item->mes);
                })
                    ->join('productos', 'venta_productos.producto_id', '=', 'productos.id')
                    ->selectRaw('SUM(venta_productos.cantidad * productos.precio_compra) as costos')
                    ->value('costos');

                $item->costos = (float) ($costos ?? 0);
                $item->ganancia = $item->ingresos - $item->costos;
                return $item;
            });

        return response()->json([
            'desde' => $desde,
            'hasta' => $hasta,
            'ingresos' => $ingresos,
            'costos' => (float) ($costos ?? 0),
            'ganancia' => $ganancia,
            'cantidad_ventas' => $ventas->count(),
            'mensual' => $mensual,
        ]);
    }

    public function exportar($tipo, $formato)
    {
        $request = request();

        switch ($tipo) {
            case 'ventas':
                $desde = $request->get('desde');
                $hasta = $request->get('hasta');
                $export = new VentasExport($desde, $hasta);
                $nombre = "reporte-ventas";
                break;
            case 'productos':
                $export = new ProductosExport();
                $nombre = "reporte-productos";
                break;
            case 'clientes':
                $export = new ClientesExport();
                $nombre = "reporte-clientes";
                break;
            default:
                abort(404, 'Tipo de reporte no válido.');
        }

        if ($formato === 'pdf') {
            $datos = $export->collection();
            $titulo = match ($tipo) {
                'ventas' => 'Reporte de Ventas',
                'productos' => 'Reporte de Productos',
                'clientes' => 'Reporte de Clientes',
                default => 'Reporte',
            };
            $config = config('app.configuraciones', []);
            $pdf = Pdf::loadView('pdf.reporte', compact('titulo', 'datos', 'config'));
            return $pdf->download("{$nombre}.pdf");
        }

        if ($formato === 'excel' || $formato === 'xlsx') {
            return Excel::download($export, "{$nombre}.xlsx");
        }

        if ($formato === 'csv') {
            return Excel::download($export, "{$nombre}.csv");
        }

        abort(400, 'Formato no válido. Use: pdf, excel, csv');
    }
}
