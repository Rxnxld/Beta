<?php

namespace App\Exports;

use App\Models\Cliente;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ClientesExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Cliente::withSum(['ventas as total_compras' => function ($q) {
            $q->where('estado', 'completada');
        }], 'total')->orderBy('nombre')->get();
    }

    public function headings(): array
    {
        return [
            'Cedula',
            'Nombre',
            'Telefono',
            'Correo',
            'Total Compras',
            'Deuda',
        ];
    }

    public function map($cliente): array
    {
        return [
            $cliente->cedula,
            $cliente->nombreCompleto,
            $cliente->telefono ?? 'N/A',
            $cliente->correo ?? 'N/A',
            number_format($cliente->total_compras ?? 0, 2),
            number_format($cliente->deudaTotal, 2),
        ];
    }
}
