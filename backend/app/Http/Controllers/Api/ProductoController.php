<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductoRequest;
use App\Models\MovimientoInventario;
use App\Models\Producto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Producto::with('categoria');

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('codigo', 'like', "%{$search}%")
                    ->orWhere('nombre', 'like', "%{$search}%");
            });
        }

        if ($categoriaId = $request->get('categoria_id')) {
            $query->where('categoria_id', $categoriaId);
        }

        $productos = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($productos);
    }

    public function store(ProductoRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('imagen')) {
            $data['imagen'] = $request->file('imagen')->store('productos', 'public');
        }

        $producto = Producto::create($data);

        return response()->json($producto, 201);
    }

    public function show($id): JsonResponse
    {
        $producto = Producto::with('categoria')->findOrFail($id);

        return response()->json($producto);
    }

    public function update(ProductoRequest $request, $id): JsonResponse
    {
        $producto = Producto::findOrFail($id);
        $data = $request->validated();

        if ($request->hasFile('imagen')) {
            if ($producto->imagen) {
                Storage::disk('public')->delete($producto->imagen);
            }
            $data['imagen'] = $request->file('imagen')->store('productos', 'public');
        }

        $producto->update($data);

        return response()->json($producto);
    }

    public function destroy($id): JsonResponse
    {
        $producto = Producto::findOrFail($id);
        $producto->delete();

        return response()->json(['message' => 'Producto eliminado correctamente.']);
    }

    public function bajoStock(): JsonResponse
    {
        $productos = Producto::with('categoria')
            ->where('estado', true)
            ->whereColumn('stock', '<=', 'stock_minimo')
            ->get();

        return response()->json($productos);
    }

    public function movimientos($id): JsonResponse
    {
        Producto::findOrFail($id);

        $movimientos = MovimientoInventario::with('user')
            ->where('producto_id', $id)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($movimientos);
    }
}
