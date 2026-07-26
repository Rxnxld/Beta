<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CajeroMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!in_array(auth()->user()->rol, ['admin', 'cajero'])) {
            abort(403, 'Acceso denegado. Se requieren permisos de cajero o administrador.');
        }

        return $next($request);
    }
}
