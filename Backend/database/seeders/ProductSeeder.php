<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $products = [
            [
                'name' => 'Cute Plushie',
                'description' => 'Adorable soft plush toy perfect for cuddling',
                'price' => 29.99,
                'category' => 'Plushies',
                'image_url' => 'https://example.com/plushie.jpg',
                'stock' => 50,
                'is_featured' => true
            ],
            [
                'name' => 'Anime Keychain',
                'description' => 'Collectible keychain featuring popular anime characters',
                'price' => 12.99,
                'category' => 'Accessories',
                'image_url' => 'https://example.com/keychain.jpg',
                'stock' => 100,
                'is_featured' => false
            ],
            [
                'name' => 'Kawaii Sticker Pack',
                'description' => 'Set of 20 cute and fun stickers',
                'price' => 9.99,
                'category' => 'Stationery',
                'image_url' => 'https://example.com/stickers.jpg',
                'stock' => 75,
                'is_featured' => true
            ]
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }
    }
}