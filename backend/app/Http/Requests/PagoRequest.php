<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PagoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cuenta_cobrar_id' => 'required|exists:cuentas_cobrar,id',
            'monto' => 'required|numeric|min:0.01',
            'metodo_pago' => 'required|in:efectivo,tarjeta,transferencia,otro',
            'fecha' => 'required|date',
            'observacion' => 'nullable|string',
        ];
    }
}
