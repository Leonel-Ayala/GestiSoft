<?php

namespace App\Models;

use App\Traits\HasNegocio;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    use HasFactory, HasNegocio;

    protected $fillable = [
        'user_id',
        'total',
        'payment_method',
        'amount_received',
        'change',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function detalles()
    {
        return $this->hasMany(VentaDetalle::class);
    }
}
