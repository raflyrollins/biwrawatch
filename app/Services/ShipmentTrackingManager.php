<?php

namespace App\Services;

use App\Models\Shipment;
use App\Models\ShipmentTracking;
use App\Models\ShippingProvider;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ShipmentTrackingManager
{
    public function add(
        Shipment $shipment,
        ShippingProvider $provider,
        string $trackingNumber,
        bool $primary = false,
        ?string $notes = null,
    ): ShipmentTracking {
        $normalized = $this->normalize($trackingNumber);

        return DB::transaction(function () use ($shipment, $provider, $normalized, $primary, $notes): ShipmentTracking {
            $duplicate = ShipmentTracking::query()
                ->where('tracking_number', $normalized)
                ->exists();

            if ($duplicate) {
                throw ValidationException::withMessages([
                    'tracking_number' => __('validation.unique', ['attribute' => 'nomor tracking']),
                ]);
            }

            $hasPrimary = $shipment->trackings()->where('is_primary', true)->exists();

            if ($primary || ! $hasPrimary) {
                $shipment->trackings()->update(['is_primary' => false]);
            }

            return $shipment->trackings()->create([
                'provider_id' => $provider->id,
                'tracking_number' => $normalized,
                'is_primary' => $primary || ! $hasPrimary,
                'added_at' => now(),
                'notes' => $notes,
            ]);
        });
    }

    public function setPrimary(Shipment $shipment, ShipmentTracking $tracking): void
    {
        if ($tracking->shipment_id !== $shipment->id) {
            throw ValidationException::withMessages([
                'tracking' => __('tracking.invalid_tracking'),
            ]);
        }

        DB::transaction(function () use ($shipment, $tracking): void {
            $shipment->trackings()->update(['is_primary' => false]);
            $tracking->update(['is_primary' => true]);
        });
    }

    public function remove(Shipment $shipment, ShipmentTracking $tracking): void
    {
        if ($tracking->shipment_id !== $shipment->id) {
            throw ValidationException::withMessages([
                'tracking' => __('tracking.invalid_tracking'),
            ]);
        }

        DB::transaction(function () use ($shipment, $tracking): void {
            $count = $shipment->trackings()->count();

            if ($count <= 1) {
                throw ValidationException::withMessages([
                    'tracking' => __('tracking.last_tracking'),
                ]);
            }

            $wasPrimary = $tracking->is_primary;
            $tracking->delete();

            if ($wasPrimary) {
                $replacement = $shipment->trackings()->orderBy('added_at')->orderBy('id')->first();

                if ($replacement !== null) {
                    $replacement->update(['is_primary' => true]);
                }
            }
        });
    }

    public function normalize(string $trackingNumber): string
    {
        return preg_replace('/\s+/', '', strtoupper(trim($trackingNumber))) ?? '';
    }
}
