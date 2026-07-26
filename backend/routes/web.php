<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/setup', function () {
    $token = request('token');

    if ($token !== 'setup2024') {
        return response()->json(['error' => 'Token inválido'], 403);
    }

    $debug = [];

    // Test DB connection
    try {
        DB::connection()->getPdo();
        $debug['db_connection'] = 'OK';
    } catch (\Exception $e) {
        $debug['db_connection'] = 'ERROR: ' . $e->getMessage();
        $debug['db_host'] = env('DB_HOST');
        $debug['db_port'] = env('DB_PORT');
        $debug['db_database'] = env('DB_DATABASE');
        $debug['db_user'] = env('DB_USERNAME');
        $debug['ssl_ca'] = env('MYSQL_ATTR_SSL_CA');
        $debug['php_extensions'] = get_loaded_extensions();
        $debug['pdo_drivers'] = \PDO::getAvailableDrivers();
    }

    if (isset($e)) {
        return response()->json([
            'success' => false,
            'debug' => $debug,
        ]);
    }

    try {
        Artisan::call('migrate', ['--force' => true]);
        $output = Artisan::output();

        Artisan::call('db:seed', ['--force' => true]);
        $output .= "\n" . Artisan::output();

        return response()->json([
            'success' => true,
            'output' => $output,
            'debug' => $debug,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
            'debug' => $debug,
        ], 500);
    }
});
