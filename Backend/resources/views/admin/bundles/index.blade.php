@extends('layouts.admin')

@section('content')
<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3">Product Bundles</h1>
        <a href="{{ route('admin.bundles.create') }}" class="btn btn-primary">
            <i class="fas fa-plus"></i> Create New Bundle
        </a>
    </div>

    <div class="card">
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Discount</th>
                            <th>Products</th>
                            <th>Status</th>
                            <th>Validity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($bundles as $bundle)
                        <tr>
                            <td><strong>{{ $bundle->name }}</strong></td>
                            <td>{{ Str::limit($bundle->description, 50) }}</td>
                            <td>{{ $bundle->discount_percentage }}%</td>
                            <td>{{ $bundle->products->count() }} products</td>
                            <td>
                                <span class="badge bg-{{ $bundle->is_active ? 'success' : 'danger' }}">
                                    {{ $bundle->is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                            <td>
                                @if($bundle->starts_at && $bundle->expires_at)
                                    {{ $bundle->starts_at->format('M d, Y') }} - {{ $bundle->expires_at->format('M d, Y') }}
                                @else
                                    Always
                                @endif
                            </td>
                            <td>
                                <a href="{{ route('admin.bundles.edit', $bundle) }}" class="btn btn-sm btn-info">
                                    <i class="fas fa-edit"></i> Edit
                                </a>
                                <form action="{{ route('admin.bundles.destroy', $bundle) }}" method="POST" class="d-inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure you want to delete this bundle?')">
                                        <i class="fas fa-trash"></i> Delete
                                    </button>
                                </form>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <div class="mt-4">
                {{ $bundles->links() }}
            </div>
        </div>
    </div>
</div>
@endsection 