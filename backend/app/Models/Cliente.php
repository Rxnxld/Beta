<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cliente extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nombre',
        'apellido',
        'cedula',
        'telefono',
        'direccion',
        'correo',
        'fecha_registro',
        'estado',
        'puntos',
    ];

    protected $appends = ['deuda_total', 'nombre_completo'];

    protected function casts(): array
    {
        return [
            'estado' => 'boolean',
            'fecha_registro' => 'date',
            'puntos' => 'integer',
        ];
    }

    public function ventas()
    {
        return $this->hasMany(Venta::class);
    }

    public function cuentasCobrar()
    {
        return $this->hasMany(CuentaCobrar::class);
    }

    public function puntosClientes()
    {
        return $this->hasMany(PuntosCliente::class);
    }

    public function pagos()
    {
        return $this->hasManyThrough(Pago::class, CuentaCobrar::class);
    }

    public function getNombreCompletoAttribute(): string
    {
        return "{$this->nombre} {$this->apellido}";
    }

    public function getDeudaTotalAttribute()
    {
        return $this->cuentasCobrar()
            ->where('estado', '!=', 'pagada')
            ->sum('saldo_pendiente');
    }

    public function getComprasTotalAttribute()
    {
        return $this->ventas()
            ->where('estado', 'completada')
            ->sum('total');
    }
}
