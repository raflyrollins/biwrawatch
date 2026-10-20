<?php

namespace App\Http\Controllers;

use App\Http\Requests\TrackLookupRequest;
use App\Http\Requests\VerifyTrackingRequest;
use App\Http\Resources\ShipmentPresenter;
use App\Models\Shipment;
use App\Services\PhoneNormalizer;
use App\Services\ShipmentLookup;
use App\Services\TrackingAccess;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class TrackingController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('track/index', [
            'tracking_number' => (string) $request->query('tracking', ''),
        ]);
    }

    public function lookup(
        TrackLookupRequest $request,
        ShipmentLookup $lookup,
        PhoneNormalizer $phone,
        TrackingAccess $access,
    ): RedirectResponse {
        $shipment = $lookup->find((string) $request->input('tracking_number'));

        if ($shipment === null || ! $phone->matches($shipment->recipient_phone_normalized, (string) $request->input('phone'))) {
            throw ValidationException::withMessages([
                'phone' => __('tracking.invalid_credentials'),
            ]);
        }

        $request->session()->regenerate();
        $access->grant($shipment);

        return to_route('track.show', $shipment->tracking_number);
    }

    public function show(
        string $trackingNumber,
        ShipmentLookup $lookup,
        TrackingAccess $access,
        ShipmentPresenter $presenter,
    ): Response {
        $shipment = $lookup->find($trackingNumber);
        $canonical = $shipment instanceof Shipment
            ? $shipment->tracking_number
            : $lookup->normalize($trackingNumber);
        $verified = $shipment !== null && $access->has($shipment->uuid);

        return Inertia::render('track/show', [
            'tracking_number' => $canonical,
            'verified' => $verified,
            'shipment' => $verified ? $presenter->public($shipment) : null,
        ]);
    }

    public function verify(
        string $trackingNumber,
        VerifyTrackingRequest $request,
        ShipmentLookup $lookup,
        PhoneNormalizer $phone,
        TrackingAccess $access,
    ): RedirectResponse {
        $shipment = $lookup->find($trackingNumber);

        if ($shipment === null || ! $phone->matches($shipment->recipient_phone_normalized, (string) $request->input('phone'))) {
            throw ValidationException::withMessages([
                'phone' => __('tracking.invalid_credentials'),
            ]);
        }

        $request->session()->regenerate();
        $access->grant($shipment);

        return to_route('track.show', $shipment->tracking_number);
    }
}
