<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use App\Models\ShipmentEvent;
use Illuminate\Http\RedirectResponse;

class ShipmentEventController extends Controller
{
    public function destroy(Shipment $shipment, ShipmentEvent $event): RedirectResponse
    {
        abort_unless($event->shipment_id === $shipment->id, 404);

        $event->delete();

        return back()->with('success', __('admin.flash.event_deleted'));
    }
}
