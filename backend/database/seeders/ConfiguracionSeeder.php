<?php

namespace Database\Seeders;

use App\Models\Configuracion;
use Illuminate\Database\Seeder;

class ConfiguracionSeeder extends Seeder
{
    public function run(): void
    {
        $configuraciones = [
            ['clave' => 'empresa_nombre', 'valor' => 'Mi Empresa'],
            ['clave' => 'empresa_direccion', 'valor' => 'Direccion'],
            ['clave' => 'empresa_telefono', 'valor' => '+123456789'],
            ['clave' => 'empresa_email', 'valor' => 'info@empresa.com'],
            ['clave' => 'iva_porcentaje', 'valor' => '19'],
            ['clave' => 'moneda', 'valor' => 'USD'],
            ['clave' => 'whatsapp_numero', 'valor' => ''],
            ['clave' => 'theme', 'valor' => 'light'],
        ];

        foreach ($configuraciones as $config) {
            Configuracion::create($config);
        }
    }
}
