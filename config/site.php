<?php

$whatsappNumber = preg_replace('/\D+/', '', (string) env('SITE_WHATSAPP_NUMBER', ''));
$whatsappMessage = (string) env(
    'SITE_WHATSAPP_MESSAGE',
    'Halo Biwrawatch, saya ingin bertanya tentang koleksi jam.',
);

return [
    'name' => env('APP_NAME', 'Biwrawatch'),
    'whatsapp_number' => $whatsappNumber !== '' ? $whatsappNumber : null,
    'whatsapp_message' => $whatsappMessage,
    'whatsapp_url' => $whatsappNumber !== ''
        ? 'https://wa.me/'.$whatsappNumber.'?text='.rawurlencode($whatsappMessage)
        : null,
    'email' => env('SITE_EMAIL', 'halo@biwrawatch.test'),
    'instagram_url' => env('SITE_INSTAGRAM_URL', 'https://instagram.com'),
    'address' => env('SITE_ADDRESS', 'Jakarta, Indonesia'),
    'currency' => 'IDR',
];
