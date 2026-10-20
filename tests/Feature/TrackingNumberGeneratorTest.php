<?php

use App\Services\TrackingNumberGenerator;
use Illuminate\Support\Carbon;

test('tracking numbers are sequential per day', function () {
    Carbon::setTestNow(Carbon::parse('2026-10-20 10:00:00', 'Asia/Jakarta'));

    $generator = app(TrackingNumberGenerator::class);

    expect($generator->next())->toBe('BW2026102000001')
        ->and($generator->next())->toBe('BW2026102000002')
        ->and($generator->next())->toBe('BW2026102000003');

    Carbon::setTestNow();
});

test('tracking number sequence resets on the next day', function () {
    Carbon::setTestNow(Carbon::parse('2026-10-20 23:00:00', 'Asia/Jakarta'));
    $generator = app(TrackingNumberGenerator::class);

    expect($generator->next())->toBe('BW2026102000001');

    Carbon::setTestNow(Carbon::parse('2026-10-21 01:00:00', 'Asia/Jakarta'));

    expect($generator->next())->toBe('BW2026102100001');

    Carbon::setTestNow();
});
