<?php

namespace App\Http\Controllers\Admin;

use App\Enums\WatchCondition;
use App\Enums\WatchStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreWatchRequest;
use App\Http\Requests\Admin\UpdateWatchRequest;
use App\Http\Resources\WatchPresenter;
use App\Models\Watch;
use App\Services\WatchImageManager;
use App\Services\WatchPricing;
use App\Services\WatchSearch;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
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
            'status' => ['nullable', 'string', 'max:30'],
            'published' => ['nullable', 'in:0,1'],
        ]);

        $query = Watch::query()->with('primaryImage');
        $search->apply($query, $filters['q'] ?? null, []);

        $query
            ->when(filled($filters['status'] ?? null), fn ($query) => $query->where('status', $filters['status']))
            ->when($request->filled('published'), fn ($query) => $query->where('is_published', $request->boolean('published')));

        $watches = $query->latest()->paginate(15)->withQueryString();
        $prices = $pricing->forMany(collect($watches->items()));

        $watches->through(
            fn (Watch $watch): array => $presenter->adminSummary($watch, $prices[$watch->id] ?? null),
        );

        return Inertia::render('admin/watches/index', [
            'watches' => $watches,
            'filters' => $filters,
            'statuses' => WatchStatus::options(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/watches/form', [
            'watch' => null,
            'conditions' => WatchCondition::options(),
            'statuses' => WatchStatus::options(),
        ]);
    }

    public function store(
        StoreWatchRequest $request,
        WatchImageManager $images,
    ): RedirectResponse {
        $data = $request->safe()->except(['images']);
        $data['is_published'] = $request->boolean('is_published');
        $data['is_featured'] = $request->boolean('is_featured');
        $data['sort_order'] = $data['sort_order'] ?? 0;

        $watch = Watch::query()->create($data);
        $this->storeImages($watch, $request, $images);

        return to_route('admin.watches.edit', $watch)
            ->with('success', __('admin.flash.watch_created'));
    }

    public function edit(
        Watch $watch,
        WatchPresenter $presenter,
    ): Response {
        return Inertia::render('admin/watches/form', [
            'watch' => $presenter->admin($watch),
            'conditions' => WatchCondition::options(),
            'statuses' => WatchStatus::options(),
        ]);
    }

    public function update(
        UpdateWatchRequest $request,
        Watch $watch,
        WatchImageManager $images,
    ): RedirectResponse {
        $data = $request->safe()->except(['images']);
        $data['is_published'] = $request->boolean('is_published');
        $data['is_featured'] = $request->boolean('is_featured');
        $data['sort_order'] = $data['sort_order'] ?? 0;

        $watch->update($data);
        $this->storeImages($watch, $request, $images);

        return back()->with('success', __('admin.flash.watch_updated'));
    }

    public function destroy(Watch $watch, WatchImageManager $images): RedirectResponse
    {
        $images->deleteAll($watch);
        $watch->delete();

        return to_route('admin.watches.index')
            ->with('success', __('admin.flash.watch_deleted'));
    }

    private function storeImages(Watch $watch, Request $request, WatchImageManager $manager): void
    {
        $files = $request->file('images', []);

        if ($files instanceof UploadedFile) {
            $files = [$files];
        }

        $files = array_values($files);

        if ($files !== []) {
            $manager->store($watch, $files, $watch->brand.' '.$watch->model);
        }
    }
}
