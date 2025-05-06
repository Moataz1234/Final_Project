<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the user's orders
     */
    public function index()
    {
        $orders = Order::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($orders);
    }
    
    /**
     * Get detailed order information
     */
    public function show($id)
    {
        $order = Order::where('user_id', Auth::id())
            ->where('id', $id)
            ->with('items.product')
            ->firstOrFail();
            
        return response()->json($order);
    }
    
    /**
     * Create a new order from the user's cart
     */
    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|string',
            'billing_address' => 'string|nullable',
            'payment_method' => 'required|string',
            'notes' => 'string|nullable',
        ]);
        
        // Get the user's cart
        $cart = Cart::where('user_id', Auth::id())->with('items.product')->first();
        
        if (!$cart || $cart->items->isEmpty()) {
            return response()->json([
                'message' => 'Your cart is empty'
            ], 400);
        }
        
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            // Calculate totals
            $subtotal = 0;
            foreach ($cart->items as $item) {
                $subtotal += $item->price * $item->quantity;
            }
            
            // Add tax and shipping (can be adjusted based on your business logic)
            $taxRate = 0.05; // 5% tax
            $taxAmount = $subtotal * $taxRate;
            $shippingCost = 10.00; // Flat rate
            $totalAmount = $subtotal + $taxAmount + $shippingCost;
            
            // Create the order
            $order = Order::create([
                'user_id' => Auth::id(),
                'order_number' => Order::generateOrderNumber(),
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'payment_method' => $request->payment_method,
                'payment_status' => 'pending',
                'shipping_address' => $request->shipping_address,
                'billing_address' => $request->billing_address ?? $request->shipping_address,
                'notes' => $request->notes,
                'shipping_cost' => $shippingCost,
                'tax_amount' => $taxAmount
            ]);
            
            // Create order items from cart items
            foreach ($cart->items as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'product_name' => $cartItem->product->name,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->price,
                    'subtotal' => $cartItem->price * $cartItem->quantity
                ]);
            }
            
            // Clear the cart
            CartItem::where('cart_id', $cart->id)->delete();
            
            // Commit transaction
            DB::commit();
            
            return response()->json([
                'message' => 'Order placed successfully',
                'order' => $order->load('items')
            ], 201);
            
        } catch (\Exception $e) {
            // Rollback transaction on error
            DB::rollBack();
            
            return response()->json([
                'message' => 'Failed to place order',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Cancel an order (if it's still in pending status)
     */
    public function cancel($id)
    {
        $order = Order::where('user_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();
            
        if ($order->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending orders can be cancelled'
            ], 400);
        }
        
        $order->status = 'cancelled';
        $order->save();
        
        return response()->json([
            'message' => 'Order cancelled successfully',
            'order' => $order
        ]);
    }
}