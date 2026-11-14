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

