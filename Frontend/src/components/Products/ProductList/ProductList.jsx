// src/components/Products/ProductList.jsx
import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import LoadingSpinner from '../../UI/LoadingSpinner/LoadingSpinner';
import useProductStore from '../../../store/productStore';
import { Pagination } from 'react-bootstrap';
import styled from 'styled-components';
import './ProductList.css';

const ProductGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  background-color: var(--card-background);
  border-radius: 8px;
  margin: 20px 0;
`;

const StyledPagination = styled(Pagination)`
  justify-content: center;
  margin-top: 30px;
  
  .page-item .page-link {
    background-color: var(--card-background);
    border-color: var(--border-color);
    color: var(--text-color);
  }
  
  .page-item.active .page-link {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
  }
`;

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

  if (loading) return <LoadingSpinner text="Loading products..." />;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="product-list-container">
      {products.length === 0 ? (
        <EmptyState>
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
        </EmptyState>
      ) : (
        <>
          <ProductGridContainer>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGridContainer>
          
          {totalPages > 1 && (
            <StyledPagination>
              {renderPaginationItems()}
            </StyledPagination>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;