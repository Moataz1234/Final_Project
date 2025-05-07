<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PromoCode;
use Illuminate\Http\Request;

class PromoCodeController extends Controller
{
    public function index()
    {
        return response()->json(PromoCode::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:promo_codes',
            'description' => 'nullable|string',
            'discount_percentage' => 'required|integer|min:1|max:100',
            'minimum_order_amount' => 'nullable|numeric',
            'max_uses' => 'nullable|integer',
            'is_active' => 'boolean',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date',
            'is_first_order_only' => 'boolean',
        ]);
        $promo = PromoCode::create($validated);
        return response()->json($promo, 201);
    }

    public function update(Request $request, $id)
    {
        $promo = PromoCode::findOrFail($id);
        $validated = $request->validate([
            'code' => 'string|unique:promo_codes,code,' . $id,
            'description' => 'nullable|string',
            'discount_percentage' => 'integer|min:1|max:100',
            'minimum_order_amount' => 'nullable|numeric',
            'max_uses' => 'nullable|integer',
            'is_active' => 'boolean',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date',
            'is_first_order_only' => 'boolean',
        ]);
        $promo->update($validated);
        return response()->json($promo);
    }

    public function destroy($id)
    {
        $promo = PromoCode::findOrFail($id);
        $promo->delete();
        return response()->json(['message' => 'Promo code deleted']);
    }
} 