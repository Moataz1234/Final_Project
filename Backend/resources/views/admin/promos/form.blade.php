@extends('layouts.admin')

@section('content')
<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3">{{ isset($promo) ? 'Edit Promo Code' : 'Create Promo Code' }}</h1>
        <a href="{{ route('admin.promos.index') }}" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i> Back to Promo Codes
        </a>
    </div>

    <div class="card">
        <div class="card-body">
            <form action="{{ isset($promo) ? route('admin.promos.update', $promo) : route('admin.promos.store') }}" method="POST">
                @csrf
                @if(isset($promo))
                    @method('PUT')
                @endif

                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="code" class="form-label">Promo Code</label>
                            <input type="text" class="form-control @error('code') is-invalid @enderror" id="code" name="code" value="{{ old('code', $promo->code ?? '') }}" required>
                            @error('code')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="description" class="form-label">Description</label>
                            <textarea class="form-control @error('description') is-invalid @enderror" id="description" name="description" rows="3">{{ old('description', $promo->description ?? '') }}</textarea>
                            @error('description')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="discount_percentage" class="form-label">Discount Percentage</label>
                            <input type="number" class="form-control @error('discount_percentage') is-invalid @enderror" id="discount_percentage" name="discount_percentage" min="1" max="100" value="{{ old('discount_percentage', $promo->discount_percentage ?? '') }}" required>
                            @error('discount_percentage')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="minimum_order_amount" class="form-label">Minimum Order Amount</label>
                            <input type="number" class="form-control @error('minimum_order_amount') is-invalid @enderror" id="minimum_order_amount" name="minimum_order_amount" min="0" step="0.01" value="{{ old('minimum_order_amount', $promo->minimum_order_amount ?? '') }}">
                            @error('minimum_order_amount')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="max_uses" class="form-label">Maximum Uses</label>
                            <input type="number" class="form-control @error('max_uses') is-invalid @enderror" id="max_uses" name="max_uses" min="1" value="{{ old('max_uses', $promo->max_uses ?? '') }}">
                            @error('max_uses')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="starts_at" class="form-label">Start Date</label>
                                    <input type="date" class="form-control @error('starts_at') is-invalid @enderror" id="starts_at" name="starts_at" value="{{ old('starts_at', isset($promo) ? $promo->starts_at->format('Y-m-d') : '') }}">
                                    @error('starts_at')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="expires_at" class="form-label">Expiry Date</label>
                                    <input type="date" class="form-control @error('expires_at') is-invalid @enderror" id="expires_at" name="expires_at" value="{{ old('expires_at', isset($promo) ? $promo->expires_at->format('Y-m-d') : '') }}">
                                    @error('expires_at')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input @error('is_active') is-invalid @enderror" id="is_active" name="is_active" value="1" {{ old('is_active', $promo->is_active ?? true) ? 'checked' : '' }}>
                                <label class="form-check-label" for="is_active">Active</label>
                                @error('is_active')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>

                        <div class="mb-3">
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input @error('is_first_order_only') is-invalid @enderror" id="is_first_order_only" name="is_first_order_only" value="1" {{ old('is_first_order_only', $promo->is_first_order_only ?? false) ? 'checked' : '' }}>
                                <label class="form-check-label" for="is_first_order_only">First Order Only</label>
                                @error('is_first_order_only')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-end">
                    <button type="submit" class="btn btn-primary">
                        {{ isset($promo) ? 'Update Promo Code' : 'Create Promo Code' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection 