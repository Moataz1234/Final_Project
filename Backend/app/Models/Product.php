<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'category_id',
        'image_url',
        'stock',
        'is_featured',
        'ingredients',
        'usage_instructions',
        'suitable_for',
        'weight',
        'scent_type',
        'is_on_sale',
        'sale_price',
        'sale_percentage',
        'sale_starts_at',
        'sale_ends_at',
        'average_rating',
        'total_reviews'
    ];

    protected $casts = [
        'price' => 'float',
        'is_featured' => 'boolean',
        'is_on_sale' => 'boolean',
        'sale_price' => 'float',
        'sale_percentage' => 'integer',
        'sale_starts_at' => 'datetime',
        'sale_ends_at' => 'datetime',
        'average_rating' => 'float',
        'total_reviews' => 'integer'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews()
    {
        return $this->hasMany(ProductReview::class);
    }

    public function bundles()
    {
        return $this->belongsToMany(Bundle::class)->withPivot('quantity');
    }

    // Scope for advanced filtering and sorting
    public function scopeAdvancedFilter($query, $filters)
    {
        if (isset($filters['category'])) {
            $query->whereHas('category', function($q) use ($filters) {
                $q->where('slug', $filters['category']);
            });
        }
        if (isset($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }
        if (isset($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }
        if (isset($filters['search'])) {
            $query->where(function($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }
        if (isset($filters['rating'])) {
            $query->where('average_rating', '>=', $filters['rating']);
        }
        // Sorting
        if (isset($filters['sort'])) {
            switch ($filters['sort']) {
                case 'name_asc':
                    $query->orderBy('name', 'asc');
                    break;
                case 'name_desc':
                    $query->orderBy('name', 'desc');
                    break;
                case 'price_asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('price', 'desc');
                    break;
                case 'rating_desc':
                    $query->orderBy('average_rating', 'desc');
                    break;
                case 'rating_asc':
                    $query->orderBy('average_rating', 'asc');
                    break;
                case 'newest':
                    $query->orderBy('created_at', 'desc');
                    break;
                default:
                    $query->orderBy('name', 'asc');
            }
        }
        return $query;
    }
}