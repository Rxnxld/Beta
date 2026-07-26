<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'rol',
        'telefono',
        'activo',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'activo' => 'boolean',
        ];
    }

    public function ventas()
    {
        return $this->hasMany(Venta::class);
    }

    public function movimientosInventario()
    {
        return $this->hasMany(MovimientoInventario::class);
    }

    public function notificaciones()
    {
        return $this->hasMany(Notificacion::class);
    }

    public function esAdmin(): bool
    {
        return $this->rol === 'admin';
    }

    public function esVendedor(): bool
    {
        return $this->rol === 'vendedor';
    }

    public function esCajero(): bool
    {
        return $this->rol === 'cajero';
    }
}
