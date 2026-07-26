<?php

namespace Database\Factories;

use App\Models\Producto;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductoFactory extends Factory
{
    protected $model = Producto::class;

    public function definition(): array
    {
        return [
            'codigo' => fake()->unique()->bothify('PROD-####'),
            'nombre' => fake()->words(3, true),
            'categoria_id' => fake()->numberBetween(1, 5),
            'descripcion' => fake()->sentence(),
            'precio_compra' => fake()->randomFloat(2, 100, 1000),
            'precio_venta' => fake()->randomFloat(2, 200, 2000),
            'stock' => fake()->numberBetween(0, 100),
            'stock_minimo' => fake()->numberBetween(1, 10),
            'imagen' => null,
            'estado' => true,
        ];
    }
}
