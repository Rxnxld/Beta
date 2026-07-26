<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateVentaRequest;
use App\Models\Cliente;
use App\Models\CuentaCobrar;
use App\Models\Factura;
use App\Models\MovimientoInventario;
use App\Models\Notificacion;
use App\Models\Producto;
use App\Models\PuntosCliente;
use App\Models\Venta;
use App\Models\VentaProducto;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VentaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Venta::with(['cliente', 'user', 'productos.producto', 'factura']);

        if ($desde = $request->get('desde')) {
            $query->whereDate('created_at', '>=', $desde);
        }

        if ($hasta = $request->get('hasta')) {
            $query->whereDate('created_at', '<=', $hasta);
        }

        if ($tipo = $request->get('tipo')) {
            $query->where('tipo', $tipo);
        }

        $ventas = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($ventas);
    }

    public function store(CreateVentaRequest $request): JsonResponse
    {
        $validated = $request->validated();

        return DB::transaction(function () use ($validated, $request) {
            $subtotal = 0;
            $productosData = [];

            foreach ($validated['productos'] as $item) {
                $producto = Producto::findOrFail($item['producto_id']);

                if ($producto->stock < $item['cantidad']) {
                    abort(400, "Stock insuficiente para el producto {$producto->nombre}. Disponible: {$producto->stock}, solicitado: {$item['cantidad']}");
                }

                $precioUnitario = $producto->precio_venta;
                $subtotalProducto = $precioUnitario * $item['cantidad'];
                $subtotal += $subtotalProducto;

                $productosData[] = [
                    'producto' => $producto,
                    'producto_id' => $producto->id,
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => $precioUnitario,
                    'subtotal' => $subtotalProducto,
                ];
            }

            $ivaPorcentaje = config('app.configuraciones.iva', 0);
            $iva = $subtotal * ($ivaPorcentaje / 100);
            $descuento = $validated['descuento'] ?? 0;
            $total = $subtotal + $iva - $descuento;

            $venta = Venta::create([
                'cliente_id' => $validated['cliente_id'],
                'user_id' => auth()->id(),
                'tipo' => $validated['tipo'],
                'subtotal' => $subtotal,
                'iva' => $iva,
                'descuento' => $descuento,
                'total' => $total,
                'estado' => 'completada',
            ]);

            foreach ($productosData as $pd) {
                VentaProducto::create([
                    'venta_id' => $venta->id,
                    'producto_id' => $pd['producto_id'],
                    'cantidad' => $pd['cantidad'],
                    'precio_unitario' => $pd['precio_unitario'],
                    'subtotal' => $pd['subtotal'],
                ]);

                $producto = $pd['producto'];
                $stockAnterior = $producto->stock;
                $producto->decrement('stock', $pd['cantidad']);

                MovimientoInventario::create([
                    'producto_id' => $producto->id,
                    'tipo' => 'salida',
                    'cantidad' => $pd['cantidad'],
                    'stock_anterior' => $stockAnterior,
                    'stock_nuevo' => $producto->fresh()->stock,
                    'referencia' => "Venta #{$venta->id}",
                    'user_id' => auth()->id(),
                    'observacion' => "Venta de {$pd['cantidad']} unidad(es) de {$producto->nombre}",
                ]);
            }

            $fecha = now();
            $numeroFactura = 'FAC-' . $fecha->format('Ymd') . '-' . str_pad($venta->id, 4, '0', STR_PAD_LEFT);

            Factura::create([
                'venta_id' => $venta->id,
                'numero_factura' => $numeroFactura,
                'fecha' => $fecha->toDateString(),
            ]);

            if ($validated['tipo'] === 'credito') {
                CuentaCobrar::create([
                    'venta_id' => $venta->id,
                    'cliente_id' => $validated['cliente_id'],
                    'monto_total' => $total,
                    'saldo_pendiente' => $total,
                    'fecha_vencimiento' => $validated['fecha_vencimiento'],
                    'estado' => 'pendiente',
                ]);
            }

            $puntosGanados = (int) floor($total / 10);
            if ($puntosGanados > 0) {
                PuntosCliente::create([
                    'cliente_id' => $validated['cliente_id'],
                    'venta_id' => $venta->id,
                    'puntos' => $puntosGanados,
                    'concepto' => "Compra #{$venta->id} - {$puntosGanados} puntos",
                ]);

                $cliente = Cliente::find($validated['cliente_id']);
                $cliente->increment('puntos', $puntosGanados);

                if ($cliente->puntos >= 100) {
                    Notificacion::create([
                        'user_id' => auth()->id(),
                        'tipo' => 'puntos',
                        'mensaje' => "El cliente {$cliente->nombreCompleto} ha alcanzado {$cliente->puntos} puntos y puede canjear un beneficio.",
                    ]);
                }
            }

            $venta->load(['cliente', 'user', 'productos.producto', 'factura', 'cuentaCobrar']);

            return response()->json($venta, 201);
        });
    }

    public function show($id): JsonResponse
    {
        $venta = Venta::with(['cliente', 'user', 'productos.producto', 'factura', 'cuentaCobrar.pagos'])->findOrFail($id);

        return response()->json($venta);
    }

    public function anular($id): JsonResponse
    {
        return DB::transaction(function () use ($id) {
            $venta = Venta::with('productos.producto', 'cuentaCobrar')->findOrFail($id);

            if ($venta->estado === 'anulada') {
                abort(400, 'La venta ya está anulada.');
            }

            $venta->update(['estado' => 'anulada']);

            foreach ($venta->productos as $vp) {
                $producto = $vp->producto;
                $stockAnterior = $producto->stock;
                $producto->increment('stock', $vp->cantidad);

                MovimientoInventario::create([
                    'producto_id' => $producto->id,
                    'tipo' => 'entrada',
                    'cantidad' => $vp->cantidad,
                    'stock_anterior' => $stockAnterior,
                    'stock_nuevo' => $producto->fresh()->stock,
                    'referencia' => "Anulación Venta #{$venta->id}",
                    'user_id' => auth()->id(),
                    'observacion' => "Devolución de {$vp->cantidad} unidad(es) de {$producto->nombre} por anulación de venta",
                ]);
            }

            if ($venta->cuentaCobrar) {
                $venta->cuentaCobrar->update(['estado' => 'pagada', 'saldo_pendiente' => 0]);
            }

            return response()->json(['message' => 'Venta anulada correctamente. Stock restaurado.', 'venta' => $venta->fresh()->load(['cliente', 'user', 'productos.producto', 'factura', 'cuentaCobrar'])]);
        });
    }

    public function generarPdf($id): \Illuminate\Http\Response
    {
        $venta = Venta::with(['cliente', 'user', 'productos.producto', 'factura'])->findOrFail($id);
        $config = config('app.configuraciones', []);

        $pdf = Pdf::loadView('pdf.factura', compact('venta', 'config'));

        return $pdf->download("factura-{$venta->factura->numero_factura}.pdf");
    }
}
