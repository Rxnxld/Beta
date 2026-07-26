<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClienteController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\VentaController;
use App\Http\Controllers\Api\FacturaController;
use App\Http\Controllers\Api\CuentaCobrarController;
use App\Http\Controllers\Api\PagoController;
use App\Http\Controllers\Api\InventarioController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReporteController;
use App\Http\Controllers\Api\ConfiguracionController;
use App\Http\Controllers\Api\WhatsAppController;
use App\Http\Controllers\Api\ClienteFrecuenteController;
use App\Http\Controllers\Api\AIController;
use App\Http\Controllers\Api\NotificacionController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/charts', [DashboardController::class, 'charts']);

    Route::apiResource('clientes', ClienteController::class);
    Route::get('clientes/{id}/historial-compras', [ClienteController::class, 'historialCompras']);
    Route::get('clientes/{id}/historial-pagos', [ClienteController::class, 'historialPagos']);
    Route::get('clientes/{id}/historial-deudas', [ClienteController::class, 'historialDeudas']);

    Route::apiResource('categorias', CategoriaController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::apiResource('productos', ProductoController::class);
    Route::get('productos/bajo-stock', [ProductoController::class, 'bajoStock']);
    Route::get('productos/{id}/movimientos', [ProductoController::class, 'movimientos']);

    Route::post('ventas', [VentaController::class, 'store']);
    Route::get('ventas', [VentaController::class, 'index']);
    Route::get('ventas/{id}', [VentaController::class, 'show']);
    Route::put('ventas/{id}/anular', [VentaController::class, 'anular']);
    Route::get('ventas/{id}/pdf', [VentaController::class, 'generarPdf']);

    Route::get('facturas', [FacturaController::class, 'index']);
    Route::get('facturas/{id}', [FacturaController::class, 'show']);
    Route::get('facturas/{id}/pdf', [FacturaController::class, 'generarPdf']);

    Route::get('cuentas-cobrar', [CuentaCobrarController::class, 'index']);
    Route::get('cuentas-cobrar/{id}', [CuentaCobrarController::class, 'show']);
    Route::post('cuentas-cobrar', [CuentaCobrarController::class, 'store']);
    Route::get('cuentas-cobrar/cliente/{clienteId}', [CuentaCobrarController::class, 'porCliente']);

    Route::post('pagos', [PagoController::class, 'store']);
    Route::get('pagos', [PagoController::class, 'index']);
    Route::get('pagos/cuenta/{cuentaId}', [PagoController::class, 'porCuenta']);

    Route::post('inventario/entrada', [InventarioController::class, 'entrada']);
    Route::post('inventario/salida', [InventarioController::class, 'salida']);
    Route::get('inventario/historial', [InventarioController::class, 'historial']);

    Route::get('reportes/ventas', [ReporteController::class, 'ventas']);
    Route::get('reportes/productos', [ReporteController::class, 'productos']);
    Route::get('reportes/clientes', [ReporteController::class, 'clientes']);
    Route::get('reportes/inventario', [ReporteController::class, 'inventario']);
    Route::get('reportes/ganancias', [ReporteController::class, 'ganancias']);
    Route::get('reportes/exportar/{tipo}/{formato}', [ReporteController::class, 'exportar']);

    Route::get('configuraciones', [ConfiguracionController::class, 'index']);
    Route::put('configuraciones', [ConfiguracionController::class, 'update']);
    Route::post('configuraciones/logo', [ConfiguracionController::class, 'subirLogo']);

    Route::post('whatsapp/enviar', [WhatsAppController::class, 'enviar']);
    Route::post('whatsapp/enviar-factura', [WhatsAppController::class, 'enviarFactura']);
    Route::post('whatsapp/recordatorio', [WhatsAppController::class, 'enviarRecordatorio']);
    Route::post('whatsapp/promocion', [WhatsAppController::class, 'enviarPromocion']);

    Route::get('puntos/clientes', [ClienteFrecuenteController::class, 'index']);
    Route::post('puntos/canjear', [ClienteFrecuenteController::class, 'canjear']);

    Route::post('ai/consultar', [AIController::class, 'consultar']);

    Route::get('notificaciones', [NotificacionController::class, 'index']);
    Route::put('notificaciones/{id}/leer', [NotificacionController::class, 'marcarLeido']);
    Route::put('notificaciones/leer-todas', [NotificacionController::class, 'marcarTodasLeidas']);
});
