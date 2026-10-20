<?php

namespace App\Http\Requests\Admin;

use App\Models\ShippingProvider;
use Closure;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class ShipmentTrackingRequest extends AdminRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'provider_id' => [
                'required',
                Rule::exists('shipping_providers', 'id')->where('is_active', true),
            ],
            'tracking_number' => ['required', 'string', 'max:80', Rule::unique('shipment_trackings', 'tracking_number')],
            'is_primary' => ['sometimes', 'boolean'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * @return array<int, Closure>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $provider = ShippingProvider::query()->find((int) $this->input('provider_id'));
                $number = (string) $this->input('tracking_number');

                if ($provider?->tracking_number_pattern !== null && $number !== '' && @preg_match($provider->tracking_number_pattern, $number) !== 1) {
                    $validator->errors()->add('tracking_number', __('validation.provider_tracking_pattern'));
                }
            },
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'tracking_number' => preg_replace('/\s+/', '', strtoupper((string) $this->input('tracking_number'))) ?? '',
        ]);
    }
}
