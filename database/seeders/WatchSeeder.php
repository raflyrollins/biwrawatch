<?php

namespace Database\Seeders;

use App\Enums\WatchCondition;
use App\Enums\WatchStatus;
use App\Models\Watch;
use App\Models\WatchImage;
use Illuminate\Database\Seeder;

class WatchSeeder extends Seeder
{
    public function run(): void
    {
        $watches = [
            [
                'brand' => 'Rolex',
                'model' => 'Datejust 36',
                'reference_number' => '126234',
                'year' => 2023,
                'movement' => 'Otomatis, Calibre 3235',
                'case_material' => 'Oystersteel & white gold',
                'case_diameter_mm' => 36,
                'dial_color' => 'Silver',
                'strap_material' => 'Jubilee bracelet',
                'condition' => WatchCondition::PreOwned,
                'description' => "Datejust 36 dengan dial silver dan bezel white gold yang fluted. Hadir lengkap dengan box dan kartu garansi.\n\nKondisi sangat baik, tanpa lecet berarti pada case maupun bracelet.",
                'search_keywords' => 'rolex datejust dj36 fluted jubilee silver otomatis',
                'price' => 185000000,
                'status' => WatchStatus::Available,
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'brand' => 'Omega',
                'model' => 'Speedmaster Moonwatch',
                'reference_number' => '310.30.42.50.01.002',
                'year' => 2022,
                'movement' => 'Manual, Calibre 3861',
                'case_material' => 'Stainless steel',
                'case_diameter_mm' => 42,
                'dial_color' => 'Hitam',
                'strap_material' => 'Stainless steel',
                'condition' => WatchCondition::PreOwned,
                'description' => 'Speedmaster Professional Moonwatch dengan sapphire crystal dan caliber 3861. Koleksi ikonik dengan proporsi yang nyaman dipakai.',
                'search_keywords' => 'omega speedmaster moonwatch chronograph manual sapphire',
                'price' => 92500000,
                'status' => WatchStatus::Available,
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'brand' => 'Cartier',
                'model' => 'Santos Medium',
                'reference_number' => 'WSSA0029',
                'year' => 2021,
                'movement' => 'Otomatis, Calibre 1847 MC',
                'case_material' => 'Stainless steel',
                'case_diameter_mm' => 35.1,
                'dial_color' => 'Silver opaline',
                'strap_material' => 'Leather',
                'condition' => WatchCondition::PreOwned,
                'description' => 'Santos Medium dengan dial opaline dan bracelet steel. Desain persegi ikonik yang mudah dipadukan untuk penggunaan harian.',
                'search_keywords' => 'cartier santos medium wssa0029 square steel',
                'price' => 98000000,
                'status' => WatchStatus::Reserved,
                'is_featured' => true,
                'sort_order' => 3,
            ],
            [
                'brand' => 'Tudor',
                'model' => 'Black Bay 58',
                'reference_number' => '79030N',
                'year' => 2020,
                'movement' => 'Otomatis, MT5402',
                'case_material' => 'Stainless steel',
                'case_diameter_mm' => 39,
                'dial_color' => 'Hitam',
                'strap_material' => 'Stainless steel',
                'condition' => WatchCondition::PreOwned,
                'description' => 'Black Bay 58 dengan ukuran 39 mm yang klasik. Dive watch modern dengan karakter vintage dan sertifikasi chronometer.',
                'search_keywords' => 'tudor black bay 58 bb58 dive watch 79030n',
                'price' => 48500000,
                'status' => WatchStatus::Available,
                'is_featured' => false,
                'sort_order' => 4,
            ],
            [
                'brand' => 'Grand Seiko',
                'model' => 'Snowflake',
                'reference_number' => 'SBGA211',
                'year' => 2019,
                'movement' => 'Spring Drive, Calibre 9R65',
                'case_material' => 'High-intensity titanium',
                'case_diameter_mm' => 41,
                'dial_color' => 'Putih',
                'strap_material' => 'Titanium',
                'condition' => WatchCondition::PreOwned,
                'description' => 'Grand Seiko Snowflake dengan dial bertekstur dan Spring Drive. Ringan, presisi, dan sangat khas dalam detail finishing.',
                'search_keywords' => 'grand seiko snowflake sbga211 spring drive titanium',
                'price' => 72000000,
                'status' => WatchStatus::Sold,
                'is_featured' => false,
                'sort_order' => 5,
            ],
            [
                'brand' => 'Jaeger-LeCoultre',
                'model' => 'Reverso Classic Medium Thin',
                'reference_number' => 'Q2548520',
                'year' => 2022,
                'movement' => 'Manual, Calibre 846',
                'case_material' => 'Stainless steel',
                'case_diameter_mm' => 40,
                'dial_color' => 'Silver',
                'strap_material' => 'Leather',
                'condition' => WatchCondition::PreOwned,
                'description' => 'Reverso Classic Medium Thin dengan case reversible ikonik. Proporsi tipis dan elegan untuk tampilan formal.',
                'search_keywords' => 'jaeger lecoultre jlc reverso classic medium thin manual',
                'price' => 85000000,
                'status' => WatchStatus::Available,
                'is_featured' => true,
                'sort_order' => 6,
            ],
        ];

        foreach ($watches as $index => $data) {
            $watch = Watch::query()->updateOrCreate(
                ['reference_number' => $data['reference_number']],
                [
                    ...$data,
                    'is_published' => true,
                ],
            );

            WatchImage::query()->firstOrCreate(
                ['watch_id' => $watch->id, 'sort_order' => 1],
                [
                    'path' => '/images/demo/watches/watch-'.(($index % 6) + 1).'.jpg',
                    'alt' => $watch->brand.' '.$watch->model,
                ],
            );
        }
    }
}
