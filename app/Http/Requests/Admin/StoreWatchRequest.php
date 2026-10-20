<?php

namespace App\Http\Requests\Admin;

use App\Enums\WatchCondition;
use App\Enums\WatchStatus;
use Illuminate\Validation\Rule;

class StoreWatchRequest extends AdminRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'brand' => ['required', 'string', 'max:80'],
            'model' => ['required', 'string', 'max:120'],
            'reference_number' => ['required', 'string', 'max:80', Rule::unique('watches', 'reference_number')],
            'year' => ['nullable', 'integer', 'min:1900', 'max:'.(now()->year + 1)],
            'movement' => ['nullable', 'string', 'max:80'],
            'case_material' => ['nullable', 'string', 'max:80'],
            'case_diameter_mm' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'dial_color' => ['nullable', 'string', 'max:60'],
            'strap_material' => ['nullable', 'string', 'max:80'],
            'condition' => ['required', Rule::enum(WatchCondition::class)],
            'description' => ['nullable', 'string', 'max:5000'],
            'search_keywords' => ['nullable', 'string', 'max:2000'],
            'price' => ['required', 'integer', 'min:0', 'max:'.config('catalog.price_max')],
            'status' => ['required', Rule::enum(WatchStatus::class)],
            'is_published' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'images' => ['nullable', 'array', 'max:8'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }
}
