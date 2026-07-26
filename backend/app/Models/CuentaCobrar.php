<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CuentaCobrar extends Model
{
    use HasFactory;

    protected $fillable = [
        'venta_id',
        'cliente_id',
        'monto_total',
        'saldo_pendiente',
        'fecha_vencimiento',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'monto_total' => 'decimal:2',
            'saldo_pendiente' => 'decimal:2',
            'fecha_vencimiento' => 'date',
        ];
    }

    public function venta()
    {
        return $this->belongsTo(Venta::class);
    }

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function pagos()
    {
        return $this->hasMany(Pago::class);
    }
}
