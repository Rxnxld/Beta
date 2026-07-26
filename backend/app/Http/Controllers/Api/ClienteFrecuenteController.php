<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Notificacion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClienteFrecuenteController extends Controller
{
    public function index(): JsonResponse
    {
        $clientes = Cliente::where('estado', true)
            ->orderBy('puntos', 'desc')
            ->get()
            ->map(function ($cliente) {
                return [
                    'id' => $cliente->id,
                    'nombre' => $cliente->nombreCompleto,
                    'cedula' => $cliente->cedula,
                    'telefono' => $cliente->telefono,
                    'puntos' => $cliente->puntos,
                    'total_compras' => $cliente->ventas()->where('estado', 'completada')->count(),
                    'total_gastado' => $cliente->comprasTotal,
                ];
            });

        return response()->json($clientes);
    }

    public function canjear(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
        ]);

        return DB::transaction(function () use ($validated) {
            $cliente = Cliente::findOrFail($validated['cliente_id']);

            if ($cliente->puntos < 100) {
                return response()->json([
                    'message' => "El cliente tiene {$cliente->puntos} puntos. Se necesitan al menos 100 puntos para canjear.",
                ], 400);
            }

            $cliente->decrement('puntos', 100);

            Notificacion::create([
                'user_id' => auth()->id(),
                'tipo' => 'canje',
                'mensaje' => "El cliente {$cliente->nombreCompleto} ha canjeado 100 puntos. Cliente restante: {$cliente->fresh()->puntos} puntos.",
            ]);

            return response()->json([
                'message' => "Canje exitoso. {$cliente->nombre} ha canjeado 100 puntos.",
                'puntos_restantes' => $cliente->fresh()->puntos,
            ]);
        });
    }
}
