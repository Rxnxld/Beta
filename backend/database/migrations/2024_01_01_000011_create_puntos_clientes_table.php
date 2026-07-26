<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('puntos_clientes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');
            $table->foreignId('venta_id')->constrained('ventas')->onDelete('cascade');
            $table->integer('puntos');
            $table->string('concepto', 200);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('puntos_clientes');
    }
};
