// src/components/Products/ProductList/ProductList.jsx
import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import useProductStore from '../../../store/productStore';
import { Pagination } from 'react-bootstrap';
import './ProductList.css';

const ProductList = () => {
  const { 
    products, 
    loading, 
    error, 
    filters, 
    setFilter, 
    fetchProducts, 
    totalPages 
  } = useProductStore();

  const handlePageChange = (page) => {
    setFilter({ page });
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const currentPage = filters.page;
    
    // Previous button
    items.push(
      <Pagination.Prev 
        key="prev" 
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      />
    );

    // Always show first page
    items.push(
      <Pagination.Item 
        key={1} 
        active={currentPage === 1}
        onClick={() => handlePageChange(1)}
      >
        1
      </Pagination.Item>
    );

    // Add ellipsis if needed
    if (currentPage > 3) {
      items.push(<Pagination.Ellipsis key="ellipsis1" />);
    }

    // Add pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i > 1 && i < totalPages) {
        items.push(
          <Pagination.Item 
            key={i} 
            active={currentPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    }

    // Add ellipsis if needed
    if (currentPage < totalPages - 2 && totalPages > 3) {
      items.push(<Pagination.Ellipsis key="ellipsis2" />);
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <Pagination.Item 
          key={totalPages} 
          active={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    // Next button
    items.push(
      <Pagination.Next 
        key="next" 
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      />
    );

    return items;
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="product-list-container">
      {products.length === 0 ? (
        <div className="no-products">
          <h3>No products found</h3>
          <p>Try changing your search criteria or browse all products.</p>
          <button 
            className="reset-button"
            onClick={() => {
              fetchProducts({ reset: true });
            }}
          >
            View All Products
          </button>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="pagination-container">
              <Pagination>{renderPaginationItems()}</Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;