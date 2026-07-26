<?php

namespace Database\Seeders;

use App\Models\Categoria;
use Illuminate\Database\Seeder;

class CategoriaSeeder extends Seeder
{
    public function run(): void
    {
        $categorias = [
            ['nombre' => 'Electronica', 'descripcion' => 'Productos electronicos y tecnologicos'],
            ['nombre' => 'Ropa', 'descripcion' => 'Prendas de vestir y accesorios'],
            ['nombre' => 'Alimentos', 'descripcion' => 'Productos alimenticios y bebidas'],
            ['nombre' => 'Hogar', 'descripcion' => 'Articulos para el hogar'],
            ['nombre' => 'Oficina', 'descripcion' => 'Suministros y equipos de oficina'],
        ];

        foreach ($categorias as $categoria) {
            Categoria::firstOrCreate(['nombre' => $categoria['nombre']], $categoria);
        }
    }
}
