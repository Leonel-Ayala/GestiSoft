<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\POSController;
use App\Http\Controllers\CajaController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/login');

Route::get('/dashboard', function () {
    if (auth()->check() && auth()->user()->role === 'cajero') {
        return redirect()->route('pos.index');
    }
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::middleware('role:admin')->group(function () {
        Route::resource('inventory', ProductController::class)->parameters(['inventory' => 'product']);
        Route::resource('users', \App\Http\Controllers\UserController::class);
        Route::get('/cajas', [CajaController::class, 'index'])->name('cajas.index');
        Route::get('/cajas/{id}/transacciones', [CajaController::class, 'transacciones'])->name('cajas.transacciones');
    });

    Route::get('/pos', [POSController::class, 'index'])->name('pos.index');
    Route::get('/pos/search', [POSController::class, 'search'])->name('pos.search');
    Route::post('/pos/checkout', [POSController::class, 'checkout'])->name('pos.checkout');

    // Módulo Caja (PBI-03: Arqueo y Cierre de Turno)
    Route::get('/caja/estado', [CajaController::class, 'estado'])->name('caja.estado');
    Route::post('/caja/abrir', [CajaController::class, 'abrir'])->name('caja.abrir');
    Route::post('/caja/cerrar', [CajaController::class, 'cerrar'])->name('caja.cerrar');
    Route::get('/caja/resumen/{id}', [CajaController::class, 'resumen'])->name('caja.resumen');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
