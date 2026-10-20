<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the admin login', function () {
    $this->get(route('admin.dashboard'))->assertRedirect(route('admin.login'));
});

test('non-admin users cannot access the admin area', function () {
    $user = User::factory()->create(['is_admin' => false]);

    $this->actingAs($user)->get(route('admin.dashboard'))->assertForbidden();
});

test('admins can access the dashboard', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $this->actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->has('stats'));
});

test('admin login accepts valid credentials', function () {
    $admin = User::factory()->create([
        'email' => 'admin@example.com',
        'password' => 'secret-password',
        'is_admin' => true,
    ]);

    $this->post(route('admin.login.store'), [
        'email' => 'admin@example.com',
        'password' => 'secret-password',
    ])->assertRedirect(route('admin.dashboard'));

    $this->assertAuthenticatedAs($admin);
});

test('non-admin credentials are rejected', function () {
    User::factory()->create([
        'email' => 'user@example.com',
        'password' => 'secret-password',
        'is_admin' => false,
    ]);

    $this->from(route('admin.login'))
        ->post(route('admin.login.store'), [
            'email' => 'user@example.com',
            'password' => 'secret-password',
        ])
        ->assertRedirect(route('admin.login'))
        ->assertSessionHasErrors('email');

    $this->assertGuest();
});
