<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()->with('category');

        $filters = $request->only([
            'category',
            'min_price',
            'max_price',
            'search'
        ]);

        // $products = $query->filter($filters)
        //     ->paginate($request->input('per_page', 12));
        $products = $query->filter($filters)
        ->paginate($request->input('per_page', 12))
        ->through(function ($product) {
            // Ensure price is a float
            $product->price = floatval($product->price);
            return $product;
        });
        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }
    public function getCategories()
    {
        $categories = Category::all();
        return response()->json($categories);
    }
}
