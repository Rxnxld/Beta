<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConfiguracionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'configuraciones' => 'required|array',
            'configuraciones.nombre_empresa' => 'nullable|string|max:200',
            'configuraciones.direccion' => 'nullable|string|max:500',
            'configuraciones.telefono' => 'nullable|string|max:20',
            'configuraciones.email' => 'nullable|email|max:100',
            'configuraciones.iva' => 'nullable|numeric|min:0|max:100',
            'configuraciones.moneda' => 'nullable|string|max:10',
            'configuraciones.terminos_condiciones' => 'nullable|string',
            'configuraciones.mensaje_factura' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'configuraciones.required' => 'Debe enviar al menos una configuración.',
            'configuraciones.array' => 'El formato de configuraciones no es válido.',
        ];
    }
}
