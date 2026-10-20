<?php

namespace App\Models;

use App\Concerns\HasUuidRouteKey;
use Database\Factories\ShippingProviderFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $uuid
 * @property string $name
 * @property string $tracking_url_template
 * @property string|null $tracking_number_pattern
 * @property bool $is_active
 * @property int $sort_order
 */
#[Fillable([
    'name',
    'tracking_url_template',
    'tracking_number_pattern',
    'is_active',
    'sort_order',
])]
class ShippingProvider extends Model
{
    /** @use HasFactory<ShippingProviderFactory> */
    use HasFactory, HasUuidRouteKey;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /** @return HasMany<ShipmentTracking, $this> */
    public function trackings(): HasMany
    {
        return $this->hasMany(ShipmentTracking::class, 'provider_id');
    }

    /**
     * @param  Builder<ShippingProvider>  $query
     * @return Builder<ShippingProvider>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderBy('sort_order')->orderBy('name');
    }
}
