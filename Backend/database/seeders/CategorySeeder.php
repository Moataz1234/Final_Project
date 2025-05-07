<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Perfumes',
                'slug' => 'perfumes',
                'description' => 'Luxury and therapeutic fragrances'
            ],
            [
                'name' => 'Aromatherapy Candles',
                'slug' => 'aromatherapy-candles',
                'description' => 'Therapeutic scented candles for relaxation and wellness'
            ],
            [
                'name' => 'Skin Care',
                'slug' => 'skin-care',
                'description' => 'Natural and therapeutic skin care products'
            ],
            [
                'name' => 'Essential Oils',
                'slug' => 'essential-oils',
                'description' => 'Pure therapeutic grade essential oils'
            ],
            [
                'name' => 'Bath & Body',
                'slug' => 'bath-body',
                'description' => 'Luxury bath and body care products'
            ],
            [
                'name' => 'Gift Sets',
                'slug' => 'gift-sets',
                'description' => 'Curated gift sets and collections'
            ]
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
