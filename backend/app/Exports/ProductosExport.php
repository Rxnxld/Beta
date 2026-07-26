<?php

namespace App\Exports;

use App\Models\Producto;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ProductosExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Producto::with('categoria')->orderBy('nombre')->get();
    }

    public function headings(): array
    {
        return [
            'Codigo',
            'Nombre',
            'Categoria',
            'Stock',
            'Precio Compra',
            'Precio Venta',
        ];
    }

    public function map($producto): array
    {
        return [
            $producto->codigo,
            $producto->nombre,
            $producto->categoria ? $producto->categoria->nombre : 'Sin categoría',
            $producto->stock,
            number_format($producto->precio_compra, 2),
            number_format($producto->precio_venta, 2),
        ];
    }
}
