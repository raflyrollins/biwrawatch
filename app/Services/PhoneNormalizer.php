<?php

namespace App\Services;

class PhoneNormalizer
{
    public function normalize(?string $phone): ?string
    {
        $digits = preg_replace('/\D+/', '', (string) $phone) ?? '';

        if ($digits === '') {
            return null;
        }

        $countryCode = (string) config('shipping.default_country_code', '62');

        if (str_starts_with($digits, '00')) {
            $digits = substr($digits, 2);
        }

        if (str_starts_with($digits, '0')) {
            return $countryCode.substr($digits, 1);
        }

        if (str_starts_with($digits, $countryCode)) {
            return $digits;
        }

        if (str_starts_with($digits, '8')) {
            return $countryCode.$digits;
        }

        return $digits;
    }

    public function matches(?string $stored, ?string $provided): bool
    {
        $normalizedStored = $this->normalize($stored);
        $normalizedProvided = $this->normalize($provided);

        if ($normalizedStored === null || $normalizedProvided === null) {
            return false;
        }

        return hash_equals($normalizedStored, $normalizedProvided);
    }
}
