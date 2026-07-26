<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('producto');

        return [
            'codigo' => 'required|string|max:50|unique:productos,codigo,' . $id,
            'nombre' => 'required|string|max:200',
            'categoria_id' => 'required|exists:categorias,id',
            'descripcion' => 'nullable|string',
            'precio_compra' => 'required|numeric|min:0',
            'precio_venta' => 'required|numeric|min:0|gte:precio_compra',
            'stock' => 'required|integer|min:0',
            'stock_minimo' => 'required|integer|min:0',
            'imagen' => 'nullable|image|max:2048',
            'estado' => 'boolean',
        ];
    }
}
