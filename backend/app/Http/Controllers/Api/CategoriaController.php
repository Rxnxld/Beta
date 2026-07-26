<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CategoriaController extends Controller
{
    public function index(): JsonResponse
    {
        $categorias = Categoria::where('estado', true)->orderBy('nombre')->get();

        return response()->json($categorias);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:categorias,nombre',
            'descripcion' => 'nullable|string',
            'estado' => 'boolean',
        ]);

        $categoria = Categoria::create($validated);

        return response()->json($categoria, 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $categoria = Categoria::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:categorias,nombre,' . $id,
            'descripcion' => 'nullable|string',
            'estado' => 'boolean',
        ]);

        $categoria->update($validated);

        return response()->json($categoria);
    }

    public function destroy($id): JsonResponse
    {
        $categoria = Categoria::findOrFail($id);

        if ($categoria->productos()->count() > 0) {
            throw ValidationException::withMessages([
                'categoria' => ['No se puede eliminar la categoría porque tiene productos vinculados.'],
            ]);
        }

        $categoria->delete();

        return response()->json(['message' => 'Categoría eliminada correctamente.']);
    }
}
