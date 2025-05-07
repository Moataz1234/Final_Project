<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bundle;
use Illuminate\Http\Request;

class BundleController extends Controller
{
    public function index()
    {
        return response()->json(Bundle::with('products')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image_url' => 'nullable|string',
            'description' => 'nullable|string',
            'bundle_price' => 'nullable|numeric',
            'discount_percentage' => 'nullable|integer|min:1|max:100',
            'products' => 'required|array',
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
        ]);
        $bundle = Bundle::create($validated);
        $bundle->products()->sync(collect($validated['products'])->mapWithKeys(function($item) {
            return [$item['id'] => ['quantity' => $item['quantity']]];
        }));
        return response()->json($bundle->load('products'), 201);
    }

    public function update(Request $request, $id)
    {
        $bundle = Bundle::findOrFail($id);
        $validated = $request->validate([
            'name' => 'string|max:255',
            'image_url' => 'nullable|string',
            'description' => 'nullable|string',
            'bundle_price' => 'nullable|numeric',
            'discount_percentage' => 'nullable|integer|min:1|max:100',
            'products' => 'nullable|array',
            'products.*.id' => 'required_with:products|exists:products,id',
            'products.*.quantity' => 'required_with:products|integer|min:1',
        ]);
        $bundle->update($validated);
        if (isset($validated['products'])) {
            $bundle->products()->sync(collect($validated['products'])->mapWithKeys(function($item) {
                return [$item['id'] => ['quantity' => $item['quantity']]];
            }));
        }
        return response()->json($bundle->load('products'));
    }

    public function destroy($id)
    {
        $bundle = Bundle::findOrFail($id);
        $bundle->products()->detach();
        $bundle->delete();
        return response()->json(['message' => 'Bundle deleted']);
    }
} 