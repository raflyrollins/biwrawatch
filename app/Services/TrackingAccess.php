<?php

namespace App\Services;

use App\Models\Shipment;

class TrackingAccess
{
    public function grant(Shipment $shipment): void
    {
        session()->put($this->key($shipment->uuid), now()->addMinutes(
            (int) config('shipping.verification_ttl_minutes', 30),
        )->getTimestamp());
    }

    public function has(string $uuid): bool
    {
        $expiresAt = session($this->key($uuid));

        if (! is_int($expiresAt) && ! is_numeric($expiresAt)) {
            return false;
        }

        return (int) $expiresAt > now()->getTimestamp();
    }

    public function forget(string $uuid): void
    {
        session()->forget($this->key($uuid));
    }

    private function key(string $uuid): string
    {
        return 'tracking_access.'.$uuid;
    }
}
