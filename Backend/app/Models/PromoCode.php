<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PromoCode extends Model
{
    protected $fillable = [
        'code',
        'description',
        'discount_percentage',
        'minimum_order_amount',
        'max_uses',
        'used_count',
        'is_active',
        'starts_at',
        'expires_at',
        'is_first_order_only'
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
        'is_first_order_only' => 'boolean',
        'minimum_order_amount' => 'decimal:2',
        'discount_percentage' => 'integer',
        'max_uses' => 'integer',
        'used_count' => 'integer'
    ];

    public function isValid()
    {
        return $this->is_active &&
            now()->between($this->starts_at, $this->expires_at) &&
            (!$this->max_uses || $this->used_count < $this->max_uses);
    }
} 