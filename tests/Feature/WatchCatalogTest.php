<?php

use App\Enums\WatchStatus;
use App\Models\Watch;
use Inertia\Testing\AssertableInertia as Assert;

test('catalog lists only published watches', function () {
    $published = Watch::factory()->create([
        'brand' => 'Rolex',
        'model' => 'Submariner',
        'is_published' => true,
    ]);

    Watch::factory()->create([
        'brand' => 'Omega',
        'model' => 'Speedmaster',
        'is_published' => false,
    ]);

    $this->get(route('watches.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('watches/index')
            ->has('watches.data', 1)
            ->where('watches.data.0.uuid', $published->uuid));
});

test('catalog full-text search matches brand, model, and keywords', function () {
    $match = Watch::factory()->create([
        'brand' => 'Grand Seiko',
        'model' => 'Snowflake',
        'search_keywords' => 'spring drive zaratsu',
        'is_published' => true,
    ]);

    Watch::factory()->create([
        'brand' => 'Rolex',
        'model' => 'Datejust',
        'is_published' => true,
    ]);

    $this->get(route('watches.index', ['q' => 'grand seiko']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('watches.data', 1)
            ->where('watches.data.0.uuid', $match->uuid));

    $this->get(route('watches.index', ['q' => 'zaratsu']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('watches.data', 1)
            ->where('watches.data.0.uuid', $match->uuid));
});

test('generic catalog phrases fall back to the published collection', function () {
    Watch::factory()->count(2)->create(['is_published' => true]);
    Watch::factory()->create(['is_published' => false]);

    $this->get(route('watches.index', ['q' => 'jam tangan mewah']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('watches.data', 2));
});

test('unpublished watch details return not found', function () {
    $watch = Watch::factory()->create(['is_published' => false]);

    $this->get(route('watches.show', $watch))->assertNotFound();
});

test('published watch details include images and pricing', function () {
    $watch = Watch::factory()->create([
        'price' => 100_000_000,
        'status' => WatchStatus::Available,
        'is_published' => true,
    ]);

    $this->get(route('watches.show', $watch))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('watches/show')
            ->where('watch.uuid', $watch->uuid)
            ->where('watch.pricing.original_price', 100_000_000)
            ->where('watch.pricing.final_price', 100_000_000));
});
