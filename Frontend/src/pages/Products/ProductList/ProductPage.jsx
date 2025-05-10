// src/pages/Products/ProductsPage.jsx
import React, { useEffect, useState } from 'react';
import { Form, Button, InputGroup, Badge } from 'react-bootstrap';
import { Search, Filter, Star, TrendingUp, TrendingDown, SortAsc, CheckCircle, Sparkles } from 'lucide-react';
import ProductList from '../../../components/Products/ProductList/ProductList';
import useProductStore from '../../../store/productStore';
import Pagination from '../../../components/UI/Pagination/Pagination'; 
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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // For scent and suitable for options - these should match your database values
  const scentTypes = ['Fresh', 'Floral', 'Woody', 'Citrus', 'Herbal', 'Fruity'];
  const suitableForOptions = ['All Skin Types', 'Dry Skin', 'Oily Skin', 'Sensitive Skin', 'Combination Skin'];
  
  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilter({ search: searchInput });
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchInput, filters.search, setFilter]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    // Convert empty string to empty string (not 0)
    const numValue = value === '' ? '' : value;
    setFilter({ [name]: numValue });
  };
  
  const handleRatingChange = (e) => {
    const value = e.target.value;
    setFilter({ rating: value });
  };
  
  const handleSortChange = (e) => {
    const value = e.target.value;
    console.log('Sort changed to:', value); // Debug log
    console.log('Current filters before sort:', filters); // Debug current state
    setFilter({ sort: value });
    console.log('Sort set, this should trigger fetchProducts'); // Debug
  };
  
  const handleOnSaleChange = (e) => {
    const checked = e.target.checked;
    setFilter({ is_on_sale: checked ? '1' : '' });
  };
  
  const handleResetFilters = () => {
    resetFilters();
    setSearchInput('');
  };

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.min_price) count++;
    if (filters.max_price) count++;
    if (filters.rating) count++;
    if (filters.scent_type) count++;
    if (filters.suitable_for) count++;
    if (filters.is_on_sale === '1') count++;
    return count;
  };

  return (
    <div className="product-page-container">
      <aside className="product-page-sidebar">
        <div className="filter-header">
          <h3 className="filter-main-title">
            <Filter size={20} /> Filters
          </h3>
          {getActiveFilterCount() > 0 && (
            <Badge bg="primary" pill>{getActiveFilterCount()}</Badge>
          )}
        </div>

        <div className="filter-section">
          <h4 className="filter-title">Categories</h4>
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
          <h4 className="filter-title">Price Range</h4>
          <div className="price-inputs">
            <Form.Control 
              type="number" 
              placeholder="Min Price"
              name="min_price"
              value={filters.min_price}
              onChange={handlePriceChange}
              className="price-input"
              min="0"
              step="0.01"
            />
            <Form.Control 
              type="number" 
              placeholder="Max Price"
              name="max_price"
              value={filters.max_price}
              onChange={handlePriceChange}
              className="price-input"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="filter-section">
          <h4 className="filter-title">Rating</h4>
          <Form.Select 
            value={filters.rating}
            onChange={handleRatingChange}
            className="filter-select"
          >
            <option value="">All Ratings</option>
            <option value="4">⭐⭐⭐⭐ & Up</option>
            <option value="3">⭐⭐⭐ & Up</option>
            <option value="2">⭐⭐ & Up</option>
            <option value="1">⭐ & Up</option>
          </Form.Select>
        </div>

        <Button 
          variant="outline-secondary" 
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="toggle-advanced-filters"
          size="sm"
        >
          {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
        </Button>

        {showAdvancedFilters && (
          <>
            <div className="filter-section">
              <h4 className="filter-title">Scent Type</h4>
              <Form.Select 
                value={filters.scent_type}
                onChange={(e) => setFilter({ scent_type: e.target.value })}
                className="filter-select"
              >
                <option value="">All Scents</option>
                {scentTypes.map(scent => (
                  <option key={scent} value={scent}>
                    {scent}
                  </option>
                ))}
              </Form.Select>
            </div>

            <div className="filter-section">
              <h4 className="filter-title">Suitable For</h4>
              <Form.Select 
                value={filters.suitable_for}
                onChange={(e) => setFilter({ suitable_for: e.target.value })}
                className="filter-select"
              >
                <option value="">All Types</option>
                {suitableForOptions.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
            </div>

            <div className="filter-section">
              <Form.Check 
                type="switch"
                id="on-sale-switch"
                label="On Sale Only"
                checked={filters.is_on_sale === '1'}
                onChange={handleOnSaleChange}
                className="sale-filter-switch"
              />
            </div>
          </>
        )}

        <Button 
          variant="outline-primary" 
          onClick={handleResetFilters}
          className="reset-filters-btn"
          disabled={loading || getActiveFilterCount() === 0}
        >
          Reset Filters
        </Button>
      </aside>

      <main className="product-page-content">
        <div className="products-header">
          <div className="search-and-sort">
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

            <div className="sort-container">
              <Form.Select 
                value={filters.sort}
                onChange={handleSortChange}
                className="sort-select"
              >
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="price_asc">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
                <option value="rating_desc">Best Rated</option>
                <option value="rating_asc">Lowest Rated</option>
                <option value="newest">Newest First</option>
              </Form.Select>
            </div>
          </div>

          {filters.is_on_sale === '1' && (
            <div className="active-filters">
              <Badge bg="danger" className="sale-badge">
                <Sparkles size={14} /> Showing Sale Items Only
              </Badge>
            </div>
          )}
        </div>

        <ProductList />
      </main>
    </div>
  );
};

export default ProductsPage;