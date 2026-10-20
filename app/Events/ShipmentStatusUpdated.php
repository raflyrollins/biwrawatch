<?php

namespace App\Events;

use App\Models\Shipment;
use App\Models\ShipmentEvent;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ShipmentStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Shipment $shipment,
        public ?ShipmentEvent $event = null,
    ) {}

    /**
     * @return array<int, Channel|PrivateChannel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('shipments.'.$this->shipment->uuid),
            new Channel('tracking.'.$this->shipment->uuid),
        ];
    }

    public function broadcastAs(): string
    {
        return 'ShipmentStatusUpdated';
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'shipment_uuid' => $this->shipment->uuid,
            'tracking_number' => $this->shipment->tracking_number,
            'status' => $this->event?->status->value ?? $this->shipment->status->value,
            'occurred_at' => ($this->event->occurred_at ?? $this->shipment->last_status_at)?->toIso8601String(),
            'last_status_at' => $this->shipment->last_status_at?->toIso8601String(),
        ];
    }
}
