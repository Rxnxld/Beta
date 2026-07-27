<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PagoRequest;
use App\Models\CuentaCobrar;
use App\Models\Pago;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PagoController extends Controller
{
    public function store(PagoRequest $request): JsonResponse
    {
        $validated = $request->validated();

        return DB::transaction(function () use ($validated) {
            $cuenta = CuentaCobrar::findOrFail($validated['cuenta_cobrar_id']);

            if ($cuenta->estado === 'pagada') {
                abort(400, 'Esta cuenta ya está pagada.');
            }

            if ($validated['monto'] > $cuenta->saldo_pendiente) {
                abort(400, "El monto del pago ({$validated['monto']}) excede el saldo pendiente ({$cuenta->saldo_pendiente}).");
            }

            $pago = Pago::create($validated);

            $nuevoSaldo = $cuenta->saldo_pendiente - $validated['monto'];

            if ($nuevoSaldo <= 0) {
                $cuenta->update([
                    'saldo_pendiente' => 0,
                    'estado' => 'pagada',
                ]);
            } else {
                $cuenta->update([
                    'saldo_pendiente' => $nuevoSaldo,
                    'estado' => 'parcial',
                ]);
            }

            $pago->load('cuentaCobrar.cliente');

            return response()->json($pago, 201);
        });
    }

    public function index(Request $request): JsonResponse
    {
        $pagos = Pago::with(['cuentaCobrar.cliente', 'cuentaCobrar.venta'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($pagos);
    }

    public function porCuenta($cuentaId): JsonResponse
    {
        $pagos = Pago::where('cuenta_cobrar_id', $cuentaId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($pagos);
    }
}
