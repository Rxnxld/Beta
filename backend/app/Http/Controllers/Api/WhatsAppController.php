<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\CuentaCobrar;
use App\Services\WhatsAppService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WhatsAppController extends Controller
{
    protected WhatsAppService $whatsApp;

    public function __construct(WhatsAppService $whatsApp)
    {
        $this->whatsApp = $whatsApp;
    }

    public function enviar(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'mensaje' => 'required|string',
        ]);

        $cliente = Cliente::findOrFail($validated['cliente_id']);

        if (!$cliente->telefono) {
            return response()->json(['message' => 'El cliente no tiene número de teléfono registrado.'], 400);
        }

        try {
            $this->whatsApp->sendMessage($cliente->telefono, $validated['mensaje']);
            return response()->json(['message' => 'Mensaje enviado correctamente.']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function enviarFactura(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'pdf_url' => 'required|string',
        ]);

        $cliente = Cliente::findOrFail($validated['cliente_id']);

        if (!$cliente->telefono) {
            return response()->json(['message' => 'El cliente no tiene número de teléfono registrado.'], 400);
        }

        try {
            $this->whatsApp->sendFactura(
                $cliente->telefono,
                $validated['pdf_url'],
                $cliente->nombre
            );
            return response()->json(['message' => 'Factura enviada correctamente.']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function enviarRecordatorio(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'cuenta_cobrar_id' => 'required|exists:cuentas_cobrar,id',
        ]);

        $cuenta = CuentaCobrar::with('cliente')->findOrFail($validated['cuenta_cobrar_id']);

        if (!$cuenta->cliente->telefono) {
            return response()->json(['message' => 'El cliente no tiene número de teléfono registrado.'], 400);
        }

        $mensaje = "Estimado/a {$cuenta->cliente->nombre}, le recordamos que tiene un saldo pendiente de \${$cuenta->saldo_pendiente} con vencimiento el {$cuenta->fecha_vencimiento->format('d/m/Y')}. Por favor, realice el pago a la brevedad. ¡Gracias!";

        try {
            $this->whatsApp->sendMessage($cuenta->cliente->telefono, $mensaje);
            return response()->json(['message' => 'Recordatorio enviado correctamente.']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function enviarPromocion(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'mensaje' => 'required|string',
            'cliente_ids' => 'required|array',
            'cliente_ids.*' => 'exists:clientes,id',
        ]);

        $clientes = Cliente::whereIn('id', $validated['cliente_ids'])
            ->whereNotNull('telefono')
            ->get();

        $enviados = 0;
        $errores = 0;

        foreach ($clientes as $cliente) {
            try {
                $this->whatsApp->sendMessage($cliente->telefono, $validated['mensaje']);
                $enviados++;
            } catch (\Exception $e) {
                $errores++;
                Log::error("Error enviando promoción a {$cliente->id}: {$e->getMessage()}");
            }
        }

        return response()->json([
            'message' => "Promoción enviada. {$enviados} mensajes enviados, {$errores} errores.",
            'enviados' => $enviados,
            'errores' => $errores,
        ]);
    }
}
