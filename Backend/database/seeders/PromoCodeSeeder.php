<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PromoCode;

class PromoCodeSeeder extends Seeder
{
    public function run(): void
    {
        PromoCode::create([
            'code' => 'FIRST20',
            'description' => '20% off on your first order',
            'discount_percentage' => 20,
            'is_first_order_only' => true,
            'is_active' => true,
            'starts_at' => now(),
            'expires_at' => now()->addYears(1), // Valid for 1 year
        ]);
    }
} 