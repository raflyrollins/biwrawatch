<?php

namespace App\Http\Resources;

use App\Models\Shipment;
use App\Models\ShipmentEvent;
use App\Models\ShipmentTracking;
use App\Services\ProviderTrackingUrl;

class ShipmentPresenter
{
    public function __construct(
        private readonly ProviderTrackingUrl $providerUrl,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function public(Shipment $shipment): array
    {
        $shipment->loadMissing([
            'trackings.provider',
            'publicEvents',
        ]);

        $primary = $shipment->trackings->firstWhere('is_primary', true);

        return [
            'uuid' => $shipment->uuid,
            'tracking_number' => $shipment->tracking_number,
            'status' => $this->status($shipment),
            'recipient_name' => $this->maskName($shipment->recipient_name),
            'destination_city' => $shipment->destination_city,
            'destination_country' => $shipment->destination_country,
            'estimated_delivery_at' => $shipment->estimated_delivery_at?->toDateString(),
            'shipped_at' => $shipment->shipped_at?->toIso8601String(),
            'delivered_at' => $shipment->delivered_at?->toIso8601String(),
            'last_status_at' => $shipment->last_status_at?->toIso8601String(),
            'primary_tracking' => $primary ? $this->tracking($primary) : null,
            'trackings' => $shipment->trackings
                ->map(fn (ShipmentTracking $tracking): array => $this->tracking($tracking))
                ->values()
                ->all(),
            'events' => $shipment->publicEvents
                ->map(fn (ShipmentEvent $event): array => $this->event($event))
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function admin(Shipment $shipment): array
    {
        $shipment->loadMissing([
            'trackings.provider',
            'events.creator',
        ]);

        return [
            ...$this->public($shipment),
            'recipient_name' => $shipment->recipient_name,
            'recipient_phone' => $shipment->recipient_phone,
            'recipient_address' => $shipment->recipient_address,
            'internal_notes' => $shipment->internal_notes,
            'events' => $shipment->events
                ->map(fn (ShipmentEvent $event): array => [
                    ...$this->event($event),
                    'is_public' => $event->is_public,
                    'creator' => $event->creator?->name,
                ])
                ->values()
                ->all(),
            'created_at' => $shipment->created_at?->toIso8601String(),
            'updated_at' => $shipment->updated_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function summary(Shipment $shipment): array
    {
        return [
            'uuid' => $shipment->uuid,
            'tracking_number' => $shipment->tracking_number,
            'recipient_name' => $shipment->recipient_name,
            'destination_city' => $shipment->destination_city,
            'status' => $this->status($shipment),
            'last_status_at' => $shipment->last_status_at?->toIso8601String(),
            'created_at' => $shipment->created_at?->toIso8601String(),
        ];
    }

    /**
     * @return array{value: string, label: string}
     */
    private function status(Shipment $shipment): array
    {
        return [
            'value' => $shipment->status->value,
            'label' => $shipment->status->label(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function tracking(ShipmentTracking $tracking): array
    {
        return [
            'id' => $tracking->id,
            'provider_id' => $tracking->provider_id,
            'provider_name' => $tracking->provider->name,
            'tracking_number' => $tracking->tracking_number,
            'tracking_url' => $this->providerUrl->for($tracking->provider, $tracking->tracking_number),
            'is_primary' => $tracking->is_primary,
            'added_at' => $tracking->added_at->toIso8601String(),
            'notes' => $tracking->notes,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function event(ShipmentEvent $event): array
    {
        return [
            'id' => $event->id,
            'status' => [
                'value' => $event->status->value,
                'label' => $event->status->label(),
            ],
            'location' => $event->location,
            'note' => $event->note,
            'occurred_at' => $event->occurred_at->toIso8601String(),
        ];
    }

    private function maskName(string $name): string
    {
        $parts = preg_split('/\s+/', trim($name)) ?: [];

        return collect($parts)
            ->filter()
            ->map(function (string $part): string {
                $length = mb_strlen($part);

                return mb_substr($part, 0, 1).str_repeat('*', max(2, $length - 1));
            })
            ->implode(' ');
    }
}
