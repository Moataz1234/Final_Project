// src/pages/Products/ProductsPage.jsx
import React, { useEffect, useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Search } from 'lucide-react';
import ProductList from '../../../components/Products/ProductList/ProductList';
import useProductStore from '../../../store/productStore';
import './ProductPage.css';

const ProductsPage = () => {
  const { 
    categories, 
    filters, 
    setFilter, 
    resetFilters, 
    fetchProducts, 
    fetchCategories,
    loading
  } = useProductStore();
  
  // Local state to prevent search on every keystroke
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search || '');
  
  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);
  
  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters]);
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchInput]);
  
  // Apply search filter when debounced value changes
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilter({ search: debouncedSearch });
    }
  }, [debouncedSearch]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const filterName = name === 'min' ? 'minPrice' : 'maxPrice';
    setFilter({ [filterName]: value });
  };
  
  const handleResetFilters = () => {
    resetFilters();
    setSearchInput('');
  };

  return (
    <div className="product-page-container">
      <aside className="product-page-sidebar">
        <div className="filter-section">
          <h3 className="filter-title">Categories</h3>
          <Form.Select 
            value={filters.category}
            onChange={(e) => setFilter({ category: e.target.value })}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="filter-section">
          <h3 className="filter-title">Price Range</h3>
          <div className="price-inputs">
            <Form.Control 
              type="number" 
              placeholder="Min Price"
              name="min"
              value={filters.minPrice}
              onChange={handlePriceChange}
              className="price-input"
            />
            <Form.Control 
              type="number" 
              placeholder="Max Price"
              name="max"
              value={filters.maxPrice}
              onChange={handlePriceChange}
              className="price-input"
            />
          </div>
        </div>

        <Button 
          variant="outline-primary" 
          onClick={handleResetFilters}
          className="reset-filters-btn"
          disabled={loading}
        >
          Reset Filters
        </Button>
      </aside>

      <main className="product-page-content">
        <div className="search-container">
          <InputGroup>
            <InputGroup.Text><Search size={18} /></InputGroup.Text>
            <Form.Control
              placeholder="Search products..."
              value={searchInput}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </div>
        <ProductList />
      </main>
    </div>
  );
};

export default ProductsPage;