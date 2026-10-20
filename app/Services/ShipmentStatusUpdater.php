<?php

namespace App\Services;

use App\Enums\ShipmentStatus;
use App\Events\ShipmentStatusUpdated;
use App\Models\Shipment;
use App\Models\ShipmentEvent;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ShipmentStatusUpdater
{
    /**
     * @return array{shipment: Shipment, event: ShipmentEvent}
     */
    public function update(
        Shipment $shipment,
        ShipmentStatus $status,
        ?string $location = null,
        ?string $note = null,
        bool $isPublic = true,
        ?\DateTimeInterface $occurredAt = null,
        ?User $user = null,
    ): array {
        [$updatedShipment, $event] = DB::transaction(function () use ($shipment, $status, $location, $note, $isPublic, $occurredAt, $user): array {
            $locked = Shipment::query()
                ->whereKey($shipment->id)
                ->lockForUpdate()
                ->firstOrFail();

            $occurred = $occurredAt !== null ? Carbon::instance($occurredAt) : Carbon::now();
            $locked->status = $status;
            $locked->last_status_at = $occurred;

            if ($status === ShipmentStatus::Delivered) {
                $locked->delivered_at = $occurred;
            }

            if ($locked->shipped_at === null && in_array($status, [
                ShipmentStatus::PickedUp,
                ShipmentStatus::InTransit,
                ShipmentStatus::Customs,
                ShipmentStatus::OutForDelivery,
                ShipmentStatus::Delivered,
            ], true)) {
                $locked->shipped_at = $occurred;
            }

            $locked->save();

            $event = $locked->events()->create([
                'status' => $status,
                'location' => $location,
                'note' => $note,
                'is_public' => $isPublic,
                'occurred_at' => $occurred,
                'created_by' => $user?->id,
            ]);

            return [$locked, $event];
        });

        event(new ShipmentStatusUpdated($updatedShipment, $event));

        return [
            'shipment' => $updatedShipment,
            'event' => $event,
        ];
    }
}
