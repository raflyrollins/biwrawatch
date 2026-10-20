<?php

namespace Database\Seeders;

use App\Enums\DiscountType;
use App\Models\Promotion;
use App\Models\Watch;
use Illuminate\Database\Seeder;

class PromotionSeeder extends Seeder
{
    public function run(): void
    {
        $tenPercent = Promotion::query()->updateOrCreate(
            ['name' => 'Hemat 10%'],
            [
                'label' => 'Hemat 10%',
                'description' => 'Potongan 10% untuk koleksi pilihan selama periode promo.',
                'discount_type' => DiscountType::Percentage,
                'discount_value' => 10,
                'starts_at' => now()->subDays(3),
                'ends_at' => now()->addDays(27),
                'is_active' => true,
                'applies_to_all' => true,
                'priority' => 10,
            ],
        );

        $tenPercent->watches()->sync([]);

        $special = Promotion::query()->updateOrCreate(
            ['name' => 'Harga Khusus Koleksi'],
            [
                'label' => 'Harga khusus',
                'description' => 'Potongan nominal untuk beberapa koleksi pilihan.',
                'discount_type' => DiscountType::Fixed,
                'discount_value' => 3000000,
                'starts_at' => now()->subDays(1),
                'ends_at' => now()->addDays(14),
                'is_active' => true,
                'applies_to_all' => false,
                'priority' => 5,
            ],
        );

        $special->watches()->sync(
            Watch::query()
                ->whereIn('reference_number', ['WSSA0029', 'Q2548520'])
                ->pluck('id')
                ->all(),
        );
    }
}
