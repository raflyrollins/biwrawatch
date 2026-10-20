<?php

use Inertia\Testing\AssertableInertia as Assert;

test('shared translations use the keys expected by the frontend', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('translations', function ($translations): bool {
                expect($translations)->toMatchArray([
                    'ui.home.title' => __('ui.home.title'),
                    'ui.catalog.title' => __('ui.catalog.title'),
                    'nav.collection' => __('ui.nav.collection'),
                    'footer.rights' => __('ui.footer.rights'),
                    'theme.label' => __('ui.theme.label'),
                    'admin.nav.dashboard' => __('admin.nav.dashboard'),
                    'watch.labels.status' => __('watch.labels.status'),
                    'shipment.labels.status' => __('shipment.labels.status'),
                    'tracking.last_update' => __('tracking.last_update'),
                ]);

                return true;
            }));
});
