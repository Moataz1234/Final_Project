<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_number',
        'total_amount',
        'status',
        'payment_method',
        'payment_status',
        'shipping_address',
        'billing_address',
        'notes',
        'shipping_cost',
        'tax_amount'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Generate a unique order number
    public static function generateOrderNumber()
    {
        $latest = self::latest()->first();
        $nextId = $latest ? $latest->id + 1 : 1;
        
        return 'ORD-' . date('Ymd') . '-' . str_pad($nextId, 6, '0', STR_PAD_LEFT);
    }
}
