<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AdminProductController;
use App\Http\Controllers\Api\AdminCategoryController;
use App\Http\Controllers\Api\PromoCodeController;
use App\Http\Controllers\Api\BundleController;
use App\Http\Controllers\Api\ProductReviewController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/categories', [ProductController::class, 'getCategories']);
Route::get('/bundles', [BundleController::class, 'index']);
Route::get('/promocodes', [PromoCodeController::class, 'index']);
Route::get('/reviews', [ProductReviewController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user/profile', [AuthController::class, 'profile']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    
    // Cart routes
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'addItem']);
    Route::put('/cart/{id}', [CartController::class, 'updateItem']);
    Route::delete('/cart/{id}', [CartController::class, 'removeItem']);
    Route::delete('/cart', [CartController::class, 'clear']);
    
    // Wishlist routes
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{productId}', [WishlistController::class, 'destroy']);
    Route::delete('/wishlist', [WishlistController::class, 'clear']);
    
    // Order routes
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']);

    // Product reviews (user)
    Route::post('/reviews', [ProductReviewController::class, 'store']);
});

// Admin routes (add 'admin' middleware as needed)
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Product CRUD
    Route::post('/admin/products', [AdminProductController::class, 'store']);
    Route::put('/admin/products/{id}', [AdminProductController::class, 'update']);
    Route::delete('/admin/products/{id}', [AdminProductController::class, 'destroy']);

    // Category CRUD
    Route::post('/admin/categories', [AdminCategoryController::class, 'store']);
    Route::put('/admin/categories/{id}', [AdminCategoryController::class, 'update']);
    Route::delete('/admin/categories/{id}', [AdminCategoryController::class, 'destroy']);

    // Promo code CRUD
    Route::apiResource('/admin/promocodes', PromoCodeController::class)->except(['show']);

    // Bundle CRUD
    Route::apiResource('/admin/bundles', BundleController::class)->except(['show']);

    // Product review moderation
    Route::get('/admin/reviews', [ProductReviewController::class, 'index']);
    Route::put('/admin/reviews/{id}', [ProductReviewController::class, 'update']);
    Route::delete('/admin/reviews/{id}', [ProductReviewController::class, 'destroy']);
    Route::post('/admin/reviews/{id}/approve', [ProductReviewController::class, 'approve']);
});