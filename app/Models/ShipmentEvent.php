<?php

namespace App\Models;

use App\Enums\ShipmentStatus;
use Database\Factories\ShipmentEventFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $shipment_id
 * @property ShipmentStatus $status
 * @property string|null $location
 * @property string|null $note
 * @property bool $is_public
 * @property Carbon $occurred_at
 * @property int|null $created_by
 */
#[Fillable([
    'shipment_id',
    'status',
    'location',
    'note',
    'is_public',
    'occurred_at',
    'created_by',
])]
class ShipmentEvent extends Model
{
    /** @use HasFactory<ShipmentEventFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ShipmentStatus::class,
            'is_public' => 'boolean',
            'occurred_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<Shipment, $this> */
    public function shipment(): BelongsTo
    {
        return $this->belongsTo(Shipment::class);
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
