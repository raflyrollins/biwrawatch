<?php

namespace App\Models;

use App\Concerns\HasUuidRouteKey;
use App\Enums\ShipmentStatus;
use Database\Factories\ShipmentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $uuid
 * @property string $tracking_number
 * @property string $recipient_name
 * @property string $recipient_phone
 * @property string $recipient_phone_normalized
 * @property string $recipient_address
 * @property string $destination_city
 * @property string $destination_country
 * @property ShipmentStatus $status
 * @property Carbon|null $estimated_delivery_at
 * @property Carbon|null $shipped_at
 * @property Carbon|null $delivered_at
 * @property Carbon|null $last_status_at
 * @property string|null $internal_notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'tracking_number',
    'recipient_name',
    'recipient_phone',
    'recipient_phone_normalized',
    'recipient_address',
    'destination_city',
    'destination_country',
    'status',
    'estimated_delivery_at',
    'shipped_at',
    'delivered_at',
    'last_status_at',
    'internal_notes',
])]
class Shipment extends Model
{
    /** @use HasFactory<ShipmentFactory> */
    use HasFactory, HasUuidRouteKey;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ShipmentStatus::class,
            'estimated_delivery_at' => 'date',
            'shipped_at' => 'datetime',
            'delivered_at' => 'datetime',
            'last_status_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::updating(function (self $shipment): void {
            if ($shipment->isDirty('tracking_number')) {
                throw new \LogicException('Nomor tracking internal tidak dapat diubah.');
            }
        });
    }

    /** @return HasMany<ShipmentTracking, $this> */
    public function trackings(): HasMany
    {
        return $this->hasMany(ShipmentTracking::class)
            ->orderByDesc('is_primary')
            ->orderBy('added_at');
    }

    /** @return HasOne<ShipmentTracking, $this> */
    public function primaryTracking(): HasOne
    {
        return $this->hasOne(ShipmentTracking::class)->where('is_primary', true);
    }

    /** @return HasMany<ShipmentEvent, $this> */
    public function events(): HasMany
    {
        return $this->hasMany(ShipmentEvent::class)->orderBy('occurred_at');
    }

    /** @return HasMany<ShipmentEvent, $this> */
    public function publicEvents(): HasMany
    {
        return $this->hasMany(ShipmentEvent::class)
            ->where('is_public', true)
            ->orderBy('occurred_at');
    }

    /** @return HasOne<ShipmentEvent, $this> */
    public function latestEvent(): HasOne
    {
        return $this->hasOne(ShipmentEvent::class)->latestOfMany('occurred_at');
    }
}
