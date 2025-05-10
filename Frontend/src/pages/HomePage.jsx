// Updated HomePage.jsx with debounced search
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
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
    fetchCategories,
    featuredProducts,
    fetchFeaturedProducts
  } = useProductStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  
  // Use debounced values for search
  const debouncedSearch = useDebounce(searchTerm, 500);
  const debouncedCategory = useDebounce(selectedCategory, 500);
  const debouncedPriceMin = useDebounce(priceRange.min, 500);
  const debouncedPriceMax = useDebounce(priceRange.max, 500);

  // Initial data fetch once on component mount
  useEffect(() => {
    // Fetch categories for filters (if needed)
    fetchCategories();
    
    // Fetch a limited set of featured products for homepage
    fetchFeaturedProducts(8); // Fetch only 8 featured products for the homepage
  }, [fetchCategories, fetchFeaturedProducts]);

  // Show a subset of products or loading state
  const displayProducts = featuredProducts || [];

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
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to MEEMII'S</h1>
          <p>Discover unique products that bring joy to your everyday life</p>
          <Link to="/products">
            <Button variant="primary" size="lg" className="hero-button">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <Container className="featured-products-section">
        <h2 className="section-title text-center">Featured Products</h2>
        
        {error ? (
          <div className="text-center my-5">
            <p className="text-danger">{error}</p>
            <Button 
              variant="outline-primary" 
              onClick={() => fetchFeaturedProducts(8)}
            >
              Retry
            </Button>
          </div>
        ) : (
          <>
            {/* Initial loading state - show skeleton loaders */}
            {loading && displayProducts.length === 0 ? (
              <Row>
                {[...Array(4)].map((_, index) => (
                  <Col key={index} lg={3} md={4} sm={6} className="mb-4">
                    <div className="product-card-skeleton">
                      <div className="skeleton-img"></div>
                      <div className="skeleton-title"></div>
                      <div className="skeleton-price"></div>
                      <div className="skeleton-btn"></div>
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <>
                {displayProducts.length === 0 ? (
                  <div className="text-center my-5">
                    <p>No products found. Check back later!</p>
                  </div>
                ) : (
                  <Row>
                    {displayProducts.map(product => (
                      <Col key={product.id} lg={3} md={4} sm={6} className="mb-4">
                        <ProductCard product={product} />
                      </Col>
                    ))}
                  </Row>
                )}
              </>
            )}

            <div className="text-center mt-4">
              <Link to="/products">
                <Button variant="outline-primary" size="lg">
                  View All Products
                </Button>
              </Link>
            </div>
          </>
        )}
      </Container>

      {/* Categories Showcase Section */}
      <section className="categories-showcase">
        <Container>
          <h2 className="section-title text-center">Shop By Category</h2>
          <div className="category-cards">
            {/* Add 3-4 category cards here */}
            <Link to="/products?category=clothing" className="category-card">
              <div className="category-img clothing-img"></div>
              <h3>Clothing</h3>
            </Link>
            <Link to="/products?category=accessories" className="category-card">
              <div className="category-img accessories-img"></div>
              <h3>Accessories</h3>
            </Link>
            <Link to="/products?category=decor" className="category-card">
              <div className="category-img decor-img"></div>
              <h3>Home Decor</h3>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;