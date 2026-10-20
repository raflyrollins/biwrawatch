<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $email = (string) config('admin.email', 'admin@biwrawatch.test');
        $password = config('admin.password');

        if (! app()->isProduction() && blank($password)) {
            $password = 'password';
        }

        if (filled($password)) {
            User::query()->updateOrCreate(
                ['email' => $email],
                [
                    'name' => 'Biwrawatch Admin',
                    'password' => $password,
                    'is_admin' => true,
                ],
            );
        }

        $this->call([
            WatchSeeder::class,
            PromotionSeeder::class,
            ShippingSeeder::class,
        ]);
    }
}
