<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('movimientos_inventario', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained('productos')->onDelete('cascade');
            $table->enum('tipo', ['entrada', 'salida']);
            $table->integer('cantidad');
            $table->integer('stock_anterior');
            $table->integer('stock_nuevo');
            $table->string('referencia')->nullable();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->text('observacion')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movimientos_inventario');
    }
};
