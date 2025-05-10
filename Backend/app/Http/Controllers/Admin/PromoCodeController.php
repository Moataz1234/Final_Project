<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PromoCode;
use Illuminate\Http\Request;

class PromoCodeController extends Controller
{
    public function index()
    {
        $promos = PromoCode::latest()->paginate(10);
        return view('admin.promos.index', compact('promos'));
    }

    public function create()
    {
        return view('admin.promos.form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:promo_codes',
            'description' => 'nullable|string',
            'discount_percentage' => 'required|integer|min:1|max:100',
            'minimum_order_amount' => 'nullable|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:starts_at',
            'is_first_order_only' => 'boolean',
        ]);

        PromoCode::create($validated);

        return redirect()
            ->route('admin.promos.index')
            ->with('success', 'Promo code created successfully.');
    }

    public function edit(PromoCode $promo)
    {
        return view('admin.promos.form', compact('promo'));
    }

    public function update(Request $request, PromoCode $promo)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:promo_codes,code,' . $promo->id,
            'description' => 'nullable|string',
            'discount_percentage' => 'required|integer|min:1|max:100',
            'minimum_order_amount' => 'nullable|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:starts_at',
            'is_first_order_only' => 'boolean',
        ]);

        $promo->update($validated);

        return redirect()
            ->route('admin.promos.index')
            ->with('success', 'Promo code updated successfully.');
    }

    public function destroy(PromoCode $promo)
    {
        $promo->delete();

        return redirect()
            ->route('admin.promos.index')
            ->with('success', 'Promo code deleted successfully.');
    }
} 