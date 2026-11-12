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
        Schema::table('turnos_caja', function (Blueprint $table) {
            if (!Schema::hasColumn('turnos_caja', 'monto_ventas_debito')) {
                $table->integer('monto_ventas_debito')->default(0)->after('monto_ventas_efectivo');
            }
            if (!Schema::hasColumn('turnos_caja', 'monto_ventas_credito')) {
                $table->integer('monto_ventas_credito')->default(0)->after('monto_ventas_debito');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('turnos_caja', function (Blueprint $table) {
            $table->dropColumn(['monto_ventas_debito', 'monto_ventas_credito']);
        });
    }
};

