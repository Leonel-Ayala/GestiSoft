<?php

namespace App\Models;

use App\Traits\HasNegocio;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, HasNegocio, SoftDeletes;

    protected $fillable = [
        'sku',
        'name',
        'price',
        'stock',
    ];
}

