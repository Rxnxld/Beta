<?php

namespace App\Providers;

use App\Models\Configuracion;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        try {
            if (app()->runningInConsole()) return;

            $hasTable = \Illuminate\Support\Facades\Schema::hasTable('configuraciones');

            if ($hasTable) {
                $configs = Configuracion::all()->pluck('valor', 'clave')->toArray();
                config(['app.configuraciones' => $configs]);
            }
        } catch (\Exception $e) {
            //
        }

        app()->singleton('configuracion', function ($app) {
            return new class {
                public function get(string $key, $default = null)
                {
                    try {
                        if (!\Illuminate\Support\Facades\Schema::hasTable('configuraciones')) return $default;
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

        if (env('RUN_MIGRATE_ON_BOOT', false)) {
            try {
                Artisan::call('migrate', ['--force' => true]);
                Artisan::call('db:seed', ['--force' => true]);
            } catch (\Exception $e) {
                //
            }
        }
    }
}
