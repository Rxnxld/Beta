<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateVentaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cliente_id' => 'required|exists:clientes,id',
            'tipo' => 'required|in:contado,credito',
            'productos' => 'required|array|min:1',
            'productos.*.producto_id' => 'required|exists:productos,id',
            'productos.*.cantidad' => 'required|integer|min:1',
            'fecha_vencimiento' => 'required_if:tipo,credito|date',
            'descuento' => 'nullable|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'productos.required' => 'Debe agregar al menos un producto a la venta.',
            'productos.*.producto_id.required' => 'Cada producto debe tener un ID válido.',
            'productos.*.cantidad.required' => 'Cada producto debe tener una cantidad.',
            'productos.*.cantidad.min' => 'La cantidad mínima por producto es 1.',
            'fecha_vencimiento.required_if' => 'La fecha de vencimiento es obligatoria para ventas a crédito.',
        ];
    }
}
