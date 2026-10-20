<?php

namespace App\Http\Controllers\Admin;

use App\Enums\DiscountType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PromotionRequest;
use App\Models\Promotion;
use App\Models\Watch;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PromotionController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'active' => ['nullable', 'in:0,1'],
        ]);

        $promotions = Promotion::query()
            ->withCount('watches')
            ->when(filled($filters['q'] ?? null), fn ($query) => $query->where('name', 'like', '%'.$filters['q'].'%'))
            ->when($request->filled('active'), fn ($query) => $query->where('is_active', $request->boolean('active')))
            ->orderByDesc('priority')
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Promotion $promotion): array => $this->summary($promotion));

        return Inertia::render('admin/promotions/index', [
            'promotions' => $promotions,
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/promotions/form', [
            'promotion' => null,
            'watches' => $this->watches(),
            'discountTypes' => DiscountType::options(),
        ]);
    }

    public function store(PromotionRequest $request): RedirectResponse
    {
        $promotion = Promotion::query()->create($this->data($request));
        $this->syncWatches($promotion, $request);

        return to_route('admin.promotions.edit', $promotion)
            ->with('success', __('admin.flash.promotion_created'));
    }

    public function edit(Promotion $promotion): Response
    {
        $promotion->load('watches');

        return Inertia::render('admin/promotions/form', [
            'promotion' => [
                ...$this->summary($promotion),
                'description' => $promotion->description,
                'watch_ids' => $promotion->watches->pluck('id')->values()->all(),
            ],
            'watches' => $this->watches(),
            'discountTypes' => DiscountType::options(),
        ]);
    }

    public function update(PromotionRequest $request, Promotion $promotion): RedirectResponse
    {
        $promotion->update($this->data($request));
        $this->syncWatches($promotion, $request);

        return back()->with('success', __('admin.flash.promotion_updated'));
    }

    public function destroy(Promotion $promotion): RedirectResponse
    {
        $promotion->delete();

        return to_route('admin.promotions.index')
            ->with('success', __('admin.flash.promotion_deleted'));
    }

    /**
     * @return array<string, mixed>
     */
    private function data(PromotionRequest $request): array
    {
        $data = $request->safe()->except(['watch_ids']);

        $data['is_active'] = $request->boolean('is_active');
        $data['applies_to_all'] = $request->boolean('applies_to_all');
        $data['priority'] = $data['priority'] ?? 0;
        $data['starts_at'] = filled($data['starts_at'] ?? null) ? $data['starts_at'] : null;
        $data['ends_at'] = filled($data['ends_at'] ?? null) ? $data['ends_at'] : null;
        $data['discount_type'] = filled($data['discount_type'] ?? null) ? $data['discount_type'] : null;
        $data['discount_value'] = $data['discount_type'] !== null ? ($data['discount_value'] ?? null) : null;

        return $data;
    }

    private function syncWatches(Promotion $promotion, PromotionRequest $request): void
    {
        if ($promotion->applies_to_all) {
            $promotion->watches()->sync([]);

            return;
        }

        /** @var array<int, int|string> $ids */
        $ids = $request->input('watch_ids', []);
        $promotion->watches()->sync(array_map('intval', $ids));
    }

    /**
     * @return array<string, mixed>
     */
    private function summary(Promotion $promotion): array
    {
        return [
            'id' => $promotion->id,
            'uuid' => $promotion->uuid,
            'name' => $promotion->name,
            'label' => $promotion->label,
            'discount_type' => $promotion->discount_type?->value,
            'discount_type_label' => $promotion->discount_type?->label(),
            'discount_value' => $promotion->discount_value,
            'starts_at' => $promotion->starts_at?->toIso8601String(),
            'ends_at' => $promotion->ends_at?->toIso8601String(),
            'is_active' => $promotion->is_active,
            'applies_to_all' => $promotion->applies_to_all,
            'priority' => $promotion->priority,
            'watches_count' => $promotion->watches_count ?? 0,
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function watches(): array
    {
        return Watch::query()
            ->orderBy('brand')
            ->orderBy('model')
            ->get(['id', 'brand', 'model', 'reference_number'])
            ->map(fn (Watch $watch): array => [
                'id' => $watch->id,
                'label' => $watch->brand.' '.$watch->model.' · '.$watch->reference_number,
            ])
            ->values()
            ->all();
    }
}
