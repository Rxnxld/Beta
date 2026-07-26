<?php

namespace App\Exports;

use App\Models\Venta;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class VentasExport implements FromCollection, WithHeadings, WithMapping
{
    protected $desde;
    protected $hasta;

    public function __construct($desde = null, $hasta = null)
    {
        $this->desde = $desde;
        $this->hasta = $hasta;
    }

    public function collection()
    {
        $query = Venta::with(['cliente', 'factura'])->where('estado', 'completada');

        if ($this->desde) {
            $query->whereDate('created_at', '>=', $this->desde);
        }

        if ($this->hasta) {
            $query->whereDate('created_at', '<=', $this->hasta);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function headings(): array
    {
        return [
            'Numero Factura',
            'Cliente',
            'Fecha',
            'Subtotal',
            'IVA',
            'Descuento',
            'Total',
            'Estado',
        ];
    }

    public function map($venta): array
    {
        return [
            $venta->factura ? $venta->factura->numero_factura : 'N/A',
            $venta->cliente ? $venta->cliente->nombreCompleto : 'Cliente ocasional',
            $venta->created_at->format('d/m/Y'),
            number_format($venta->subtotal, 2),
            number_format($venta->iva, 2),
            number_format($venta->descuento, 2),
            number_format($venta->total, 2),
            ucfirst($venta->estado),
        ];
    }
}
