<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClienteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('cliente');

        return [
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'cedula' => 'required|string|max:20|unique:clientes,cedula,' . $id,
            'telefono' => 'required|string|max:20',
            'direccion' => 'nullable|string',
            'correo' => 'nullable|email|max:100|unique:clientes,correo,' . $id,
            'estado' => 'boolean',
        ];
    }
}
