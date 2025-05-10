@extends('layouts.admin')

@section('content')
<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3">{{ isset($bundle) ? 'Edit Bundle' : 'Create Bundle' }}</h1>
        <a href="{{ route('admin.bundles.index') }}" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i> Back to Bundles
        </a>
    </div>

    <div class="card">
        <div class="card-body">
            <form action="{{ isset($bundle) ? route('admin.bundles.update', $bundle) : route('admin.bundles.store') }}" method="POST">
                @csrf
                @if(isset($bundle))
                    @method('PUT')
                @endif

                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="name" class="form-label">Bundle Name</label>
                            <input type="text" class="form-control @error('name') is-invalid @enderror" id="name" name="name" value="{{ old('name', $bundle->name ?? '') }}" required>
                            @error('name')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="description" class="form-label">Description</label>
                            <textarea class="form-control @error('description') is-invalid @enderror" id="description" name="description" rows="3">{{ old('description', $bundle->description ?? '') }}</textarea>
                            @error('description')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="discount_percentage" class="form-label">Discount Percentage</label>
                            <input type="number" class="form-control @error('discount_percentage') is-invalid @enderror" id="discount_percentage" name="discount_percentage" min="1" max="100" value="{{ old('discount_percentage', $bundle->discount_percentage ?? '') }}" required>
                            @error('discount_percentage')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="starts_at" class="form-label">Start Date</label>
                                    <input type="date" class="form-control @error('starts_at') is-invalid @enderror" id="starts_at" name="starts_at" value="{{ old('starts_at', isset($bundle) ? $bundle->starts_at->format('Y-m-d') : '') }}">
                                    @error('starts_at')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="expires_at" class="form-label">Expiry Date</label>
                                    <input type="date" class="form-control @error('expires_at') is-invalid @enderror" id="expires_at" name="expires_at" value="{{ old('expires_at', isset($bundle) ? $bundle->expires_at->format('Y-m-d') : '') }}">
                                    @error('expires_at')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input @error('is_active') is-invalid @enderror" id="is_active" name="is_active" value="1" {{ old('is_active', $bundle->is_active ?? true) ? 'checked' : '' }}>
                                <label class="form-check-label" for="is_active">Active</label>
                                @error('is_active')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Products</label>
                            <select class="form-select @error('products') is-invalid @enderror" name="products[]" multiple required>
                                @foreach($products as $product)
                                    <option value="{{ $product->id }}" {{ in_array($product->id, old('products', $selectedProducts ?? [])) ? 'selected' : '' }}>
                                        {{ $product->name }} - ${{ number_format($product->price, 2) }}
                                    </option>
                                @endforeach
                            </select>
                            <div class="form-text">Hold Ctrl (Windows) or Command (Mac) to select multiple products</div>
                            @error('products')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>
                </div>

                <div class="text-end">
                    <button type="submit" class="btn btn-primary">
                        {{ isset($bundle) ? 'Update Bundle' : 'Create Bundle' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection 