<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ShipmentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreShipmentRequest;
use App\Http\Requests\Admin\UpdateShipmentRequest;
use App\Http\Resources\ShipmentPresenter;
use App\Models\Shipment;
use App\Models\ShippingProvider;
use App\Models\User;
use App\Services\PhoneNormalizer;
use App\Services\ShipmentStatusUpdater;
use App\Services\ShipmentTrackingManager;
use App\Services\TrackingNumberGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ShipmentController extends Controller
{
    public function index(Request $request, ShipmentPresenter $presenter): Response
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', 'max:30'],
        ]);

        $shipments = Shipment::query()
            ->when(filled($filters['q'] ?? null), function ($query) use ($filters): void {
                $term = '%'.$filters['q'].'%';
                $query->where(function ($query) use ($term): void {
                    $query->where('tracking_number', 'like', $term)
                        ->orWhere('recipient_name', 'like', $term)
                        ->orWhere('destination_city', 'like', $term);
                });
            })
            ->when(filled($filters['status'] ?? null), fn ($query) => $query->where('status', $filters['status']))
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Shipment $shipment): array => $presenter->summary($shipment));

        return Inertia::render('admin/shipments/index', [
            'shipments' => $shipments,
            'filters' => $filters,
            'statuses' => ShipmentStatus::options(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/shipments/form', [
            'shipment' => null,
            'providers' => $this->providers(),
            'statuses' => ShipmentStatus::options(),
        ]);
    }

    public function store(
        StoreShipmentRequest $request,
        TrackingNumberGenerator $generator,
        ShipmentTrackingManager $trackings,
        PhoneNormalizer $phone,
        ShipmentStatusUpdater $statusUpdater,
    ): RedirectResponse {
        $validated = $request->validated();
        $normalizedPhone = $phone->normalize($validated['recipient_phone']);

        if ($normalizedPhone === null) {
            throw ValidationException::withMessages([
                'recipient_phone' => __('validation.phone'),
            ]);
        }

        $provider = ShippingProvider::query()->findOrFail((int) $validated['provider_id']);
        $status = ShipmentStatus::from($validated['status'] ?? ShipmentStatus::Pending->value);

        $shipment = DB::transaction(function () use ($validated, $normalizedPhone, $provider, $status, $generator, $trackings): Shipment {
            $shipment = Shipment::query()->create([
                'tracking_number' => $generator->next(),
                'recipient_name' => $validated['recipient_name'],
                'recipient_phone' => $validated['recipient_phone'],
                'recipient_phone_normalized' => $normalizedPhone,
                'recipient_address' => $validated['recipient_address'],
                'destination_city' => $validated['destination_city'],
                'destination_country' => $validated['destination_country'],
                'status' => $status,
                'estimated_delivery_at' => $validated['estimated_delivery_at'] ?? null,
                'internal_notes' => $validated['internal_notes'] ?? null,
                'last_status_at' => now(),
            ]);

            $trackings->add(
                $shipment,
                $provider,
                $validated['tracking_number'],
                true,
            );

            return $shipment;
        });

        $user = $request->user();
        $statusUpdater->update(
            $shipment,
            $status,
            null,
            __('tracking.created_note'),
            true,
            now(),
            $user instanceof User ? $user : null,
        );

        return to_route('admin.shipments.show', $shipment)
            ->with('success', __('admin.flash.shipment_created'));
    }

    public function show(Shipment $shipment, ShipmentPresenter $presenter): Response
    {
        return Inertia::render('admin/shipments/show', [
            'shipment' => $presenter->admin($shipment),
            'providers' => $this->providers(),
            'statuses' => ShipmentStatus::options(),
            'public_url' => route('track.show', $shipment->tracking_number),
        ]);
    }

    public function edit(Shipment $shipment, ShipmentPresenter $presenter): Response
    {
        return Inertia::render('admin/shipments/form', [
            'shipment' => $presenter->admin($shipment),
            'providers' => $this->providers(),
            'statuses' => ShipmentStatus::options(),
        ]);
    }

    public function update(
        UpdateShipmentRequest $request,
        Shipment $shipment,
        PhoneNormalizer $phone,
    ): RedirectResponse {
        $validated = $request->validated();
        $normalizedPhone = $phone->normalize($validated['recipient_phone']);

        if ($normalizedPhone === null) {
            throw ValidationException::withMessages([
                'recipient_phone' => __('validation.phone'),
            ]);
        }

        $shipment->update([
            ...$validated,
            'recipient_phone_normalized' => $normalizedPhone,
        ]);

        return to_route('admin.shipments.show', $shipment)
            ->with('success', __('admin.flash.shipment_updated'));
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function providers(): array
    {
        return ShippingProvider::query()
            ->active()
            ->get()
            ->map(fn (ShippingProvider $provider): array => [
                'id' => $provider->id,
                'name' => $provider->name,
                'tracking_number_pattern' => $provider->tracking_number_pattern,
            ])
            ->values()
            ->all();
    }
}
