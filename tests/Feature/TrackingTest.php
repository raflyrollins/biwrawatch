<?php

use App\Models\Shipment;
use App\Models\ShipmentTracking;
use App\Models\ShippingProvider;
use App\Services\PhoneNormalizer;
use Inertia\Testing\AssertableInertia as Assert;

function trackingShipment(string $trackingNumber = 'BW2026102000001'): Shipment
{
    $phone = app(PhoneNormalizer::class);

    return Shipment::factory()->create([
        'tracking_number' => $trackingNumber,
        'recipient_name' => 'Andi Pratama',
        'recipient_phone' => '081234567890',
        'recipient_phone_normalized' => $phone->normalize('081234567890'),
        'destination_city' => 'Jakarta Selatan',
    ]);
}

test('public tracking is hidden until the recipient phone is verified', function () {
    $shipment = trackingShipment();

    $this->get(route('track.show', $shipment->tracking_number))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('track/show')
            ->where('verified', false)
            ->where('shipment', null));
});

test('recipient phone verification grants access to shipment timeline', function () {
    $shipment = trackingShipment();

    $this->post(route('track.verify', $shipment->tracking_number), [
        'phone' => '0812-3456-7890',
    ])->assertRedirect(route('track.show', $shipment->tracking_number));

    $this->get(route('track.show', $shipment->tracking_number))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('track/show')
            ->where('verified', true)
            ->where('shipment.uuid', $shipment->uuid)
            ->where('shipment.destination_city', 'Jakarta Selatan'));
});

test('lookup accepts a historical provider tracking number', function () {
    $shipment = trackingShipment();
    $provider = ShippingProvider::factory()->create();

    ShipmentTracking::factory()->create([
        'shipment_id' => $shipment->id,
        'provider_id' => $provider->id,
        'tracking_number' => 'JNE1234567890',
        'is_primary' => true,
    ]);

    $this->post(route('track.lookup'), [
        'tracking_number' => ' jne 1234567890 ',
        'phone' => '081234567890',
    ])->assertRedirect(route('track.show', $shipment->tracking_number));
});

test('invalid recipient phone returns a generic validation error', function () {
    $shipment = trackingShipment();

    $this->from(route('track.index'))
        ->post(route('track.lookup'), [
            'tracking_number' => $shipment->tracking_number,
            'phone' => '081200000000',
        ])
        ->assertRedirect(route('track.index'))
        ->assertSessionHasErrors('phone');
});

test('lookup for an unknown tracking number returns the same generic error', function () {
    $this->from(route('track.index'))
        ->post(route('track.lookup'), [
            'tracking_number' => 'BW0000000000000',
            'phone' => '081234567890',
        ])
        ->assertRedirect(route('track.index'))
        ->assertSessionHasErrors('phone');
});
