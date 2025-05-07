// src/pages/Wishlist/WishlistPage.jsx
import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Heart, ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useWishlistStore from '../../store/wishlistStore';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import './WishlistPage.css';

const WishlistPage = () => {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login?redirect=/wishlist');
    }
  }, [isAuthenticated, navigate]);

  // Function to safely format price
  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    // Optional: Show a success toast notification
    console.log('Added to cart:', product.name);
  };

  const handleRemoveFromWishlist = (productId, productName) => {
    removeItem(productId);
    // Optional: Show a success toast notification
    console.log('Removed from wishlist:', productName);
  };

  // If not authenticated, don't render anything (will redirect via useEffect)
  if (!isAuthenticated) {
    return null;
  }

  if (items.length === 0) {
    return (
      <Container className="wishlist-empty-container">
        <div className="wishlist-empty">
          <Heart size={64} />
          <h2>Your wishlist is empty</h2>
          <p>You haven't added any products to your wishlist yet.</p>
          <Link to="/products">
            <Button variant="primary" className="browse-products-btn">
              <ArrowLeft size={18} /> Browse Products
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="wishlist-page-container">
      <div className="wishlist-header">
        <h1 className="wishlist-title">My Wishlist ({items.length} {items.length === 1 ? 'item' : 'items'})</h1>
        <Button 
          variant="outline-danger" 
          onClick={clearWishlist}
          className="clear-wishlist-btn"
        >
          <Trash2 size={16} className="me-1" /> Clear Wishlist
        </Button>
      </div>

      <Row>
        {items.map(product => (
          <Col key={product.id} lg={3} md={4} sm={6} xs={12} className="mb-4">
            <Card className="wishlist-card">
              <div className="wishlist-card-image-container">
                <Link to={`/products/${product.id}`}>
                  <Card.Img 
                    variant="top" 
                    src={product.image_url || 'https://via.placeholder.com/300x300'} 
                    alt={product.name}
                    className="wishlist-card-image"
                  />
                </Link>
                <Button 
                  variant="light" 
                  className="remove-wishlist-btn"
                  onClick={() => handleRemoveFromWishlist(product.id, product.name)}
                  aria-label="Remove from wishlist"
                >
                  <Heart size={18} fill="#dc3545" />
                </Button>
              </div>
              <Card.Body>
                <Link to={`/products/${product.id}`} className="wishlist-card-title-link">
                  <Card.Title className="wishlist-card-title">{product.name}</Card.Title>
                </Link>
                <Card.Text className="wishlist-card-description">
                  {product.description && product.description.length > 70 
                    ? `${product.description.substring(0, 70)}...` 
                    : product.description || 'No description available'}
                </Card.Text>
                <div className="wishlist-card-footer">
                  <span className="wishlist-card-price">${formatPrice(product.price)}</span>
                  <Button 
                    variant="primary" 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      <div className="wishlist-footer">
        <Link to="/products">
          <Button variant="outline-primary" className="continue-shopping-btn">
            <ArrowLeft size={18} /> Continue Shopping
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default WishlistPage;