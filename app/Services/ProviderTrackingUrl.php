<?php

namespace App\Services;

use App\Models\ShippingProvider;

class ProviderTrackingUrl
{
    public function for(ShippingProvider $provider, string $trackingNumber): ?string
    {
        $placeholder = (string) config('shipping.tracking_placeholder', '{tracking_number}');
        $template = $provider->tracking_url_template;

        if (! str_contains($template, $placeholder)) {
            return null;
        }

        $url = str_replace($placeholder, rawurlencode($trackingNumber), $template);
        $scheme = parse_url($url, PHP_URL_SCHEME);

        if (! in_array($scheme, ['http', 'https'], true) || filter_var($url, FILTER_VALIDATE_URL) === false) {
            return null;
        }

        return $url;
    }
}
