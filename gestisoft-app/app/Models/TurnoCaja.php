<?php

namespace App\Models;

use App\Traits\HasNegocio;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TurnoCaja extends Model
{
    use HasFactory, HasNegocio;

    protected $table = 'turnos_caja';

    protected $fillable = [
        'negocio_id',
        'user_id',
        'estado',
        'monto_inicial',
        'monto_ventas_efectivo',
        'monto_ventas_debito',
        'monto_ventas_credito',
        'monto_ventas_tarjeta',
        'monto_ventas_transferencia',
        'total_esperado',
        'monto_declarado',
        'diferencia',
        'fecha_apertura',
        'fecha_cierre',
        'observaciones',
    ];

    protected function casts(): array
    {
        return [
            'fecha_apertura' => 'datetime',
            'fecha_cierre' => 'datetime',
            'monto_inicial' => 'integer',
            'monto_ventas_efectivo' => 'integer',
            'monto_ventas_debito' => 'integer',
            'monto_ventas_credito' => 'integer',
            'monto_ventas_tarjeta' => 'integer',
            'monto_ventas_transferencia' => 'integer',
            'total_esperado' => 'integer',
            'monto_declarado' => 'integer',
            'diferencia' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ventas(): HasMany
    {
        return $this->hasMany(Venta::class, 'turno_caja_id');
    }

    /**
     * Scope para filtrar únicamente turnos abiertos.
     */
    public function scopeAbierto($query)
    {
        return $query->where('estado', 'abierto');
    }

    /**
     * Recalcula y actualiza los totales acumulados por método de pago a partir de las ventas asociadas.
     */
    public function sincronizarTotales(): void
    {
        $ventasEfectivo = (int) $this->ventas()
            ->whereIn('payment_method', ['Efectivo', 'efectivo', 'cash'])
            ->sum('total');

        $ventasDebito = (int) $this->ventas()
            ->whereIn('payment_method', ['Débito', 'Debito', 'debito', 'debit'])
            ->sum('total');

        $ventasCredito = (int) $this->ventas()
            ->whereIn('payment_method', ['Crédito', 'Credito', 'credito', 'credit'])
            ->sum('total');

        $ventasTransferencia = (int) $this->ventas()
            ->whereIn('payment_method', ['Transferencia', 'transferencia', 'transfer'])
            ->sum('total');

        $ventasTarjetaLegacy = (int) $this->ventas()
            ->whereIn('payment_method', ['Tarjeta', 'tarjeta', 'card'])
            ->sum('total');

        $ventasTarjetaTotal = $ventasDebito + $ventasCredito + $ventasTarjetaLegacy;

        $this->update([
            'monto_ventas_efectivo' => $ventasEfectivo,
            'monto_ventas_debito' => $ventasDebito,
            'monto_ventas_credito' => $ventasCredito,
            'monto_ventas_tarjeta' => $ventasTarjetaTotal,
            'monto_ventas_transferencia' => $ventasTransferencia,
            'total_esperado' => $this->monto_inicial + $ventasEfectivo,
        ]);
    }
}

