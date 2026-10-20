<?php

namespace App\Http\Requests\Admin;

class UpdateShipmentRequest extends AdminRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'recipient_name' => ['required', 'string', 'max:120'],
            'recipient_phone' => ['required', 'string', 'max:32'],
            'recipient_address' => ['required', 'string', 'max:1000'],
            'destination_city' => ['required', 'string', 'max:120'],
            'destination_country' => ['required', 'string', 'max:80'],
            'estimated_delivery_at' => ['nullable', 'date'],
            'internal_notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'recipient_phone' => trim((string) $this->input('recipient_phone')),
        ]);
    }
}
