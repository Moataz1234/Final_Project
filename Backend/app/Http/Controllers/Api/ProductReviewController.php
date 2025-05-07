<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductReviewController extends Controller
{
    // List all reviews (admin)
    public function index()
    {
        return response()->json(ProductReview::with('user', 'product')->get());
    }

    // Store a new review (user)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string',
        ]);
        $validated['user_id'] = Auth::id();
        $review = ProductReview::create($validated);
        return response()->json($review, 201);
    }

    // Update a review (user or admin)
    public function update(Request $request, $id)
    {
        $review = ProductReview::findOrFail($id);
        $validated = $request->validate([
            'rating' => 'integer|min:1|max:5',
            'review' => 'nullable|string',
            'is_approved' => 'boolean',
        ]);
        $review->update($validated);
        return response()->json($review);
    }

    // Delete a review (admin or user)
    public function destroy($id)
    {
        $review = ProductReview::findOrFail($id);
        $review->delete();
        return response()->json(['message' => 'Review deleted']);
    }

    // Approve a review (admin)
    public function approve($id)
    {
        $review = ProductReview::findOrFail($id);
        $review->is_approved = true;
        $review->save();
        return response()->json(['message' => 'Review approved', 'review' => $review]);
    }
} 