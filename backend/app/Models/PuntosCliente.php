<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PuntosCliente extends Model
{
    use HasFactory;

    protected $fillable = [
        'cliente_id',
        'venta_id',
        'puntos',
        'concepto',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function venta()
    {
        return $this->belongsTo(Venta::class);
    }
}
