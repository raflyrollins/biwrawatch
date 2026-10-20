<?php

use App\Enums\ShipmentStatus;
use App\Enums\WatchCondition;
use App\Enums\WatchStatus;
use App\Models\Promotion;
use App\Models\Shipment;
use App\Models\ShippingProvider;
use App\Models\User;

function adminUser(): User
{
    return User::factory()->create(['is_admin' => true]);
}

test('admin can create a watch', function () {
    $this->actingAs(adminUser())
        ->post(route('admin.watches.store'), [
            'brand' => 'Tudor',
            'model' => 'Black Bay 58',
            'reference_number' => 'M79030N-0001',
            'year' => 2023,
            'movement' => 'Automatic',
            'case_material' => 'Stainless Steel',
            'case_diameter_mm' => 39,
            'dial_color' => 'Black',
            'strap_material' => 'Steel',
            'condition' => WatchCondition::PreOwned->value,
            'description' => 'Complete set.',
            'price' => 55_000_000,
            'status' => WatchStatus::Available->value,
            'is_published' => true,
            'is_featured' => true,
            'sort_order' => 1,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('watches', [
        'reference_number' => 'M79030N-0001',
        'is_published' => true,
        'is_featured' => true,
    ]);
});

test('admin can create a promotion', function () {
    $this->actingAs(adminUser())
        ->post(route('admin.promotions.store'), [
            'name' => 'Promo Akhir Tahun',
            'label' => 'Hemat 15%',
            'description' => 'Promo terbatas.',
            'discount_type' => 'percentage',
            'discount_value' => 15,
            'starts_at' => now()->toDateString(),
            'ends_at' => now()->addWeek()->toDateString(),
            'is_active' => true,
            'applies_to_all' => true,
            'priority' => 5,
        ])
        ->assertRedirect();

    expect(Promotion::query()->where('name', 'Promo Akhir Tahun')->exists())->toBeTrue();
});

test('admin can create a shipment with generated internal tracking', function () {
    $provider = ShippingProvider::factory()->create();

    $this->actingAs(adminUser())
        ->post(route('admin.shipments.store'), [
            'recipient_name' => 'Siti Aminah',
            'recipient_phone' => '081298765432',
            'recipient_address' => 'Jl. Merdeka No. 1',
            'destination_city' => 'Bandung',
            'destination_country' => 'Indonesia',
            'status' => ShipmentStatus::Pending->value,
            'provider_id' => $provider->id,
            'tracking_number' => 'JNE999888777',
        ])
        ->assertRedirect();

    $shipment = Shipment::query()->latest('id')->firstOrFail();

    expect($shipment->tracking_number)->toMatch('/^BW\d{13}$/')
        ->and($shipment->recipient_phone_normalized)->toBe('6281298765432')
        ->and($shipment->trackings()->where('is_primary', true)->exists())->toBeTrue()
        ->and($shipment->events()->count())->toBe(1);
});

test('admin can update shipment status and publish an event', function () {
    $shipment = Shipment::factory()->create(['status' => ShipmentStatus::Pending]);

    $this->actingAs(adminUser())
        ->patch(route('admin.shipments.status.update', $shipment), [
            'status' => ShipmentStatus::InTransit->value,
            'location' => 'Jakarta',
            'note' => 'Paket dalam perjalanan.',
            'is_public' => true,
        ])
        ->assertRedirect();

    $shipment->refresh();

    expect($shipment->status)->toBe(ShipmentStatus::InTransit)
        ->and($shipment->events()->where('is_public', true)->count())->toBe(1);
});
