<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ShipmentStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\ShipmentPresenter;
use App\Models\Promotion;
use App\Models\Shipment;
use App\Models\Watch;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(ShipmentPresenter $presenter): Response
    {
        $recentShipments = Shipment::query()
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'watches_total' => Watch::query()->count(),
                'watches_published' => Watch::query()->where('is_published', true)->count(),
                'shipments_total' => Shipment::query()->count(),
                'shipments_active' => Shipment::query()
                    ->whereIn('status', [
                        ShipmentStatus::InTransit,
                        ShipmentStatus::Customs,
                        ShipmentStatus::OutForDelivery,
                    ])
                    ->count(),
                'delivered_this_month' => Shipment::query()
                    ->where('status', ShipmentStatus::Delivered)
                    ->whereBetween('delivered_at', [now()->startOfMonth(), now()->endOfMonth()])
                    ->count(),
                'active_promotions' => Promotion::query()->active()->count(),
            ],
            'recent_shipments' => $recentShipments
                ->map(fn (Shipment $shipment): array => $presenter->summary($shipment))
                ->values()
                ->all(),
        ]);
    }
}
