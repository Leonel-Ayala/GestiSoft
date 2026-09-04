<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('negocio_id')->constrained('negocios')->onDelete('cascade');
            $table->string('sku');
            $table->string('name');
            $table->integer('price');
            $table->integer('stock')->default(0); // No permitir negativos se manejará en la validación
            $table->timestamps();

            // Aseguramos que un SKU no se repita dentro del mismo negocio
            $table->unique(['negocio_id', 'sku']); 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

