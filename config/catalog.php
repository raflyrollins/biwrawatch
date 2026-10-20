<?php

return [
    'currency' => env('CATALOG_CURRENCY', 'IDR'),
    'per_page' => (int) env('CATALOG_PER_PAGE', 12),
    'featured_limit' => (int) env('CATALOG_FEATURED_LIMIT', 6),
    'related_limit' => (int) env('CATALOG_RELATED_LIMIT', 3),
    'price_min' => (int) env('CATALOG_PRICE_MIN', 0),
    'price_max' => (int) env('CATALOG_PRICE_MAX', 1000000000),
];
