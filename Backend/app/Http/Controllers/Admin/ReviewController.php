<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductReview;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = ProductReview::with(['user', 'product'])
            ->latest()
            ->paginate(10);

        return view('admin.reviews.index', compact('reviews'));
    }

    public function approve(ProductReview $review)
    {
        $review->update(['is_approved' => true]);

        // Update product average rating
        $product = $review->product;
        $product->average_rating = $product->reviews()->where('is_approved', true)->avg('rating');
        $product->total_reviews = $product->reviews()->where('is_approved', true)->count();
        $product->save();

        return redirect()
            ->route('admin.reviews.index')
            ->with('success', 'Review approved successfully.');
    }

    public function destroy(ProductReview $review)
    {
        $review->delete();

        // Update product average rating
        $product = $review->product;
        $product->average_rating = $product->reviews()->where('is_approved', true)->avg('rating');
        $product->total_reviews = $product->reviews()->where('is_approved', true)->count();
        $product->save();

        return redirect()
            ->route('admin.reviews.index')
            ->with('success', 'Review deleted successfully.');
    }
} 