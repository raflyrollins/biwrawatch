<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProviderRequest;
use App\Models\ShippingProvider;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProviderController extends Controller
{
    public function index(): Response
    {
        $providers = ShippingProvider::query()
            ->withCount('trackings')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(20)
            ->through(fn (ShippingProvider $provider): array => $this->summary($provider));

        return Inertia::render('admin/providers/index', [
            'providers' => $providers,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/providers/form', [
            'provider' => null,
        ]);
    }

    public function store(ProviderRequest $request): RedirectResponse
    {
        ShippingProvider::query()->create($this->data($request));

        return to_route('admin.providers.index')
            ->with('success', __('admin.flash.provider_created'));
    }

    public function edit(ShippingProvider $provider): Response
    {
        return Inertia::render('admin/providers/form', [
            'provider' => $this->summary($provider),
        ]);
    }

    public function update(ProviderRequest $request, ShippingProvider $provider): RedirectResponse
    {
        $provider->update($this->data($request));

        return back()->with('success', __('admin.flash.provider_updated'));
    }

    public function destroy(ShippingProvider $provider): RedirectResponse
    {
        if ($provider->trackings()->exists()) {
            return back()->with('error', __('admin.flash.provider_in_use'));
        }

        $provider->delete();

        return to_route('admin.providers.index')
            ->with('success', __('admin.flash.provider_deleted'));
    }

    /**
     * @return array<string, mixed>
     */
    private function data(ProviderRequest $request): array
    {
        $data = $request->validated();
        $data['is_active'] = $request->boolean('is_active');
        $data['sort_order'] = $data['sort_order'] ?? 0;

        return $data;
    }

    /**
     * @return array<string, mixed>
     */
    private function summary(ShippingProvider $provider): array
    {
        return [
            'id' => $provider->id,
            'uuid' => $provider->uuid,
            'name' => $provider->name,
            'tracking_url_template' => $provider->tracking_url_template,
            'tracking_number_pattern' => $provider->tracking_number_pattern,
            'is_active' => $provider->is_active,
            'sort_order' => $provider->sort_order,
            'trackings_count' => $provider->trackings_count ?? 0,
            'created_at' => $provider->created_at?->toIso8601String(),
        ];
    }
}
