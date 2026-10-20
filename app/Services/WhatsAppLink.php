<?php

namespace App\Services;

use App\Models\Watch;

class WhatsAppLink
{
    public function forWatch(Watch $watch): ?string
    {
        $message = sprintf(
            'Halo Biwrawatch, saya ingin bertanya tentang %s %s (%s). %s',
            $watch->brand,
            $watch->model,
            $watch->reference_number,
            route('watches.show', $watch),
        );

        return $this->build($message);
    }

    public function general(): ?string
    {
        return $this->build((string) config('site.whatsapp_message'));
    }

    private function build(string $message): ?string
    {
        $number = config('site.whatsapp_number');

        if (blank($number)) {
            return null;
        }

        return 'https://wa.me/'.$number.'?text='.rawurlencode($message);
    }
}
