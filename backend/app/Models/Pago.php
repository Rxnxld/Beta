<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    use HasFactory;

    protected $fillable = [
        'cuenta_cobrar_id',
        'monto',
        'metodo_pago',
        'fecha',
        'observacion',
    ];

    protected function casts(): array
    {
        return [
            'monto' => 'decimal:2',
            'fecha' => 'date',
        ];
    }

    public function cuentaCobrar()
    {
        return $this->belongsTo(CuentaCobrar::class);
    }
}
