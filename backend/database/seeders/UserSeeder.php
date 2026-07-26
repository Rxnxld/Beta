<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@admin.com',
            'password' => Hash::make('password'),
            'rol' => 'admin',
            'telefono' => '+56911111111',
            'activo' => true,
        ]);

        User::create([
            'name' => 'Vendedor',
            'email' => 'vendedor@vendedor.com',
            'password' => Hash::make('password'),
            'rol' => 'vendedor',
            'telefono' => '+56922222222',
            'activo' => true,
        ]);

        User::create([
            'name' => 'Cajero',
            'email' => 'cajero@cajero.com',
            'password' => Hash::make('password'),
            'rol' => 'cajero',
            'telefono' => '+56933333333',
            'activo' => true,
        ]);
    }
}
