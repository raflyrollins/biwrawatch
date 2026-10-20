<?php

namespace Database\Factories;

use App\Enums\ShipmentStatus;
use App\Models\Shipment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Shipment>
 */
class ShipmentFactory extends Factory
{
    protected $model = Shipment::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $phone = '0812'.fake()->numerify('########');

        return [
            'tracking_number' => 'BW'.now()->format('Ymd').fake()->unique()->numerify('#####'),
            'recipient_name' => fake()->name(),
            'recipient_phone' => $phone,
            'recipient_phone_normalized' => '+62'.mb_substr($phone, 1),
            'recipient_address' => fake()->address(),
            'destination_city' => fake()->city(),
            'destination_country' => 'Indonesia',
            'status' => ShipmentStatus::Pending,
            'estimated_delivery_at' => now()->addDays(3),
            'shipped_at' => null,
            'delivered_at' => null,
            'last_status_at' => now(),
            'internal_notes' => null,
        ];
    }
}
