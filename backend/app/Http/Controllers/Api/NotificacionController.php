<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notificacion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificacionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = auth()->user();

        $query = Notificacion::query();

        if ($user->rol !== 'admin') {
            $query->where('user_id', $user->id)
                ->orWhereNull('user_id');
        }

        $notificaciones = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($notificaciones);
    }

    public function marcarLeido($id): JsonResponse
    {
        $notificacion = Notificacion::findOrFail($id);
        $notificacion->update(['leido' => true]);

        return response()->json(['message' => 'Notificación marcada como leída.']);
    }

    public function marcarTodasLeidas(): JsonResponse
    {
        $user = auth()->user();

        Notificacion::where('user_id', $user->id)
            ->orWhereNull('user_id')
            ->update(['leido' => true]);

        return response()->json(['message' => 'Todas las notificaciones fueron marcadas como leídas.']);
    }
}
