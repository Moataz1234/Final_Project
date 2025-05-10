<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bundle;
use App\Models\Product;
use Illuminate\Http\Request;

class BundleController extends Controller
{
    public function index()
    {
        $bundles = Bundle::with('products')->latest()->paginate(10);
        return view('admin.bundles.index', compact('bundles'));
    }

    public function create()
    {
        $products = Product::where('is_active', true)->get();
        return view('admin.bundles.form', compact('products'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'discount_percentage' => 'required|integer|min:1|max:100',
            'is_active' => 'boolean',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:starts_at',
            'products' => 'required|array|min:2',
            'products.*' => 'exists:products,id',
        ]);

        $bundle = Bundle::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'discount_percentage' => $validated['discount_percentage'],
            'is_active' => $validated['is_active'],
            'starts_at' => $validated['starts_at'],
            'expires_at' => $validated['expires_at'],
        ]);

        $bundle->products()->attach($validated['products']);

        return redirect()
            ->route('admin.bundles.index')
            ->with('success', 'Bundle created successfully.');
    }

    public function edit(Bundle $bundle)
    {
        $products = Product::where('is_active', true)->get();
        $selectedProducts = $bundle->products->pluck('id')->toArray();
        return view('admin.bundles.form', compact('bundle', 'products', 'selectedProducts'));
    }

    public function update(Request $request, Bundle $bundle)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'discount_percentage' => 'required|integer|min:1|max:100',
            'is_active' => 'boolean',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:starts_at',
            'products' => 'required|array|min:2',
            'products.*' => 'exists:products,id',
        ]);

        $bundle->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'discount_percentage' => $validated['discount_percentage'],
            'is_active' => $validated['is_active'],
            'starts_at' => $validated['starts_at'],
            'expires_at' => $validated['expires_at'],
        ]);

        $bundle->products()->sync($validated['products']);

        return redirect()
            ->route('admin.bundles.index')
            ->with('success', 'Bundle updated successfully.');
    }

    public function destroy(Bundle $bundle)
    {
        $bundle->products()->detach();
        $bundle->delete();

        return redirect()
            ->route('admin.bundles.index')
            ->with('success', 'Bundle deleted successfully.');
    }
} 