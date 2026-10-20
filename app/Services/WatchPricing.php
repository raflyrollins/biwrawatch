<?php

namespace App\Services;

use App\Enums\DiscountType;
use App\Models\Promotion;
use App\Models\Watch;
use Illuminate\Support\Collection;

class WatchPricing
{
    /** @var Collection<int, Promotion>|null */
    private ?Collection $activePromotions = null;

    /**
     * @return array{
     *     original_price: int,
     *     final_price: int,
     *     discount_amount: int,
     *     promotion: array{id: int, name: string, label: string|null}|null
     * }
     */
    public function for(Watch $watch): array
    {
        return $this->pricingFor($watch, $this->activePromotions());
    }

    /**
     * @param  Collection<int, Watch>  $watches
     * @return array<int, array{
     *     original_price: int,
     *     final_price: int,
     *     discount_amount: int,
     *     promotion: array{id: int, name: string, label: string|null}|null
     * }>
     */
    public function forMany(Collection $watches): array
    {
        $promotions = $this->activePromotions();
        $prices = [];

        foreach ($watches as $watch) {
            $prices[$watch->id] = $this->pricingFor($watch, $promotions);
        }

        return $prices;
    }

    /**
     * @return Collection<int, Promotion>
     */
    public function activePromotions(): Collection
    {
        if ($this->activePromotions === null) {
            $this->activePromotions = Promotion::query()
                ->active()
                ->with('watches')
                ->orderByDesc('priority')
                ->orderBy('id')
                ->get();
        }

        return $this->activePromotions;
    }

    /**
     * @param  Collection<int, Promotion>  $promotions
     * @return array{
     *     original_price: int,
     *     final_price: int,
     *     discount_amount: int,
     *     promotion: array{id: int, name: string, label: string|null}|null
     * }
     */
    private function pricingFor(Watch $watch, Collection $promotions): array
    {
        $originalPrice = max(0, (int) $watch->price);
        $best = null;
        $bestFinalPrice = $originalPrice;
        $bestDiscount = 0;
        $badge = null;

        foreach ($promotions as $promotion) {
            if (! $promotion->applies_to_all && ! $promotion->watches->contains('id', $watch->id)) {
                continue;
            }

            if ($promotion->label !== null && $badge === null) {
                $badge = $promotion;
            }

            if (! $promotion->hasDiscount()) {
                continue;
            }

            $discount = $this->discountAmount($promotion, $originalPrice);
            $finalPrice = max(0, $originalPrice - $discount);

            if ($finalPrice < $bestFinalPrice || ($finalPrice === $bestFinalPrice && $best !== null && $promotion->priority > $best->priority)) {
                $best = $promotion;
                $bestFinalPrice = $finalPrice;
                $bestDiscount = $originalPrice - $finalPrice;
            }
        }

        $promotionData = null;
        $promotion = $best ?? $badge;

        if ($promotion !== null) {
            $promotionData = [
                'id' => $promotion->id,
                'name' => $promotion->name,
                'label' => $promotion->label,
            ];
        }

        return [
            'original_price' => $originalPrice,
            'final_price' => $bestFinalPrice,
            'discount_amount' => $bestDiscount,
            'promotion' => $promotionData,
        ];
    }

    private function discountAmount(Promotion $promotion, int $price): int
    {
        $value = max(0, (int) $promotion->discount_value);

        return match ($promotion->discount_type) {
            DiscountType::Percentage => (int) round($price * min(100, $value) / 100),
            DiscountType::Fixed => min($price, $value),
            default => 0,
        };
    }
}
