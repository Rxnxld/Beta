<?php

namespace App\Providers;

use App\Models\Configuracion;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        if (!app()->runningInConsole()) {
            try {
                $configs = Configuracion::all()->pluck('valor', 'clave')->toArray();
                config(['app.configuraciones' => $configs]);
            } catch (\Exception $e) {
                //
            }
        }

        app()->singleton('configuracion', function ($app) {
            return new class {
                public function get(string $key, $default = null)
                {
                    try {
                        $config = Configuracion::where('clave', $key)->first();
                        return $config ? $config->valor : $default;
                    } catch (\Exception $e) {
                        return $default;
                    }
                }

                public function set(string $key, string $value): void
                {
                    Configuracion::updateOrCreate(
                        ['clave' => $key],
                        ['valor' => $value]
                    );
                }
            };
        });
    }
}
