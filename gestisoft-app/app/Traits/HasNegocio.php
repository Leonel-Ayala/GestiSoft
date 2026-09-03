<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use App\Models\Negocio;

trait HasNegocio
{
    protected static function bootHasNegocio()
    {
        // Global Scope: Filtra automáticamente los queries por el negocio del usuario logueado
        static::addGlobalScope('negocio', function (Builder $builder) {
            if (Auth::hasUser() && Auth::user()->negocio_id) {
                // Especificamos la tabla para evitar ambigüedades en joins
                $builder->where($builder->getModel()->getTable() . '.negocio_id', Auth::user()->negocio_id);
            }
        });

        // Evento Creating: Asigna el negocio_id automáticamente al insertar un nuevo registro
        static::creating(function ($model) {
            if (Auth::hasUser() && Auth::user()->negocio_id && empty($model->negocio_id)) {
                $model->negocio_id = Auth::user()->negocio_id;
            }
        });
    }

    public function negocio()
    {
        return $this->belongsTo(Negocio::class);
    }
}
