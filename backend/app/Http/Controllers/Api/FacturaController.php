<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Factura;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;

class FacturaController extends Controller
{
    public function index(): JsonResponse
    {
        $facturas = Factura::with(['venta.cliente', 'venta.user'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($facturas);
    }

    public function show($id): JsonResponse
    {
        $factura = Factura::with(['venta.cliente', 'venta.user', 'venta.productos.producto', 'venta.cuentaCobrar'])->findOrFail($id);

        return response()->json($factura);
    }

    public function generarPdf($id): \Illuminate\Http\Response
    {
        $factura = Factura::with(['venta.cliente', 'venta.user', 'venta.productos.producto'])->findOrFail($id);
        $config = config('app.configuraciones', []);
        $venta = $factura->venta;

        $pdf = Pdf::loadView('pdf.factura', compact('venta', 'config'));

        return $pdf->download("factura-{$factura->numero_factura}.pdf");
    }
}
