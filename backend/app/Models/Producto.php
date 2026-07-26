<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Producto extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'codigo',
        'nombre',
        'categoria_id',
        'descripcion',
        'precio_compra',
        'precio_venta',
        'stock',
        'stock_minimo',
        'imagen',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'estado' => 'boolean',
            'precio_compra' => 'decimal:2',
            'precio_venta' => 'decimal:2',
            'stock' => 'integer',
            'stock_minimo' => 'integer',
        ];
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function ventaProductos()
    {
        return $this->hasMany(VentaProducto::class);
    }

    public function movimientosInventario()
    {
        return $this->hasMany(MovimientoInventario::class);
    }

    public function getBajoStockAttribute(): bool
    {
        return $this->stock <= $this->stock_minimo;
    }
}
