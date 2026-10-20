<?php

namespace Database\Factories;

use App\Enums\WatchCondition;
use App\Enums\WatchStatus;
use App\Models\Watch;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Watch>
 */
class WatchFactory extends Factory
{
    protected $model = Watch::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'brand' => fake()->randomElement(['Rolex', 'Omega', 'Cartier', 'Jaeger-LeCoultre', 'Tudor']),
            'model' => fake()->words(2, true),
            'reference_number' => 'REF-'.fake()->unique()->numerify('######'),
            'year' => fake()->numberBetween(1990, 2024),
            'movement' => fake()->randomElement(['Automatic', 'Manual', 'Quartz']),
            'case_material' => fake()->randomElement(['Stainless Steel', 'Yellow Gold', 'Rose Gold']),
            'case_diameter_mm' => fake()->randomElement([36, 38, 40, 41, 42]),
            'dial_color' => fake()->randomElement(['Black', 'Silver', 'Blue', 'Champagne']),
            'strap_material' => fake()->randomElement(['Leather', 'Steel', 'Rubber']),
            'condition' => WatchCondition::PreOwned,
            'description' => fake()->paragraph(),
            'price' => fake()->numberBetween(20_000_000, 250_000_000),
            'status' => WatchStatus::Available,
            'is_published' => true,
            'is_featured' => false,
            'sort_order' => 0,
        ];
    }
}
