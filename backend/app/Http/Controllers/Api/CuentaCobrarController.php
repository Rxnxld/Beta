<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CuentaCobrar;
use App\Models\Venta;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CuentaCobrarController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = CuentaCobrar::with(['cliente', 'venta'])->withCount('pagos');

        if ($estado = $request->get('estado')) {
            $query->where('estado', $estado);
        }

        $cuentas = $query->orderBy('created_at', 'desc')->get();

        return response()->json($cuentas);
    }

    public function show($id): JsonResponse
    {
        $cuenta = CuentaCobrar::with(['cliente', 'venta.productos.producto', 'pagos'])->findOrFail($id);

        return response()->json($cuenta);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'venta_id' => 'required|exists:ventas,id',
        ]);

        $venta = Venta::findOrFail($validated['venta_id']);

        $cuenta = CuentaCobrar::create([
            'venta_id' => $venta->id,
            'cliente_id' => $venta->cliente_id,
            'monto_total' => $venta->total,
            'saldo_pendiente' => $venta->total,
            'fecha_vencimiento' => $request->fecha_vencimiento ?? now()->addDays(30),
            'estado' => 'pendiente',
        ]);

        return response()->json($cuenta, 201);
    }

    public function porCliente($clienteId): JsonResponse
    {
        $cuentas = CuentaCobrar::with(['venta', 'pagos'])
            ->where('cliente_id', $clienteId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($cuentas);
    }
}
