<?php

namespace App\Http\Controllers;

use App\Http\Resources\WatchPresenter;
use App\Models\Watch;
use App\Services\WatchPricing;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(WatchPresenter $presenter, WatchPricing $pricing): Response
    {
        $limit = (int) config('catalog.featured_limit', 6);

        $watches = Watch::query()
            ->published()
            ->with('primaryImage')
            ->where('is_featured', true)
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

        if ($watches->isEmpty()) {
            $watches = Watch::query()
                ->published()
                ->with('primaryImage')
                ->orderByDesc('created_at')
                ->limit($limit)
                ->get();
        }

        $prices = $pricing->forMany($watches);

        return Inertia::render('home', [
            'featured' => $watches
                ->map(fn (Watch $watch): array => $presenter->card($watch, $prices[$watch->id] ?? null))
                ->values()
                ->all(),
        ]);
    }
}
