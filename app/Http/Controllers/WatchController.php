<?php

namespace App\Http\Controllers;

use App\Enums\WatchCondition;
use App\Enums\WatchStatus;
use App\Http\Resources\WatchPresenter;
use App\Models\Watch;
use App\Services\WatchPricing;
use App\Services\WatchSearch;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class WatchController extends Controller
{
    public function index(
        Request $request,
        WatchSearch $search,
        WatchPricing $pricing,
        WatchPresenter $presenter,
    ): Response {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'brand' => ['nullable', 'string', 'max:80'],
            'condition' => ['nullable', Rule::enum(WatchCondition::class)],
            'status' => ['nullable', Rule::enum(WatchStatus::class)],
            'year_min' => ['nullable', 'integer', 'min:1900', 'max:'.(now()->year + 1)],
            'year_max' => ['nullable', 'integer', 'min:1900', 'max:'.(now()->year + 1)],
            'price_min' => ['nullable', 'integer', 'min:0'],
            'price_max' => ['nullable', 'integer', 'min:0'],
            'sort' => ['nullable', Rule::in(['relevance', 'featured', 'newest', 'price_asc', 'price_desc'])],
        ]);

        $query = Watch::query()
            ->published()
            ->with('primaryImage');

        $search->apply($query, $filters['q'] ?? null, $filters);

        $watches = $query
            ->paginate((int) config('catalog.per_page', 12))
            ->withQueryString();

        $prices = $pricing->forMany(collect($watches->items()));

        $watches->through(
            fn (Watch $watch): array => $presenter->card($watch, $prices[$watch->id] ?? null),
        );

        return Inertia::render('watches/index', [
            'watches' => $watches,
            'filters' => $filters,
            'brands' => Watch::query()
                ->published()
                ->select('brand')
                ->distinct()
                ->orderBy('brand')
                ->pluck('brand')
                ->values()
                ->all(),
            'conditions' => WatchCondition::options(),
            'statuses' => WatchStatus::options(),
        ]);
    }

    public function show(
        Watch $watch,
        WatchPricing $pricing,
        WatchPresenter $presenter,
    ): Response {
        abort_unless($watch->is_published && ! $watch->trashed(), 404);

        $watch->load(['images', 'primaryImage']);
        $price = $pricing->for($watch);

        $relatedWatches = Watch::query()
            ->published()
            ->with('primaryImage')
            ->whereKeyNot($watch->id)
            ->where('brand', $watch->brand)
            ->orderByDesc('is_featured')
            ->orderBy('sort_order')
            ->limit((int) config('catalog.related_limit', 3))
            ->get();

        if ($relatedWatches->isEmpty()) {
            $relatedWatches = Watch::query()
                ->published()
                ->with('primaryImage')
                ->whereKeyNot($watch->id)
                ->orderByDesc('created_at')
                ->limit((int) config('catalog.related_limit', 3))
                ->get();
        }

        $relatedPrices = $pricing->forMany($relatedWatches);

        return Inertia::render('watches/show', [
            'watch' => $presenter->detail($watch, $price),
            'related' => $relatedWatches
                ->map(fn (Watch $related): array => $presenter->card($related, $relatedPrices[$related->id] ?? null))
                ->values()
                ->all(),
        ]);
    }
}
