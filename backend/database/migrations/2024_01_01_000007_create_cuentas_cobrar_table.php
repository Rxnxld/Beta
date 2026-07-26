<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cuentas_cobrar', function (Blueprint $table) {
            $table->id();
            $table->foreignId('venta_id')->constrained('ventas')->onDelete('cascade');
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');
            $table->decimal('monto_total', 10, 2);
            $table->decimal('saldo_pendiente', 10, 2);
            $table->date('fecha_vencimiento');
            $table->enum('estado', ['pendiente', 'parcial', 'pagada', 'vencida'])->default('pendiente');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cuentas_cobrar');
    }
};
