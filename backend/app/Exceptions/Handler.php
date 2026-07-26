<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $levels = [];

    protected $dontReport = [];

    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $e): JsonResponse|\Illuminate\Http\Response
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return $this->handleApiException($request, $e);
        }

        return parent::render($request, $e);
    }

    private function handleApiException(Request $request, Throwable $e): JsonResponse
    {
        $statusCode = 500;
        $message = 'Error interno del servidor';
        $errors = null;

        if ($e instanceof ValidationException) {
            $statusCode = 422;
            $message = 'Error de validacion';
            $errors = $e->errors();
        } elseif ($e instanceof ModelNotFoundException) {
            $statusCode = 404;
            $message = 'Recurso no encontrado';
        } elseif ($e instanceof NotFoundHttpException) {
            $statusCode = 404;
            $message = 'Ruta no encontrada';
        } elseif ($e instanceof AuthenticationException) {
            $statusCode = 401;
            $message = 'No autenticado';
        } elseif ($e instanceof \Illuminate\Auth\Access\AuthorizationException) {
            $statusCode = 403;
            $message = 'No autorizado';
        } elseif ($e instanceof \Symfony\Component\HttpKernel\Exception\HttpException) {
            $statusCode = $e->getStatusCode();
            $message = $e->getMessage() ?: 'Error HTTP';
        } elseif ($e instanceof \Illuminate\Database\QueryException) {
            $statusCode = 500;
            $message = 'Error en la base de datos';
            $errors = ['sql' => $e->getMessage()];
        } elseif ($e instanceof \Error) {
            $statusCode = 500;
            $message = 'Error del servidor';
        }

        $response = [
            'success' => false,
            'status' => $statusCode,
            'message' => $message,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        if (config('app.debug')) {
            $response['debug'] = [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ];
        }

        return response()->json($response, $statusCode);
    }
}
