<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Get the authenticated user's cart
     */
    public function index()
    {
        $cart = $this->getOrCreateCart();
        
        $cart->load('items.product');
        
        return response()->json([
            'items' => $cart->items,
            'total_items' => $cart->total_items,
            'total_price' => $cart->total
        ]);
    }

    /**
     * Add a product to cart
     */
    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = $this->getOrCreateCart();
        $product = Product::findOrFail($request->product_id);
        
        // Check if product is already in cart
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();
            
        if ($cartItem) {
            // Update quantity if product already exists in cart
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
            
            $message = 'Cart item quantity updated';
        } else {
            // Add new item to cart
            $cartItem = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => $request->quantity,
                'price' => $product->price
            ]);
            
            $message = 'Product added to cart';
        }
        
        return response()->json([
            'message' => $message,
            'cart_item' => $cartItem->load('product'),
            'total_items' => $cart->fresh()->total_items,
            'total_price' => $cart->fresh()->total
        ]);
    }

    /**
     * Update cart item quantity
     */
    public function updateItem(Request $request, $itemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = $this->getOrCreateCart();
        
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('id', $itemId)
            ->firstOrFail();
            
        $cartItem->quantity = $request->quantity;
        $cartItem->save();
        
        return response()->json([
            'message' => 'Cart item updated',
            'cart_item' => $cartItem->load('product'),
            'total_items' => $cart->fresh()->total_items,
            'total_price' => $cart->fresh()->total
        ]);
    }

    /**
     * Remove an item from cart
     */
    public function removeItem($itemId)
    {
        $cart = $this->getOrCreateCart();
        
        $deleted = CartItem::where('cart_id', $cart->id)
            ->where('id', $itemId)
            ->delete();
            
        if ($deleted) {
            return response()->json([
                'message' => 'Item removed from cart',
                'total_items' => $cart->fresh()->total_items,
                'total_price' => $cart->fresh()->total
            ]);
        }
        
        return response()->json([
            'message' => 'Item not found in cart'
        ], 404);
    }

    /**
     * Clear the entire cart
     */
    public function clear()
    {
        $cart = $this->getOrCreateCart();
        
        CartItem::where('cart_id', $cart->id)->delete();
        
        return response()->json([
            'message' => 'Cart cleared',
            'total_items' => 0,
            'total_price' => 0
        ]);
    }
    
    /**
     * Get existing cart or create a new one for the authenticated user
     */
    private function getOrCreateCart()
    {
        return Cart::firstOrCreate([
            'user_id' => Auth::id()
        ]);
    }
}

