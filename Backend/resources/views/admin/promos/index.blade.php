@extends('layouts.admin')

@section('content')
<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3">Promotional Codes</h1>
        <a href="{{ route('admin.promos.create') }}" class="btn btn-primary">
            <i class="fas fa-plus"></i> Create New Promo Code
        </a>
    </div>

    <div class="card">
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Description</th>
                            <th>Discount</th>
                            <th>Min. Order</th>
                            <th>Max Uses</th>
                            <th>Status</th>
                            <th>Validity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($promos as $promo)
                        <tr>
                            <td><strong>{{ $promo->code }}</strong></td>
                            <td>{{ $promo->description }}</td>
                            <td>{{ $promo->discount_percentage }}%</td>
                            <td>{{ $promo->minimum_order_amount ? '$' . number_format($promo->minimum_order_amount, 2) : 'N/A' }}</td>
                            <td>{{ $promo->max_uses ?? 'Unlimited' }}</td>
                            <td>
                                <span class="badge bg-{{ $promo->is_active ? 'success' : 'danger' }}">
                                    {{ $promo->is_active ? 'Active' : 'Inactive' }}
                                </span>
                            </td>
                            <td>
                                @if($promo->starts_at && $promo->expires_at)
                                    {{ $promo->starts_at->format('M d, Y') }} - {{ $promo->expires_at->format('M d, Y') }}
                                @else
                                    Always
                                @endif
                            </td>
                            <td>
                                <a href="{{ route('admin.promos.edit', $promo) }}" class="btn btn-sm btn-info">
                                    <i class="fas fa-edit"></i> Edit
                                </a>
                                <form action="{{ route('admin.promos.destroy', $promo) }}" method="POST" class="d-inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure you want to delete this promo code?')">
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
                {{ $promos->links() }}
            </div>
        </div>
    </div>
</div>
@endsection 