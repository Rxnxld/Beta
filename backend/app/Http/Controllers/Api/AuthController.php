<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        if (!$user->activo) {
            return response()->json([
                'message' => 'Tu cuenta está desactivada. Contacta al administrador.',
            ], 403);
        }

        $abilities = match ($user->rol) {
            'admin' => ['admin', 'vendedor', 'cajero'],
            'vendedor' => ['vendedor'],
            'cajero' => ['cajero'],
            default => [],
        };

        $token = $user->createToken('auth-token', $abilities)->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada correctamente.']);
    }

    public function user(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->notificaciones_no_leidas = $user->notificaciones()->where('leido', false)->count();

        return response()->json($user);
    }
}
