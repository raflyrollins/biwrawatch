<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use RuntimeException;

class TrackingNumberGenerator
{
    public function next(): string
    {
        if (DB::getDriverName() !== 'pgsql') {
            throw new RuntimeException('Tracking numbers require PostgreSQL.');
        }

        $timezone = (string) config('shipping.timezone', 'Asia/Jakarta');
        $prefix = (string) config('shipping.tracking_prefix', 'BW');
        $length = (int) config('shipping.sequence_length', 5);
        $date = now($timezone)->toDateString();

        $row = DB::selectOne(
            <<<'SQL'
                INSERT INTO tracking_counters (counter_date, last_number)
                VALUES (?, 1)
                ON CONFLICT (counter_date)
                DO UPDATE SET last_number = tracking_counters.last_number + 1
                RETURNING last_number
            SQL,
            [$date],
        );

        if ($row === null) {
            throw new RuntimeException('Unable to generate a tracking number.');
        }

        $sequence = (int) $row->last_number;
        $maximum = (10 ** $length) - 1;

        if ($sequence > $maximum) {
            throw new RuntimeException('Daily tracking number limit reached.');
        }

        return $prefix.now($timezone)->format('Ymd').str_pad((string) $sequence, $length, '0', STR_PAD_LEFT);
    }
}
