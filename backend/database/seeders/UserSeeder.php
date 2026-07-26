<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('password'),
                'rol' => 'admin',
                'telefono' => '+56911111111',
                'activo' => true,
            ]
        );

        User::firstOrCreate(
            ['email' => 'vendedor@vendedor.com'],
            [
                'name' => 'Vendedor',
                'password' => Hash::make('password'),
                'rol' => 'vendedor',
                'telefono' => '+56922222222',
                'activo' => true,
            ]
        );

        User::firstOrCreate(
            ['email' => 'cajero@cajero.com'],
            [
                'name' => 'Cajero',
                'password' => Hash::make('password'),
                'rol' => 'cajero',
                'telefono' => '+56933333333',
                'activo' => true,
            ]
        );
    }
}
