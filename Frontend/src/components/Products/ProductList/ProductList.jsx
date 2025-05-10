// src/components/Products/ProductList/ProductList.jsx
import React from 'react';
import { Container, Row, Spinner, Alert } from 'react-bootstrap';
import { Package } from 'lucide-react';
import ProductCard from '../ProductCard/ProductCard';
import Pagination from '../../UI/Pagination/Pagination';
import useProductStore from '../../../store/productStore';
import './ProductList.css';

const ProductList = () => {
  const { 
    products, 
    loading, 
    error,
    filters,
    totalPages,
    setFilter 
  } = useProductStore();

  // Handle page change
  const handlePageChange = (page) => {
    setFilter({ page });
    // Scroll to top of product list
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="product-list-loading">
        <Spinner animation="border" role="status" size="lg" />
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        <Alert.Heading>Error loading products</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="product-list-empty">
        <Package size={48} className="empty-icon" />
        <h3>No products found</h3>
        <p>Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <div className="product-count">
          <Package size={20} />
          <span>{products.length} products found</span>
        </div>
      </div>

      <Row className="g-4 product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Row>

      {totalPages > 1 && (
        <Pagination
          currentPage={filters.page || 1}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          siblingCount={1}
          showFirst={true}
          showLast={true}
        />
      )}
    </div>
  );
};

export default ProductList;