<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\CuentaCobrar;
use App\Models\Factura;
use App\Models\Producto;
use App\Models\Venta;
use App\Models\VentaProducto;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $hoy = Carbon::today();
        $inicioMes = Carbon::now()->startOfMonth();

        $ventasDia = Venta::whereDate('created_at', $hoy)->where('estado', 'completada');
        $ventasMes = Venta::whereDate('created_at', '>=', $inicioMes)->where('estado', 'completada');

        $bajoStock = Producto::where('estado', true)
            ->whereColumn('stock', '<=', 'stock_minimo')
            ->get();

        $ventasRecientes = Venta::with(['cliente', 'user'])
            ->where('estado', 'completada')
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'ventas_dia' => [
                'count' => $ventasDia->count(),
                'total' => $ventasDia->sum('total'),
            ],
            'ventas_mes' => [
                'count' => $ventasMes->count(),
                'total' => $ventasMes->sum('total'),
            ],
            'clientes_count' => Cliente::where('estado', true)->count(),
            'facturas_count' => Factura::count(),
            'clientes_deudas' => [
                'count' => CuentaCobrar::whereIn('estado', ['pendiente', 'parcial', 'vencida'])->count(),
            ],
            'productos_bajo_stock' => $bajoStock,
            'ventas_recientes' => $ventasRecientes,
        ]);
    }

    public function charts(): JsonResponse
    {
        $ventasPorMes = Venta::where('estado', 'completada')
            ->where('created_at', '>=', Carbon::now()->subMonths(11)->startOfMonth())
            ->selectRaw('YEAR(created_at) as anio, MONTH(created_at) as mes, SUM(total) as total')
            ->groupBy('anio', 'mes')
            ->orderBy('anio')
            ->orderBy('mes')
            ->get();

        $productosMasVendidos = VentaProducto::selectRaw('producto_id, SUM(cantidad) as total_cantidad, SUM(subtotal) as total_ingresos')
            ->whereHas('venta', function ($q) {
                $q->where('estado', 'completada');
            })
            ->groupBy('producto_id')
            ->orderByDesc('total_cantidad')
            ->take(10)
            ->with('producto')
            ->get();

        $clientesFrecuentes = Venta::where('estado', 'completada')
            ->selectRaw('cliente_id, COUNT(*) as total_compras, SUM(total) as total_gastado')
            ->whereNotNull('cliente_id')
            ->groupBy('cliente_id')
            ->orderByDesc('total_compras')
            ->take(10)
            ->with('cliente')
            ->get();

        $gananciasMensuales = Venta::where('estado', 'completada')
            ->where('created_at', '>=', Carbon::now()->subMonths(11)->startOfMonth())
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

                $item->costos = $costos ?? 0;
                $item->ganancia = $item->ingresos - $item->costos;
                return $item;
            });

        return response()->json([
            'ventas_por_mes' => $ventasPorMes,
            'productos_mas_vendidos' => $productosMasVendidos,
            'clientes_frecuentes' => $clientesFrecuentes,
            'ganancias_mensuales' => $gananciasMensuales,
        ]);
    }
}
