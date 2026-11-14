<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // DEF-18: SQLite no soporta alteración de foreign keys mediante dropForeign() sin recrear la tabla.
        // La restricción referencial física restrictOnDelete se aplica en motores RDBMS de producción (MySQL/PostgreSQL),
        // mientras que a nivel de aplicación la integridad del Kardex ante eliminaciones está blindada por SoftDeletes
        // en el modelo Product y validada en CI por InventoryTest::test_eliminar_producto_conserva_kardex.
        if (DB::getDriverName() !== 'sqlite') {
            Schema::table('movimiento_stocks', function (Blueprint $table) {
                $table->dropForeign(['product_id']);
                $table->dropForeign(['user_id']);
                $table->foreign('product_id')->references('id')->on('products')->restrictOnDelete();
                $table->foreign('user_id')->references('id')->on('users')->restrictOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() !== 'sqlite') {
            Schema::table('movimiento_stocks', function (Blueprint $table) {
                $table->dropForeign(['product_id']);
                $table->dropForeign(['user_id']);
                $table->foreign('product_id')->references('id')->on('products')->cascadeOnDelete();
                $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            });
        }
    }
};

