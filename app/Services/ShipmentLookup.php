<?php

namespace App\Services;

use App\Models\Shipment;
use App\Models\ShipmentTracking;

class ShipmentLookup
{
    public function normalize(string $trackingNumber): string
    {
        return preg_replace('/\s+/', '', strtoupper(trim($trackingNumber))) ?? '';
    }

    public function find(string $trackingNumber): ?Shipment
    {
        $normalized = $this->normalize($trackingNumber);

        if ($normalized === '') {
            return null;
        }

        $shipment = Shipment::query()
            ->where('tracking_number', $normalized)
            ->first();

        if ($shipment !== null) {
            return $shipment;
        }

        return ShipmentTracking::query()
            ->with('shipment')
            ->where('tracking_number', $normalized)
            ->first()
            ?->shipment;
    }
}
