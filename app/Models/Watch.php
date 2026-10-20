<?php

namespace App\Models;

use App\Concerns\HasUuidRouteKey;
use App\Enums\WatchCondition;
use App\Enums\WatchStatus;
use Database\Factories\WatchFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $uuid
 * @property string $brand
 * @property string $model
 * @property string $reference_number
 * @property int|null $year
 * @property string|null $movement
 * @property string|null $case_material
 * @property string|null $case_diameter_mm
 * @property string|null $dial_color
 * @property string|null $strap_material
 * @property WatchCondition $condition
 * @property string|null $description
 * @property string|null $search_keywords
 * @property int $price
 * @property WatchStatus $status
 * @property bool $is_published
 * @property bool $is_featured
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'brand',
    'model',
    'reference_number',
    'year',
    'movement',
    'case_material',
    'case_diameter_mm',
    'dial_color',
    'strap_material',
    'condition',
    'description',
    'search_keywords',
    'price',
    'status',
    'is_published',
    'is_featured',
    'sort_order',
])]
class Watch extends Model
{
    /** @use HasFactory<WatchFactory> */
    use HasFactory, HasUuidRouteKey, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'year' => 'integer',
            'case_diameter_mm' => 'decimal:2',
            'condition' => WatchCondition::class,
            'price' => 'integer',
            'status' => WatchStatus::class,
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /** @return HasMany<WatchImage, $this> */
    public function images(): HasMany
    {
        return $this->hasMany(WatchImage::class)->orderBy('sort_order')->orderBy('id');
    }

    /** @return HasOne<WatchImage, $this> */
    public function primaryImage(): HasOne
    {
        return $this->hasOne(WatchImage::class)->orderBy('sort_order')->orderBy('id');
    }

    /** @return BelongsToMany<Promotion, $this> */
    public function promotions(): BelongsToMany
    {
        return $this->belongsToMany(Promotion::class);
    }

    /**
     * @param  Builder<Watch>  $query
     * @return Builder<Watch>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    /**
     * @param  Builder<Watch>  $query
     * @return Builder<Watch>
     */
    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    /**
     * @param  Builder<Watch>  $query
     * @return Builder<Watch>
     */
    public function scopeAvailable(Builder $query): Builder
    {
        return $query->where('status', WatchStatus::Available);
    }
}
