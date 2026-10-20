<?php

namespace Database\Seeders;

use App\Enums\ShipmentStatus;
use App\Models\Shipment;
use App\Models\ShipmentEvent;
use App\Models\ShipmentTracking;
use App\Models\ShippingProvider;
use App\Models\User;
use App\Services\PhoneNormalizer;
use App\Services\TrackingNumberGenerator;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShippingSeeder extends Seeder
{
    public function run(): void
    {
        $providers = [
            [
                'name' => 'JNE',
                'tracking_url_template' => 'https://www.jne.co.id/id/tracking/trace/{tracking_number}',
                'tracking_number_pattern' => null,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'J&T Express',
                'tracking_url_template' => 'https://www.jet.co.id/track?awb={tracking_number}',
                'tracking_number_pattern' => null,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'SiCepat',
                'tracking_url_template' => 'https://www.sicepat.com/checkAwb?awb={tracking_number}',
                'tracking_number_pattern' => null,
                'is_active' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($providers as $provider) {
            ShippingProvider::query()->updateOrCreate(
                ['name' => $provider['name']],
                $provider,
            );
        }

        if (app()->isProduction() || DB::getDriverName() !== 'pgsql' || Shipment::query()->exists()) {
            return;
        }

        $provider = ShippingProvider::query()->where('name', 'JNE')->firstOrFail();
        $admin = User::query()->where('is_admin', true)->first();
        $phone = new PhoneNormalizer;

        $shipment = Shipment::query()->create([
            'tracking_number' => app(TrackingNumberGenerator::class)->next(),
            'recipient_name' => 'Andi Pratama',
            'recipient_phone' => '081234567890',
            'recipient_phone_normalized' => $phone->normalize('081234567890'),
            'recipient_address' => 'Jl. Senopati No. 21, Kebayoran Baru',
            'destination_city' => 'Jakarta Selatan',
            'destination_country' => 'Indonesia',
            'status' => ShipmentStatus::InTransit,
            'estimated_delivery_at' => now()->addDays(2),
            'shipped_at' => now()->subDay(),
            'last_status_at' => now()->subHours(2),
        ]);

        ShipmentTracking::query()->create([
            'shipment_id' => $shipment->id,
            'provider_id' => $provider->id,
            'tracking_number' => 'JNE1234567890',
            'is_primary' => true,
            'added_at' => now()->subDay(),
        ]);

        foreach ([
            [
                'status' => ShipmentStatus::Pending,
                'location' => 'Jakarta',
                'note' => 'Pengiriman dibuat.',
                'occurred_at' => now()->subDay(),
            ],
            [
                'status' => ShipmentStatus::PickedUp,
                'location' => 'Jakarta Selatan',
                'note' => 'Paket dijemput oleh kurir.',
                'occurred_at' => now()->subHours(20),
            ],
            [
                'status' => ShipmentStatus::InTransit,
                'location' => 'Jakarta',
                'note' => 'Paket dalam perjalanan menuju kota tujuan.',
                'occurred_at' => now()->subHours(2),
            ],
        ] as $event) {
            ShipmentEvent::query()->create([
                ...$event,
                'shipment_id' => $shipment->id,
                'is_public' => true,
                'created_by' => $admin?->id,
            ]);
        }
    }
}
