<?php

namespace Database\Factories;

use App\Models\Shipment;
use App\Models\ShipmentTracking;
use App\Models\ShippingProvider;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ShipmentTracking>
 */
class ShipmentTrackingFactory extends Factory
{
    protected $model = ShipmentTracking::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'shipment_id' => Shipment::factory(),
            'provider_id' => ShippingProvider::factory(),
            'tracking_number' => fake()->unique()->bothify('TRK########'),
            'is_primary' => false,
            'added_at' => now(),
            'notes' => null,
        ];
    }
}
