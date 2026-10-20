<?php

namespace App\Models;

use Database\Factories\WatchImageFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $watch_id
 * @property string $path
 * @property string|null $alt
 * @property int $sort_order
 */
#[Fillable(['watch_id', 'path', 'alt', 'sort_order'])]
class WatchImage extends Model
{
    /** @use HasFactory<WatchImageFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    /** @return BelongsTo<Watch, $this> */
    public function watch(): BelongsTo
    {
        return $this->belongsTo(Watch::class);
    }
}
