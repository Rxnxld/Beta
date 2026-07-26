<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AIController extends Controller
{
    protected AIService $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    public function consultar(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'pregunta' => 'required|string|min:3',
        ]);

        $resultado = $this->aiService->consultar($validated['pregunta']);

        return response()->json([
            'pregunta' => $validated['pregunta'],
            'respuesta' => $resultado['respuesta'],
            'data' => $resultado['data'] ?? null,
        ]);
    }
}
