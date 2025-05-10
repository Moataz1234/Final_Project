<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [];
        $names = [
            'Lavender Bliss Perfume', 'Ocean Breeze Candle', 'Soothing Face Cream', 'Tea Tree Oil Drops', 'Rose Bath Salts',
            'Aloe Vera Gel', 'Citrus Burst Perfume', 'Vanilla Dream Candle', 'Hydrating Face Serum', 'Eucalyptus Oil',
            'Minty Fresh Soap', 'Relaxing Bath Bomb', 'Glow Night Cream', 'Lemon Zest Candle', 'Argan Oil Elixir',
            'Berry Body Lotion', 'Coconut Milk Soap', 'Calm Mind Diffuser', 'Charcoal Face Mask', 'Jasmine Body Mist',
            'Shea Butter Cream', 'Sandalwood Candle', 'Vitamin C Serum', 'Peppermint Oil', 'Honey Oat Scrub',
            'Green Tea Lotion', 'Amber Essence Perfume', 'Lavender Sleep Spray', 'Rosehip Oil', 'Cucumber Eye Gel'
        ];

        for ($i = 1; $i <= 30; $i++) {
            $category_id = ($i % 6) + 1; // 1 to 6
            $is_on_sale = $i % 2 === 0;
            $sale_percentage = $is_on_sale ? rand(10, 30) : null;
            $price = rand(20, 150) + 0.99;
            $sale_price = $is_on_sale ? round($price * (1 - $sale_percentage / 100), 2) : null;
            $average_rating = round(rand(35, 50) / 10, 1); // 3.5 to 5.0
            $total_reviews = rand(3, 50);

            $products[] = [
                'name' => $names[$i - 1],
                'description' => 'High quality product for your wellness and care.',
                'price' => $price,
                'category_id' => $category_id,
                'image_url' => "Products\product_{$i}.jpeg",
                'stock' => rand(10, 200),
                'is_featured' => $i % 5 === 0,
                'ingredients' => 'Natural ingredients blend',
                'usage_instructions' => 'Use as directed on the package.',
                'suitable_for' => 'All skin types',
                'weight' => rand(10, 1000),
                'scent_type' => $category_id === 1 ? 'Floral' : ($category_id === 2 ? 'Herbal' : null),
                'is_on_sale' => $is_on_sale,
                'sale_price' => $sale_price,
                'sale_percentage' => $sale_percentage,
                'sale_starts_at' => $is_on_sale ? now() : null,
                'sale_ends_at' => $is_on_sale ? now()->addMonth() : null,
                'average_rating' => $average_rating,
                'total_reviews' => $total_reviews,
            ];
        }

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}