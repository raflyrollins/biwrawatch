<?php

namespace App\Http\Requests\Admin;

use App\Models\ShippingProvider;
use Closure;
use Illuminate\Validation\Rule;

class ProviderRequest extends AdminRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $provider = $this->route('provider');

        return [
            'name' => [
                'required',
                'string',
                'max:80',
                Rule::unique('shipping_providers', 'name')->ignore($provider instanceof ShippingProvider ? $provider->id : null),
            ],
            'tracking_url_template' => [
                'required',
                'string',
                'max:1000',
                function (string $attribute, mixed $value, Closure $fail): void {
                    $placeholder = (string) config('shipping.tracking_placeholder', '{tracking_number}');
                    $template = (string) $value;

                    if (! str_contains($template, $placeholder)) {
                        $fail(__('validation.provider_template_placeholder'));

                        return;
                    }

                    $url = str_replace($placeholder, 'TEST123', $template);
                    $scheme = parse_url($url, PHP_URL_SCHEME);

                    if (! in_array($scheme, ['http', 'https'], true) || filter_var($url, FILTER_VALIDATE_URL) === false) {
                        $fail(__('validation.provider_template_url'));
                    }
                },
            ],
            'tracking_number_pattern' => [
                'nullable',
                'string',
                'max:255',
                function (string $attribute, mixed $value, Closure $fail): void {
                    if (blank($value)) {
                        return;
                    }

                    if (@preg_match((string) $value, 'TEST123') === false) {
                        $fail(__('validation.provider_pattern'));
                    }
                },
            ],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
