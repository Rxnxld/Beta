<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ClienteRequest;
use App\Models\Cliente;
use App\Models\CuentaCobrar;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Cliente::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                    ->orWhere('apellido', 'like', "%{$search}%")
                    ->orWhere('cedula', 'like', "%{$search}%")
                    ->orWhere('telefono', 'like', "%{$search}%");
            });
        }

        if ($request->has('estado')) {
            $query->where('estado', $request->boolean('estado'));
        }

        $clientes = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($clientes);
    }

    public function store(ClienteRequest $request): JsonResponse
    {
        $cliente = Cliente::create($request->validated());

        return response()->json($cliente, 201);
    }

    public function show($id): JsonResponse
    {
        $cliente = Cliente::withSum(['ventas as total_compras' => function ($q) {
            $q->where('estado', 'completada');
        }], 'total')->findOrFail($id);

        $deudaActual = CuentaCobrar::where('cliente_id', $id)
            ->whereIn('estado', ['pendiente', 'parcial', 'vencida'])
            ->sum('saldo_pendiente');

        $cliente->deuda_actual = $deudaActual;

        return response()->json($cliente);
    }

    public function update(ClienteRequest $request, $id): JsonResponse
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->update($request->validated());

        return response()->json($cliente);
    }

    public function destroy($id): JsonResponse
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->delete();

        return response()->json(['message' => 'Cliente eliminado correctamente.']);
    }

    public function historialCompras($id): JsonResponse
    {
        $cliente = Cliente::findOrFail($id);

        $ventas = $cliente->ventas()
            ->with('productos.producto')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($ventas);
    }

    public function historialPagos($id): JsonResponse
    {
        $cliente = Cliente::findOrFail($id);

        $pagos = $cliente->pagos()
            ->with('cuentaCobrar.venta')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($pagos);
    }

    public function historialDeudas($id): JsonResponse
    {
        $cliente = Cliente::findOrFail($id);

        $cuentas = $cliente->cuentasCobrar()
            ->with('pagos')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($cuentas);
    }
}
