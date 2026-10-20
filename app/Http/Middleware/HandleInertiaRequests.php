<?php

namespace App\Http\Middleware;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Lang;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'locale' => app()->getLocale(),
            'translations' => $this->translations(),
            'auth' => [
                'user' => $user instanceof User ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_admin' => $user->is_admin,
                ] : null,
            ],
            'site' => [
                'name' => config('site.name'),
                'whatsapp_url' => config('site.whatsapp_url'),
                'email' => config('site.email'),
                'instagram_url' => config('site.instagram_url'),
                'address' => config('site.address'),
                'currency' => config('site.currency'),
                'tracking_refresh_seconds' => config('shipping.public_refresh_seconds'),
            ],
            'flash' => [
                'success' => fn (): ?string => $request->session()->get('success'),
                'error' => fn (): ?string => $request->session()->get('error'),
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    private function translations(): array
    {
        $translations = [];

        foreach (['ui', 'watch', 'promotion', 'shipment', 'tracking', 'auth', 'admin', 'catalog', 'site', 'validation'] as $group) {
            $lines = Lang::get($group);

            if (! is_array($lines)) {
                continue;
            }

            $flat = Arr::dot($lines);

            foreach ($flat as $key => $value) {
                $translations[$group.'.'.$key] = $value;
            }

            if ($group === 'ui') {
                $translations = [...$translations, ...$flat];
            }
        }

        return $translations;
    }
}
