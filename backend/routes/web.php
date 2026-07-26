<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

Route::get('/setup', function () {
    $token = request('token');

    if ($token !== 'setup2024') {
        return response()->json(['error' => 'Token inválido'], 403);
    }

    try {
        Artisan::call('migrate:fresh', ['--force' => true, '--seed' => true]);
        $output = Artisan::output();

        return response()->json([
            'success' => true,
            'output' => $output,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
        ], 500);
    }
});
