<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ShipmentTrackingRequest;
use App\Models\Shipment;
use App\Models\ShipmentTracking;
use App\Models\ShippingProvider;
use App\Services\ShipmentTrackingManager;
use Illuminate\Http\RedirectResponse;

class ShipmentTrackingController extends Controller
{
    public function store(
        ShipmentTrackingRequest $request,
        Shipment $shipment,
        ShipmentTrackingManager $manager,
    ): RedirectResponse {
        $provider = ShippingProvider::query()->findOrFail($request->integer('provider_id'));

        $manager->add(
            $shipment,
            $provider,
            (string) $request->input('tracking_number'),
            $request->boolean('is_primary'),
            $request->input('notes'),
        );

        return back()->with('success', __('admin.flash.tracking_added'));
    }

    public function setPrimary(
        Shipment $shipment,
        ShipmentTracking $tracking,
        ShipmentTrackingManager $manager,
    ): RedirectResponse {
        $manager->setPrimary($shipment, $tracking);

        return back()->with('success', __('admin.flash.tracking_primary'));
    }

    public function destroy(
        Shipment $shipment,
        ShipmentTracking $tracking,
        ShipmentTrackingManager $manager,
    ): RedirectResponse {
        $manager->remove($shipment, $tracking);

        return back()->with('success', __('admin.flash.tracking_removed'));
    }
}
