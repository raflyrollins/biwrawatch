<?php

namespace Database\Factories;

use App\Models\Watch;
use App\Models\WatchImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WatchImage>
 */
class WatchImageFactory extends Factory
{
    protected $model = WatchImage::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'watch_id' => Watch::factory(),
            'path' => 'watches/'.fake()->unique()->slug(3).'.jpg',
            'alt' => fake()->words(4, true),
            'sort_order' => 0,
        ];
    }
}
