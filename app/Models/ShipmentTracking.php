<?php

namespace App\Models;

use Database\Factories\ShipmentTrackingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $shipment_id
 * @property int $provider_id
 * @property string $tracking_number
 * @property bool $is_primary
 * @property Carbon $added_at
 * @property string|null $notes
 */
#[Fillable([
    'shipment_id',
    'provider_id',
    'tracking_number',
    'is_primary',
    'added_at',
    'notes',
])]
class ShipmentTracking extends Model
{
    /** @use HasFactory<ShipmentTrackingFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
            'added_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<Shipment, $this> */
    public function shipment(): BelongsTo
    {
        return $this->belongsTo(Shipment::class);
    }

    /** @return BelongsTo<ShippingProvider, $this> */
    public function provider(): BelongsTo
    {
        return $this->belongsTo(ShippingProvider::class, 'provider_id');
    }
}
