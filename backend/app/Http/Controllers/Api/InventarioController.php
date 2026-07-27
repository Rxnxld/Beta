<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MovimientoInventario;
use App\Models\Producto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventarioController extends Controller
{
    public function entrada(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'cantidad' => 'required|integer|min:1',
            'observacion' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated) {
            $producto = Producto::findOrFail($validated['producto_id']);
            $stockAnterior = $producto->stock;
            $producto->increment('stock', $validated['cantidad']);

            $movimiento = MovimientoInventario::create([
                'producto_id' => $producto->id,
                'tipo' => 'entrada',
                'cantidad' => $validated['cantidad'],
                'stock_anterior' => $stockAnterior,
                'stock_nuevo' => $producto->fresh()->stock,
                'referencia' => 'Entrada manual',
                'user_id' => auth()->id(),
                'observacion' => $validated['observacion'] ?? 'Entrada de inventario manual',
            ]);

            $movimiento->load('producto', 'user');

            return response()->json($movimiento, 201);
        });
    }

    public function salida(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'cantidad' => 'required|integer|min:1',
            'observacion' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated) {
            $producto = Producto::findOrFail($validated['producto_id']);

            if ($producto->stock < $validated['cantidad']) {
                abort(400, "Stock insuficiente. Disponible: {$producto->stock}, solicitado: {$validated['cantidad']}");
            }

            $stockAnterior = $producto->stock;
            $producto->decrement('stock', $validated['cantidad']);

            $movimiento = MovimientoInventario::create([
                'producto_id' => $producto->id,
                'tipo' => 'salida',
                'cantidad' => $validated['cantidad'],
                'stock_anterior' => $stockAnterior,
                'stock_nuevo' => $producto->fresh()->stock,
                'referencia' => 'Salida manual',
                'user_id' => auth()->id(),
                'observacion' => $validated['observacion'] ?? 'Salida de inventario manual',
            ]);

            $movimiento->load('producto', 'user');

            return response()->json($movimiento, 201);
        });
    }

    public function historial(Request $request): JsonResponse
    {
        $query = MovimientoInventario::with(['producto', 'user']);

        if ($tipo = $request->get('tipo')) {
            $query->where('tipo', $tipo);
        }

        if ($productoId = $request->get('producto_id')) {
            $query->where('producto_id', $productoId);
        }

        $movimientos = $query->orderBy('created_at', 'desc')->get();

        return response()->json($movimientos);
    }
}
