<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VendedorMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!in_array(auth()->user()->rol, ['admin', 'vendedor'])) {
            abort(403, 'Acceso denegado. Se requieren permisos de vendedor o administrador.');
        }

        return $next($request);
    }
}
