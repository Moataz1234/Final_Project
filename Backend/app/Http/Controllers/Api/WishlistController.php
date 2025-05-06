<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    /**
     * Get the authenticated user's wishlist
     */
    public function index()
    {
        $wishlistItems = Wishlist::where('user_id', Auth::id())
            ->with('product')
            ->get()
            ->pluck('product');
            
        return response()->json($wishlistItems);
    }

    /**
     * Add a product to wishlist
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id'
        ]);

        $wishlistItem = Wishlist::firstOrCreate([
            'user_id' => Auth::id(),
            'product_id' => $request->product_id
        ]);

        if ($wishlistItem->wasRecentlyCreated) {
            return response()->json([
                'message' => 'Product added to wishlist',
                'product' => Product::find($request->product_id)
            ], 201);
        }

        return response()->json([
            'message' => 'Product already in wishlist',
            'product' => Product::find($request->product_id)
        ]);
    }

    /**
     * Remove a product from wishlist
     */
    public function destroy($productId)
    {
        $deleted = Wishlist::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->delete();

        if ($deleted) {
            return response()->json([
                'message' => 'Product removed from wishlist'
            ]);
        }

        return response()->json([
            'message' => 'Product not found in wishlist'
        ], 404);
    }

    /**
     * Clear the entire wishlist
     */
    public function clear()
    {
        Wishlist::where('user_id', Auth::id())->delete();

        return response()->json([
            'message' => 'Wishlist cleared'
        ]);
    }
}
