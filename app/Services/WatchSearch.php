<?php

namespace App\Services;

use App\Models\Watch;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class WatchSearch
{
    /**
     * @param  array{
     *     brand?: string|null,
     *     condition?: string|null,
     *     status?: string|null,
     *     year_min?: int|null,
     *     year_max?: int|null,
     *     price_min?: int|null,
     *     price_max?: int|null,
     *     sort?: string|null
     * }  $filters
     * @param  Builder<Watch>  $query
     * @return Builder<Watch>
     */
    public function apply(Builder $query, ?string $term, array $filters = []): Builder
    {
        $language = (string) config('search.language', 'indonesian');
        $terms = $this->terms($term);
        $hasTerm = $terms !== [];

        if ($hasTerm) {
            $tsQuery = implode(' | ', array_map(
                fn (string $term): string => $term.':*',
                $terms,
            ));

            $query
                ->whereRaw('watches.search_vector @@ to_tsquery(?, ?)', [$language, $tsQuery])
                ->orderByRaw('ts_rank_cd(watches.search_vector, to_tsquery(?, ?)) DESC', [$language, $tsQuery]);
        }

        $brand = $filters['brand'] ?? null;
        $condition = $filters['condition'] ?? null;
        $status = $filters['status'] ?? null;
        $yearMin = $filters['year_min'] ?? null;
        $yearMax = $filters['year_max'] ?? null;
        $priceMin = $filters['price_min'] ?? null;
        $priceMax = $filters['price_max'] ?? null;

        $query
            ->when(filled($brand), fn (Builder $query) => $query->where('brand', $brand))
            ->when(filled($condition), fn (Builder $query) => $query->where('condition', $condition))
            ->when(filled($status), fn (Builder $query) => $query->where('status', $status))
            ->when(filled($yearMin), fn (Builder $query) => $query->where('year', '>=', (int) $yearMin))
            ->when(filled($yearMax), fn (Builder $query) => $query->where('year', '<=', (int) $yearMax))
            ->when(filled($priceMin), fn (Builder $query) => $query->where('price', '>=', (int) $priceMin))
            ->when(filled($priceMax), fn (Builder $query) => $query->where('price', '<=', (int) $priceMax));

        $sort = $filters['sort'] ?? null;

        if ($hasTerm && ($sort === null || $sort === 'relevance')) {
            return $query;
        }

        return match ($sort) {
            'newest' => $query->orderByDesc('created_at'),
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            default => $query->orderByDesc('is_featured')->orderBy('sort_order')->orderByDesc('created_at'),
        };
    }

    /**
     * @return list<string>
     */
    public function terms(?string $term): array
    {
        if (blank($term)) {
            return [];
        }

        $normalized = Str::lower(Str::ascii($term));
        $normalized = preg_replace('/[^a-z0-9]+/', ' ', $normalized) ?? '';
        $words = preg_split('/\s+/', trim($normalized)) ?: [];

        /** @var list<string> $stopwords */
        $stopwords = config('search.stopwords', []);
        /** @var array<string, list<string>> $synonyms */
        $synonyms = config('search.synonyms', []);

        $terms = [];

        foreach ($words as $word) {
            if ($word === '' || mb_strlen($word) < 2 || in_array($word, $stopwords, true)) {
                continue;
            }

            $terms[] = $word;

            foreach ($synonyms[$word] ?? [] as $synonym) {
                $synonym = preg_replace('/[^a-z0-9]+/', '', Str::lower(Str::ascii($synonym))) ?? '';

                if ($synonym !== '' && ! in_array($synonym, $stopwords, true)) {
                    $terms[] = $synonym;
                }
            }
        }

        return array_values(array_unique($terms));
    }
}
