<?php

namespace App\Services;

use App\Models\Cliente;
use App\Models\Producto;
use App\Models\Venta;
use App\Models\VentaProducto;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AIService
{
    public function consultar(string $pregunta): array
    {
        $pregunta = strtolower(trim($pregunta));

        if (str_contains($pregunta, 'cuánto vendí hoy') || str_contains($pregunta, 'cuanto vendi hoy') || str_contains($pregunta, 'ventas del dia') || str_contains($pregunta, 'ventas del día')) {
            return $this->ventasDelDia();
        }

        if (str_contains($pregunta, 'cliente debe más') || str_contains($pregunta, 'cliente debe mas') || str_contains($pregunta, 'mayor deudor') || str_contains($pregunta, 'quien debe más')) {
            return $this->clienteMayorDeuda();
        }

        if (str_contains($pregunta, 'comprar nuevamente') || str_contains($pregunta, 'bajo stock') || str_contains($pregunta, 'productos agotados') || str_contains($pregunta, 'reabastecer') || str_contains($pregunta, 'falta stock')) {
            return $this->productosBajoStock();
        }

        if (str_contains($pregunta, 'productos más vendidos') || str_contains($pregunta, 'productos mas vendidos') || str_contains($pregunta, 'más vendido') || str_contains($pregunta, 'mas vendido') || str_contains($pregunta, 'top productos') || str_contains($pregunta, 'mejores productos')) {
            return $this->productosMasVendidos();
        }

        return [
            'respuesta' => 'No entendí la pregunta. Intente: ¿Cuánto vendí hoy?, ¿Qué cliente debe más dinero?, ¿Qué productos debo comprar nuevamente?, ¿Cuáles fueron los productos más vendidos?',
        ];
    }

    protected function ventasDelDia(): array
    {
        $hoy = Carbon::today();

        $ventas = Venta::whereDate('created_at', $hoy)
            ->where('estado', 'completada');

        $total = $ventas->sum('total');
        $cantidad = $ventas->count();

        $productosVendidos = VentaProducto::whereHas('venta', function ($q) use ($hoy) {
            $q->whereDate('created_at', $hoy)->where('estado', 'completada');
        })->sum('cantidad');

        $respuesta = "Hoy se vendieron un total de \${$total} en {$cantidad} venta(s), con {$productosVendidos} producto(s) vendidos.";

        return [
            'respuesta' => $respuesta,
            'data' => [
                'total' => $total,
                'cantidad_ventas' => $cantidad,
                'productos_vendidos' => $productosVendidos,
            ],
        ];
    }

    protected function clienteMayorDeuda(): array
    {
        $cliente = Cliente::select('clientes.*')
            ->join('cuentas_cobrar', 'clientes.id', '=', 'cuentas_cobrar.cliente_id')
            ->whereIn('cuentas_cobrar.estado', ['pendiente', 'parcial', 'vencida'])
            ->selectRaw('SUM(cuentas_cobrar.saldo_pendiente) as total_deuda')
            ->groupBy('clientes.id')
            ->orderByDesc('total_deuda')
            ->first();

        if (!$cliente) {
            return [
                'respuesta' => 'No hay clientes con deudas pendientes.',
                'data' => null,
            ];
        }

        $respuesta = "El cliente con mayor deuda es {$cliente->nombreCompleto} con un total de \${$cliente->total_deuda} pendiente.";

        return [
            'respuesta' => $respuesta,
            'data' => [
                'cliente_id' => $cliente->id,
                'nombre' => $cliente->nombreCompleto,
                'cedula' => $cliente->cedula,
                'total_deuda' => $cliente->total_deuda,
            ],
        ];
    }

    protected function productosBajoStock(): array
    {
        $productos = Producto::where('estado', true)
            ->whereColumn('stock', '<=', 'stock_minimo')
            ->orderBy('stock')
            ->get(['id', 'codigo', 'nombre', 'stock', 'stock_minimo']);

        if ($productos->isEmpty()) {
            return [
                'respuesta' => 'No hay productos con stock bajo. Todos los niveles de inventario están saludables.',
                'data' => [],
            ];
        }

        $lista = $productos->take(10)->map(function ($p) {
            return "{$p->nombre} (stock: {$p->stock}, mínimo: {$p->stock_minimo})";
        })->implode(', ');

        $respuesta = "Hay {$productos->count()} producto(s) con stock bajo: {$lista}.";

        return [
            'respuesta' => $respuesta,
            'data' => $productos,
        ];
    }

    protected function productosMasVendidos(): array
    {
        $top = VentaProducto::selectRaw('producto_id, SUM(cantidad) as total_cantidad, SUM(subtotal) as total_ingresos')
            ->whereHas('venta', function ($q) {
                $q->where('estado', 'completada');
            })
            ->groupBy('producto_id')
            ->orderByDesc('total_cantidad')
            ->take(10)
            ->with('producto')
            ->get();

        if ($top->isEmpty()) {
            return [
                'respuesta' => 'No hay ventas registradas aún.',
                'data' => [],
            ];
        }

        $lista = $top->map(function ($item, $index) {
            return ($index + 1) . ". {$item->producto->nombre} ({$item->total_cantidad} vendidos)";
        })->implode(', ');

        $respuesta = "Los productos más vendidos son: {$lista}.";

        return [
            'respuesta' => $respuesta,
            'data' => $top,
        ];
    }
}
