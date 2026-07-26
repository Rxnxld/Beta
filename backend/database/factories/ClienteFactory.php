<?php

namespace Database\Factories;

use App\Models\Cliente;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClienteFactory extends Factory
{
    protected $model = Cliente::class;

    public function definition(): array
    {
        return [
            'nombre' => fake()->firstName(),
            'apellido' => fake()->lastName(),
            'cedula' => fake()->unique()->numerify('########-#'),
            'telefono' => fake()->phoneNumber(),
            'direccion' => fake()->address(),
            'correo' => fake()->unique()->safeEmail(),
            'fecha_registro' => fake()->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
            'estado' => true,
            'puntos' => fake()->numberBetween(0, 500),
        ];
    }
}
