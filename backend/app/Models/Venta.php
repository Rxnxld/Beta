<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    use HasFactory;

    protected $fillable = [
        'cliente_id',
        'user_id',
        'tipo',
        'subtotal',
        'iva',
        'descuento',
        'total',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'iva' => 'decimal:2',
            'descuento' => 'decimal:2',
            'total' => 'decimal:2',
        ];
    }

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function productos()
    {
        return $this->hasMany(VentaProducto::class);
    }

    public function factura()
    {
        return $this->hasOne(Factura::class);
    }

    public function cuentaCobrar()
    {
        return $this->hasOne(CuentaCobrar::class);
    }
}
