<?php

namespace App\Models;

use App\Concerns\HasUuidRouteKey;
use App\Enums\DiscountType;
use Database\Factories\PromotionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $uuid
 * @property string $name
 * @property string|null $label
 * @property string|null $description
 * @property DiscountType|null $discount_type
 * @property int|null $discount_value
 * @property Carbon|null $starts_at
 * @property Carbon|null $ends_at
 * @property bool $is_active
 * @property bool $applies_to_all
 * @property int $priority
 */
#[Fillable([
    'name',
    'label',
    'description',
    'discount_type',
    'discount_value',
    'starts_at',
    'ends_at',
    'is_active',
    'applies_to_all',
    'priority',
])]
class Promotion extends Model
{
    /** @use HasFactory<PromotionFactory> */
    use HasFactory, HasUuidRouteKey;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'discount_type' => DiscountType::class,
            'discount_value' => 'integer',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'is_active' => 'boolean',
            'applies_to_all' => 'boolean',
            'priority' => 'integer',
        ];
    }

    /** @return BelongsToMany<Watch, $this> */
    public function watches(): BelongsToMany
    {
        return $this->belongsToMany(Watch::class);
    }

    /**
     * @param  Builder<Promotion>  $query
     * @return Builder<Promotion>
     */
    public function scopeActive(Builder $query): Builder
    {
        $now = now();

        return $query
            ->where('is_active', true)
            ->where(fn (Builder $query) => $query->whereNull('starts_at')->orWhere('starts_at', '<=', $now))
            ->where(fn (Builder $query) => $query->whereNull('ends_at')->orWhere('ends_at', '>=', $now));
    }

    public function hasDiscount(): bool
    {
        return $this->discount_type !== null && $this->discount_value !== null;
    }
}
