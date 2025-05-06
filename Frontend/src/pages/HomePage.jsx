// Updated HomePage.jsx with debounced search
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useProductStore from '../store/productStore';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import { ShoppingCart, Heart, Search } from 'lucide-react';
import styled from 'styled-components';
import './HomePage.css';

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

// Bouncing logo component for loading state
const BouncingLogo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  height: 50vh;
  
  img {
    width: 150px;
    height: auto;
    animation: bounce 1s infinite alternate ease-in-out;
  }
  
  p {
    margin-top: 20px;
    color: var(--primary-color);
    font-size: 18px;
  }
  
  @keyframes bounce {
    from {
      transform: translateY(0px);
    }
    to {
      transform: translateY(-20px);
    }
  }
`;

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
  
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

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

  // Function to handle adding to cart
  const handleAddToCart = (product) => {
    addToCart(product, 1);
    // You can add a toast notification here
    console.log('Added to cart:', product.name);
  };

  // Function to handle wishlist toggle
  const handleToggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Helper function to safely format price
  const formatPrice = (price) => {
    // Convert to number if it's a string
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // Check if it's a valid number
    return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
  };

  // Custom loading component with bouncing logo
  if (loading) return (
    <BouncingLogo>
      <img src="/assets/meemiis.png" alt="Loading..." />
      <p>Loading amazing products for you...</p>
    </BouncingLogo>
  );
  
  if (error) return (
    <div className="error-container">
      <h3>Error Loading Products</h3>
      <p>{error}</p>
      <Button 
        variant="primary" 
        onClick={() => fetchProducts({ featured: true })}
      >
        Try Again
      </Button>
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
        <ProductGrid>
          {products.map(product => (
            <Card key={product.id} className="product-card h-100">
              <Link to={`/products/${product.id}`} className="product-link">
                <Card.Img 
                  variant="top" 
                  src={product.image_url || '/assets/placeholder.jpg'} 
                  className="product-image"
                />
              </Link>
              <Card.Body className="d-flex flex-column">
                <Link to={`/products/${product.id}`} className="product-title-link">
                  <Card.Title>{product.name}</Card.Title>
                </Link>
                <Card.Text className="product-description">
                  {product.description && product.description.length > 100 
                    ? `${product.description.substring(0, 100)}...` 
                    : product.description}
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center mt-auto">
                  <h5 className="product-price mb-0">${formatPrice(product.price)}</h5>
                  <div className="product-actions">
                    <Button 
                      variant={isInWishlist(product.id) ? "danger" : "outline-secondary"} 
                      className="me-2 wishlist-btn"
                      onClick={() => handleToggleWishlist(product)}
                    >
                      <Heart size={18} />
                    </Button>
                    <Button 
                      variant="primary"
                      className="cart-btn"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart size={18} /> Add
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </ProductGrid>
      )}
    </Container>
  );
};

export default HomePage;