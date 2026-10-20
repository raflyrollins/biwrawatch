<?php

namespace Database\Factories;

use App\Enums\DiscountType;
use App\Models\Promotion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Promotion>
 */
class PromotionFactory extends Factory
{
    protected $model = Promotion::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(3, true),
            'label' => fake()->words(2, true),
            'description' => fake()->sentence(),
            'discount_type' => DiscountType::Percentage,
            'discount_value' => 10,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDays(30),
            'is_active' => true,
            'applies_to_all' => true,
            'priority' => 0,
        ];
    }
}
