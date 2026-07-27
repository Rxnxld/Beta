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
            'destinatario' => 'required|string',
            'mensaje' => 'required|string',
        ]);

        try {
            $this->whatsApp->sendMessage($validated['destinatario'], $validated['mensaje']);
            return response()->json(['message' => 'Mensaje enviado correctamente.']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function enviarFactura(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'factura_id' => 'required|numeric',
        ]);

        $cliente = Cliente::findOrFail($validated['cliente_id']);

        if (!$cliente->telefono) {
            return response()->json(['message' => 'El cliente no tiene número de teléfono registrado.'], 400);
        }

        $pdfUrl = url("/api/ventas/{$validated['factura_id']}/pdf");

        try {
            $this->whatsApp->sendFactura(
                $cliente->telefono,
                $pdfUrl,
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
            'cliente_id' => 'required|exists:clientes,id',
            'monto' => 'required|numeric',
            'fecha_vencimiento' => 'required|date',
        ]);

        $cliente = Cliente::findOrFail($validated['cliente_id']);

        if (!$cliente->telefono) {
            return response()->json(['message' => 'El cliente no tiene número de teléfono registrado.'], 400);
        }

        $mensaje = "Estimado/a {$cliente->nombre}, le recordamos que tiene un saldo pendiente de \${$validated['monto']} con vencimiento el {$validated['fecha_vencimiento']}. Por favor, realice el pago a la brevedad. ¡Gracias!";

        try {
            $this->whatsApp->sendMessage($cliente->telefono, $mensaje);
            return response()->json(['message' => 'Recordatorio enviado correctamente.']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function enviarPromocion(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'promocion' => 'required|string',
            'cliente_id' => 'required|exists:clientes,id',
        ]);

        $cliente = Cliente::findOrFail($validated['cliente_id']);

        if (!$cliente->telefono) {
            return response()->json(['message' => 'El cliente no tiene número de teléfono registrado.'], 400);
        }

        try {
            $this->whatsApp->sendMessage($cliente->telefono, $validated['promocion']);
            return response()->json(['message' => 'Promoción enviada correctamente.']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
