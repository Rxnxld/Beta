<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->string('apellido', 100);
            $table->string('cedula', 20)->unique();
            $table->string('telefono', 20)->nullable();
            $table->text('direccion')->nullable();
            $table->string('correo', 100)->nullable();
            $table->date('fecha_registro')->nullable();
            $table->boolean('estado')->default(true);
            $table->integer('puntos')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};
