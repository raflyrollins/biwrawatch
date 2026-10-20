<?php

namespace Database\Factories;

use App\Models\ShippingProvider;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ShippingProvider>
 */
class ShippingProviderFactory extends Factory
{
    protected $model = ShippingProvider::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->company(),
            'tracking_url_template' => 'https://example.com/track/{tracking_number}',
            'tracking_number_pattern' => null,
            'is_active' => true,
            'sort_order' => 0,
        ];
    }
}
