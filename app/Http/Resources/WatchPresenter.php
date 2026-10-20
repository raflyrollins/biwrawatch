<?php

namespace App\Http\Resources;

use App\Models\Promotion;
use App\Models\Watch;
use App\Models\WatchImage;
use App\Services\WatchPricing;
use App\Services\WhatsAppLink;
use Illuminate\Support\Facades\Storage;

/**
 * @phpstan-type Price array{
 *     original_price: int,
 *     final_price: int,
 *     discount_amount: int,
 *     promotion: array{id: int, name: string, label: string|null}|null
 * }
 */
class WatchPresenter
{
    public function __construct(
        private readonly WatchPricing $pricing,
        private readonly WhatsAppLink $whatsApp,
    ) {}

    /**
     * @param  Price|null  $price
     * @return array<string, mixed>
     */
    public function card(Watch $watch, ?array $price = null): array
    {
        $price ??= $this->pricing->for($watch);

        return [
            'id' => $watch->id,
            'uuid' => $watch->uuid,
            'brand' => $watch->brand,
            'model' => $watch->model,
            'reference_number' => $watch->reference_number,
            'year' => $watch->year,
            'condition' => [
                'value' => $watch->condition->value,
                'label' => $watch->condition->label(),
            ],
            'status' => [
                'value' => $watch->status->value,
                'label' => $watch->status->label(),
            ],
            'price' => $watch->price,
            'pricing' => $price,
            'is_featured' => $watch->is_featured,
            'image' => $this->image($watch->primaryImage),
            'url' => route('watches.show', $watch),
        ];
    }

    /**
     * @param  Price|null  $price
     * @return array<string, mixed>
     */
    public function detail(Watch $watch, ?array $price = null): array
    {
        $price ??= $this->pricing->for($watch);
        $watch->loadMissing('images');

        return [
            ...$this->card($watch, $price),
            'description' => $watch->description,
            'movement' => $watch->movement,
            'case_material' => $watch->case_material,
            'case_diameter_mm' => $watch->case_diameter_mm !== null ? (float) $watch->case_diameter_mm : null,
            'dial_color' => $watch->dial_color,
            'strap_material' => $watch->strap_material,
            'images' => $watch->images->map(fn (WatchImage $image): array => $this->image($image))->values()->all(),
            'whatsapp_url' => $watch->status->value === 'available' ? $this->whatsApp->forWatch($watch) : null,
        ];
    }

    /**
     * @param  Price|null  $price
     * @return array<string, mixed>
     */
    public function adminSummary(Watch $watch, ?array $price = null): array
    {
        return [
            ...$this->card($watch, $price),
            'is_published' => $watch->is_published,
            'sort_order' => $watch->sort_order,
            'created_at' => $watch->created_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function admin(Watch $watch): array
    {
        $watch->loadMissing(['images', 'promotions']);

        return [
            ...$this->detail($watch),
            'is_published' => $watch->is_published,
            'sort_order' => $watch->sort_order,
            'search_keywords' => $watch->search_keywords,
            'promotions' => $watch->promotions->map(fn (Promotion $promotion): array => [
                'id' => $promotion->id,
                'name' => $promotion->name,
                'label' => $promotion->label,
            ])->values()->all(),
            'created_at' => $watch->created_at?->toIso8601String(),
            'updated_at' => $watch->updated_at?->toIso8601String(),
        ];
    }

    /**
     * @return array{id: int, path: string, url: string, alt: string, sort_order: int}|null
     */
    private function image(?WatchImage $image): ?array
    {
        if ($image === null) {
            return null;
        }

        return [
            'id' => $image->id,
            'path' => $image->path,
            'url' => $this->imageUrl($image->path),
            'alt' => $image->alt ?? '',
            'sort_order' => $image->sort_order,
        ];
    }

    private function imageUrl(string $path): string
    {
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        if (str_starts_with($path, '/')) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }
}
