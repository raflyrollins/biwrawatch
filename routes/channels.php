<?php

use App\Models\Shipment;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('shipments.{uuid}', function (User $user, string $uuid): bool {
    return $user->is_admin && Shipment::query()->where('uuid', $uuid)->exists();
});
