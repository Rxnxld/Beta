<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ConfiguracionRequest;
use App\Models\Configuracion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ConfiguracionController extends Controller
{
    public function index(): JsonResponse
    {
        $configs = Configuracion::all()->pluck('valor', 'clave');

        return response()->json($configs);
    }

    public function update(ConfiguracionRequest $request): JsonResponse
    {
        $configuraciones = $request->input('configuraciones');

        foreach ($configuraciones as $clave => $valor) {
            Configuracion::updateOrCreate(
                ['clave' => $clave],
                ['valor' => $valor]
            );
        }

        config(['app.configuraciones' => Configuracion::all()->pluck('valor', 'clave')->toArray()]);

        return response()->json(['message' => 'Configuraciones actualizadas correctamente.']);
    }

    public function subirLogo(Request $request): JsonResponse
    {
        $request->validate([
            'logo' => 'required|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('config', 'public');

            Configuracion::updateOrCreate(
                ['clave' => 'logo'],
                ['valor' => $path]
            );

            config(['app.configuraciones.logo' => $path]);

            $url = Storage::url($path);

            return response()->json([
                'message' => 'Logo actualizado correctamente.',
                'url' => $url,
            ]);
        }

        return response()->json(['message' => 'No se recibió ningún archivo.'], 400);
    }
}
