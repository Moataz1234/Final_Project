<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
class ProductReviewController extends Controller
{
    // List all reviews (admin)
    public function index(Request $request)
    {
        $query = ProductReview::with('user', 'product');
        if ($request->has('product_id')) {
            $query->where('product_id', $request->input('product_id'));
        }
        // Optionally, only show approved reviews to non-admins
        if (!$request->user() || !$request->user()->hasRole('admin')) {
            $query->where('is_approved', true);
        }
        return response()->json($query->get());
    }
    // Store a new review (user)
    public function store(Request $request)
    {
        Log::info('Review submission', [
            'user' => Auth::user(),
            'is_authenticated' => Auth::check(),
            'request_data' => $request->all(),
        ]);
        
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string',
        ]);
        
        $validated['user_id'] = Auth::id();
        
        // Check if user has already reviewed this product
        $existingReview = ProductReview::where('user_id', Auth::id())
            ->where('product_id', $validated['product_id'])
            ->first();
            
        if ($existingReview) {
            // Update existing review
            $existingReview->update([
                'rating' => $validated['rating'],
                'review' => $validated['review'],
                'is_approved' => false // Reset approval status for updated review
            ]);
            return response()->json($existingReview, 200);
        }
        
        // Create new review if none exists
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
