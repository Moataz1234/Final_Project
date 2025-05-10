<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Get or create cart for the user
        $cart = Cart::firstOrCreate(
            ['user_id' => $user->id],
            ['user_id' => $user->id]
        );
        
        // Load cart items with product information
        $cart->load('items.product');
        
        $items = $cart->items->map(function ($item) {
            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'price' => $item->price,
                'name' => $item->product->name,
                'image_url' => $item->product->image_url,
                'category' => $item->product->category,
                'subtotal' => $item->price * $item->quantity
            ];
        });
        
        return response()->json([
            'items' => $items,
            'total_items' => $cart->total_items,
            'total_amount' => $cart->total
        ]);
    }
    
    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);
        
        $user = Auth::user();
        
        // Get or create cart
        $cart = Cart::firstOrCreate(
            ['user_id' => $user->id],
            ['user_id' => $user->id]
        );
        
        $product = Product::findOrFail($request->product_id);
        
        // Check if item already exists in cart
        $cartItem = $cart->items()->where('product_id', $product->id)->first();
        
        if ($cartItem) {
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $request->quantity,
                'price' => $product->price
            ]);
        }
        
        return response()->json([
            'message' => 'Item added to cart successfully'
        ]);
    }
    
    public function updateItem(Request $request, $itemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);
        
        $user = Auth::user();
        
        // Get user's cart
        $cart = Cart::where('user_id', $user->id)->first();
        
        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }
        
        $cartItem = $cart->items()->findOrFail($itemId);
        
        $cartItem->quantity = $request->quantity;
        $cartItem->save();
        
        return response()->json([
            'message' => 'Cart updated successfully'
        ]);
    }
    
    public function removeItem($itemId)
    {
        $user = Auth::user();
        
        // Get user's cart
        $cart = Cart::where('user_id', $user->id)->first();
        
        if (!$cart) {
            return response()->json(['message' => 'Cart not found'], 404);
        }
        
        $cartItem = $cart->items()->findOrFail($itemId);
        
        $cartItem->delete();
        
        return response()->json([
            'message' => 'Item removed from cart successfully'
        ]);
    }
    
    public function clear()
    {
        $user = Auth::user();
        
        // Get user's cart
        $cart = Cart::where('user_id', $user->id)->first();
        
        if ($cart) {
            $cart->items()->delete();
        }
        
        return response()->json([
            'message' => 'Cart cleared successfully'
        ]);
    }

}