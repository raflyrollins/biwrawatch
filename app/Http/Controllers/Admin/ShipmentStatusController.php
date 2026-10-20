<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ShipmentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ShipmentStatusRequest;
use App\Models\Shipment;
use App\Models\User;
use App\Services\ShipmentStatusUpdater;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;

class ShipmentStatusController extends Controller
{
    public function update(
        ShipmentStatusRequest $request,
        Shipment $shipment,
        ShipmentStatusUpdater $updater,
    ): RedirectResponse {
        $validated = $request->validated();
        $user = $request->user();

        $updater->update(
            $shipment,
            ShipmentStatus::from((string) $validated['status']),
            $validated['location'] ?? null,
            $validated['note'] ?? null,
            $request->boolean('is_public', true),
            filled($validated['occurred_at'] ?? null) ? Carbon::parse($validated['occurred_at']) : null,
            $user instanceof User ? $user : null,
        );

        return back()->with('success', __('admin.flash.status_updated'));
    }
}
