<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class AdminProductController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'image_url' => 'nullable|string',
            'stock' => 'required|integer',
            'is_featured' => 'boolean',
            'ingredients' => 'nullable|string',
            'usage_instructions' => 'nullable|string',
            'suitable_for' => 'nullable|string',
            'weight' => 'nullable|numeric',
            'scent_type' => 'nullable|string',
            'is_on_sale' => 'boolean',
            'sale_price' => 'nullable|numeric',
            'sale_percentage' => 'nullable|integer',
            'sale_starts_at' => 'nullable|date',
            'sale_ends_at' => 'nullable|date',
            'average_rating' => 'nullable|numeric',
            'total_reviews' => 'nullable|integer',
        ]);
        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $validated = $request->validate([
            'name' => 'string|max:255',
            'description' => 'string',
            'price' => 'numeric',
            'category_id' => 'exists:categories,id',
            'image_url' => 'nullable|string',
            'stock' => 'integer',
            'is_featured' => 'boolean',
            'ingredients' => 'nullable|string',
            'usage_instructions' => 'nullable|string',
            'suitable_for' => 'nullable|string',
            'weight' => 'nullable|numeric',
            'scent_type' => 'nullable|string',
            'is_on_sale' => 'boolean',
            'sale_price' => 'nullable|numeric',
            'sale_percentage' => 'nullable|integer',
            'sale_starts_at' => 'nullable|date',
            'sale_ends_at' => 'nullable|date',
            'average_rating' => 'nullable|numeric',
            'total_reviews' => 'nullable|integer',
        ]);
        $product->update($validated);
        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }
} 