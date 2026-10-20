<?php

return [
    'tracking_prefix' => env('SHIPPING_TRACKING_PREFIX', 'BW'),
    'sequence_length' => (int) env('SHIPPING_SEQUENCE_LENGTH', 5),
    'timezone' => env('SHIPPING_TIMEZONE', 'Asia/Jakarta'),
    'default_country_code' => env('SHIPPING_DEFAULT_COUNTRY_CODE', '62'),
    'verification_ttl_minutes' => (int) env('SHIPPING_VERIFICATION_TTL', 30),
    'tracking_placeholder' => '{tracking_number}',
    'lookup_rate_limit' => (int) env('SHIPPING_LOOKUP_RATE_LIMIT', 5),
    'public_refresh_seconds' => (int) env('SHIPPING_PUBLIC_REFRESH_SECONDS', 15),
];
