<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TrackLookupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'tracking_number' => ['required', 'string', 'max:80'],
            'phone' => ['required', 'string', 'max:32'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'tracking_number' => preg_replace('/\s+/', '', (string) $this->input('tracking_number')) ?? '',
            'phone' => trim((string) $this->input('phone')),
        ]);
    }
}
