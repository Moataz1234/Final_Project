// Updated HomePage.jsx with debounced search
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { Search } from 'lucide-react';
import useProductStore from '../store/productStore';
import ProductCard from '../components/Products/ProductCard/ProductCard';
import LoadingSpinner from '../components/UI/LoadingSpinner/LoadingSpinner';
import './HomePage.css';

// Debounce function
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const HomePage = () => {
  const { 
    products, 
    loading, 
    error, 
    fetchProducts, 
    categories,
    fetchCategories 
  } = useProductStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  
  // Use debounced values for search
  const debouncedSearch = useDebounce(searchTerm, 500);
  const debouncedCategory = useDebounce(selectedCategory, 500);
  const debouncedPriceMin = useDebounce(priceRange.min, 500);
  const debouncedPriceMax = useDebounce(priceRange.max, 500);

  // Initial data fetch
  useEffect(() => {
    fetchCategories();
    
    // Load initial products without filters
    fetchProducts({ 
      featured: true
    });
  }, []);
  
  // Only fetch when debounced values change
  useEffect(() => {
    if (debouncedSearch !== '' || debouncedCategory !== '' || debouncedPriceMin !== '' || debouncedPriceMax !== '') {
      fetchProducts({
        featured: true,
        search: debouncedSearch,
        category: debouncedCategory,
        min_price: debouncedPriceMin,
        max_price: debouncedPriceMax
      });
    }
  }, [debouncedSearch, debouncedCategory, debouncedPriceMin, debouncedPriceMax]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({ ...prev, [name]: value }));
  };

  // Custom loading component with bouncing logo
  if (loading) {
    return <LoadingSpinner text="Loading amazing products for you..." />;
  }
  
  if (error) return (
    <div className="error-container">
      <h3>Error Loading Products</h3>
      <p>{error}</p>
      <button 
        className="retry-button"
        onClick={() => fetchProducts({ featured: true })}
      >
        Try Again
      </button>
    </div>
  );

  return (
    <Container className="mt-4 home-container">
      <Row className="mb-4">
        <Col md={4}>
          <InputGroup className="search-group">
            <InputGroup.Text><Search size={20} /></InputGroup.Text>
            <Form.Control
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select 
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="category-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={4}>
          <InputGroup className="price-group">
            <Form.Control
              type="number"
              placeholder="Min Price"
              name="min"
              value={priceRange.min}
              onChange={handlePriceChange}
            />
            <Form.Control
              type="number"
              placeholder="Max Price"
              name="max"
              value={priceRange.max}
              onChange={handlePriceChange}
            />
          </InputGroup>
        </Col>
      </Row>

      <h2 className="text-center mb-4 section-title">Featured Products</h2>
      
      {products.length === 0 ? (
        <div className="no-products">
          <h3>No products found</h3>
          <p>Try adjusting your filters or check back later for new items.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </Container>
  );
};

export default HomePage;