<?php

namespace App\Concerns;

use Illuminate\Support\Str;

trait HasUuidRouteKey
{
    protected static function bootHasUuidRouteKey(): void
    {
        static::creating(function (self $model): void {
            if (blank($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }
}
