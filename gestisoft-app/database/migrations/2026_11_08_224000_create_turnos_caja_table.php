<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('turnos_caja', function (Blueprint $table) {
            $table->id();
            $table->foreignId('negocio_id')->constrained('negocios')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('estado', ['abierto', 'cerrado'])->default('abierto');
            $table->integer('monto_inicial')->default(0);
            $table->integer('monto_ventas_efectivo')->default(0);
            $table->integer('monto_ventas_tarjeta')->default(0);
            $table->integer('monto_ventas_transferencia')->default(0);
            $table->integer('total_esperado')->nullable();
            $table->integer('monto_declarado')->nullable();
            $table->integer('diferencia')->nullable();
            $table->timestamp('fecha_apertura');
            $table->timestamp('fecha_cierre')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();

            // Índice para consultas de verificación de turno en el POS
            $table->index(['negocio_id', 'user_id', 'estado']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('turnos_caja');
    }
};

