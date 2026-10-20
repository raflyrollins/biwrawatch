<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PromotionController;
use App\Http\Controllers\Admin\ProviderController;
use App\Http\Controllers\Admin\ShipmentController;
use App\Http\Controllers\Admin\ShipmentEventController;
use App\Http\Controllers\Admin\ShipmentStatusController;
use App\Http\Controllers\Admin\ShipmentTrackingController;
use App\Http\Controllers\Admin\WatchController as AdminWatchController;
use App\Http\Controllers\Admin\WatchImageController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TrackingController;
use App\Http\Controllers\WatchController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::get('/watches', [WatchController::class, 'index'])->name('watches.index');
Route::get('/watches/{watch}', [WatchController::class, 'show'])->name('watches.show');
Route::inertia('/credits', 'credits')->name('credits');

Route::get('/track', [TrackingController::class, 'index'])->name('track.index');
Route::post('/track/lookup', [TrackingController::class, 'lookup'])
    ->middleware('throttle:tracking-lookup')
    ->name('track.lookup');
Route::get('/track/{trackingNumber}', [TrackingController::class, 'show'])
    ->where('trackingNumber', '[A-Za-z0-9-]+')
    ->name('track.show');
Route::post('/track/{trackingNumber}/verify', [TrackingController::class, 'verify'])
    ->where('trackingNumber', '[A-Za-z0-9-]+')
    ->middleware('throttle:tracking-lookup')
    ->name('track.verify');

Route::get('/admin/login', [AuthController::class, 'showLogin'])->name('admin.login');
Route::post('/admin/login', [AuthController::class, 'login'])
    ->middleware('throttle:admin-login')
    ->name('admin.login.store');
Route::post('/admin/logout', [AuthController::class, 'logout'])
    ->middleware('auth')
    ->name('admin.logout');

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'admin'])
    ->group(function (): void {
        Route::get('/', DashboardController::class)->name('dashboard');

        Route::resource('watches', AdminWatchController::class)->except('show');
        Route::delete('/watches/{watch}/images/{image}', [WatchImageController::class, 'destroy'])
            ->name('watches.images.destroy');

        Route::resource('promotions', PromotionController::class)->except('show');
        Route::resource('providers', ProviderController::class)->except('show');
        Route::resource('shipments', ShipmentController::class)->except('destroy');

        Route::post('/shipments/{shipment}/trackings', [ShipmentTrackingController::class, 'store'])
            ->name('shipments.trackings.store');
        Route::patch('/shipments/{shipment}/trackings/{tracking}/primary', [ShipmentTrackingController::class, 'setPrimary'])
            ->name('shipments.trackings.primary');
        Route::delete('/shipments/{shipment}/trackings/{tracking}', [ShipmentTrackingController::class, 'destroy'])
            ->name('shipments.trackings.destroy');

        Route::patch('/shipments/{shipment}/status', [ShipmentStatusController::class, 'update'])
            ->name('shipments.status.update');
        Route::delete('/shipments/{shipment}/events/{event}', [ShipmentEventController::class, 'destroy'])
            ->name('shipments.events.destroy');
    });
