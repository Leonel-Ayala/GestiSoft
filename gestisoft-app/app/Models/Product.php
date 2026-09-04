<?php

namespace App\Models;

use App\Traits\HasNegocio;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory, HasNegocio; // <-- Aplicamos el Trait aquí

    protected $fillable = [
        'sku',
        'name',
        'price',
        'stock',
    ];
}

