<?php

use App\Enums\DiscountType;
use App\Models\Promotion;
use App\Models\Watch;
use App\Services\WatchPricing;

test('percentage promotion applies to all watches', function () {
    $watch = Watch::factory()->create(['price' => 100_000_000]);

    Promotion::factory()->create([
        'discount_type' => DiscountType::Percentage,
        'discount_value' => 10,
        'applies_to_all' => true,
        'is_active' => true,
    ]);

    $price = app(WatchPricing::class)->for($watch);

    expect($price['original_price'])->toBe(100_000_000)
        ->and($price['final_price'])->toBe(90_000_000)
        ->and($price['discount_amount'])->toBe(10_000_000)
        ->and($price['promotion'])->not->toBeNull();
});

test('fixed promotion only applies to selected watches', function () {
    $selected = Watch::factory()->create(['price' => 90_000_000]);
    $other = Watch::factory()->create(['price' => 90_000_000]);

    $promotion = Promotion::factory()->create([
        'discount_type' => DiscountType::Fixed,
        'discount_value' => 5_000_000,
        'applies_to_all' => false,
        'is_active' => true,
    ]);

    $promotion->watches()->sync([$selected->id]);

    $pricing = app(WatchPricing::class);

    expect($pricing->for($selected)['final_price'])->toBe(85_000_000)
        ->and($pricing->for($other)['final_price'])->toBe(90_000_000)
        ->and($pricing->for($other)['promotion'])->toBeNull();
});

test('inactive promotion is ignored', function () {
    $watch = Watch::factory()->create(['price' => 50_000_000]);

    Promotion::factory()->create([
        'discount_type' => DiscountType::Percentage,
        'discount_value' => 50,
        'applies_to_all' => true,
        'is_active' => false,
    ]);

    expect(app(WatchPricing::class)->for($watch)['final_price'])->toBe(50_000_000);
});

test('badge-only promotion keeps the original price', function () {
    $watch = Watch::factory()->create(['price' => 50_000_000]);

    Promotion::factory()->create([
        'label' => 'Konsultasi gratis',
        'discount_type' => null,
        'discount_value' => null,
        'applies_to_all' => true,
        'is_active' => true,
    ]);

    $price = app(WatchPricing::class)->for($watch);

    expect($price['final_price'])->toBe(50_000_000)
        ->and($price['discount_amount'])->toBe(0)
        ->and($price['promotion']['label'] ?? null)->toBe('Konsultasi gratis');
});
