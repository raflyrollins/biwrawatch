<?php

namespace App\Http\Requests\Admin;

use App\Enums\DiscountType;
use Illuminate\Validation\Rule;

class PromotionRequest extends AdminRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'label' => ['nullable', 'string', 'max:60'],
            'description' => ['nullable', 'string', 'max:2000'],
            'discount_type' => ['nullable', Rule::enum(DiscountType::class)],
            'discount_value' => [
                Rule::requiredIf(fn (): bool => filled($this->input('discount_type'))),
                'nullable',
                'integer',
                'min:0',
                Rule::when($this->input('discount_type') === DiscountType::Percentage->value, ['max:100']),
            ],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'is_active' => ['sometimes', 'boolean'],
            'applies_to_all' => ['sometimes', 'boolean'],
            'priority' => ['nullable', 'integer', 'min:0'],
            'watch_ids' => ['nullable', 'array'],
            'watch_ids.*' => ['integer', 'exists:watches,id'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->input('discount_type') === '') {
            $this->merge(['discount_type' => null]);
        }

        if ($this->input('discount_value') === '') {
            $this->merge(['discount_value' => null]);
        }
    }
}
