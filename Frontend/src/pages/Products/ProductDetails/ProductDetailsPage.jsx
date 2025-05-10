// src/pages/Products/ProductDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Alert, Tabs, Tab } from 'react-bootstrap';
import { Heart, ShoppingCart, ArrowLeft, Star, Check, AlertCircle, ImageOff } from 'lucide-react';
import useProductStore from '../../../store/productStore';
import useCartStore from '../../../store/cartStore';
import useWishlistStore from '../../../store/wishlistStore';
import useAuthStore from '../../../store/authStore';
import { showSuccessToast, showErrorToast } from '../../../utils/notifications';
import LoadingSpinner from '../../../components/UI/LoadingSpinner/LoadingSpinner';
import ProductCard from '../../../components/Products/ProductCard/ProductCard';
import './ProductDetailsPage.css';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { fetchProductById, currentProduct, loading, error, products, fetchProducts } = useProductStore();
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    fetchProductById(id);
    window.scrollTo(0, 0);
  }, [id, fetchProductById]);
  
  // Fetch related products when currentProduct changes
  useEffect(() => {
    if (currentProduct && currentProduct.category) {
      // Fetch products from the same category
      fetchProducts({ 
        category: currentProduct.category.slug,
        perPage: 4
      }).then(() => {
        // Filter out the current product from related products
        const filtered = products.filter(product => product.id !== parseInt(id));
        // Take up to 4 products
        setRelatedProducts(filtered.slice(0, 4));
      });
    }
  }, [currentProduct, id, fetchProducts, products]);

  // Format full image URL
  const getImageUrl = () => {
    // Check if image_url already has http or https prefix
    if (!currentProduct.image_url) return 'https://via.placeholder.com/600x600';
    
    if (currentProduct.image_url.startsWith('http://') || currentProduct.image_url.startsWith('https://')) {
      return currentProduct.image_url;
    }
    
    // If it's just a path, prepend the API base URL
    return `http://localhost:8000/storage/${currentProduct.image_url}`;
  };
  
  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/products/${id}`);
      return;
    }
    
    if (currentProduct) {
      addToCart(currentProduct, quantity);
      showSuccessToast(`${quantity} ${quantity > 1 ? 'items' : 'item'} of ${currentProduct.name} added to your cart!`);
    }
  };
  
  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/products/${id}`);
      return;
    }
    
    if (currentProduct) {
      if (productInWishlist) {
        removeFromWishlist(currentProduct.id);
        showSuccessToast(`${currentProduct.name} has been removed from your wishlist!`);
      } else {
        addToWishlist(currentProduct);
        showSuccessToast(`${currentProduct.name} has been added to your wishlist!`);
      }
    }
  };
  
  // Check if product is in wishlist
  const productInWishlist = currentProduct ? isInWishlist(currentProduct.id) : false;
  
  // Format price
  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
  };
  
  if (loading && !currentProduct) {
    return <LoadingSpinner text="Loading product details..." />;
  }
  
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <AlertCircle size={18} className="me-2" />
          {error}
        </Alert>
        <Button variant="primary" onClick={() => fetchProductById(id)}>
          Try Again
        </Button>
      </Container>
    );
  }
  
  if (!currentProduct) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Product not found. It may have been removed or is no longer available.
        </Alert>
        <Link to="/products">
          <Button variant="primary">Browse Products</Button>
        </Link>
      </Container>
    );
  }
  
  // Check stock correctly - debug output to console
  console.log('Product stock info:', {
    stock: currentProduct.stock,
    in_stock: currentProduct.in_stock,
    stockType: typeof currentProduct.stock
  });
  
  // Determine if product is in stock
  const productInStock = currentProduct.stock > 0;
  
  return (
    <Container className="product-details-container py-4">
      <Link to="/products" className="back-to-products">
        <ArrowLeft size={16} className="me-1" /> Back to Products
      </Link>
      
      <Row className="mt-4">
        <Col md={6} className="product-image-section">
          <div className="product-main-image">
            {imageError ? (
              <div className="product-detail-fallback">
                <ImageOff size={80} />
                <p>Image not available</p>
              </div>
            ) : (
              <img 
                src={getImageUrl()} 
                alt={currentProduct.name} 
                className="img-fluid rounded"
                onError={handleImageError}
              />
            )}
          </div>
        </Col>
        
        <Col md={6} className="product-info-section">
          <h1 className="product-title">{currentProduct.name}</h1>
          
          {currentProduct.category && (
            <div className="product-category mb-2">
              Category: <Link to={`/products?category=${currentProduct.category.slug}`}>{currentProduct.category.name}</Link>
            </div>
          )}
          
          <div className="product-price mb-3">
            ${formatPrice(currentProduct.price)}
          </div>
          
          <div className="product-stock-status mb-3">
            {productInStock ? (
              <span className="in-stock"><Check size={16} /> In Stock ({currentProduct.stock} available)</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>
          
          <p className="product-short-description mb-3">
            {currentProduct.short_description || currentProduct.description?.substring(0, 150)}
            {currentProduct.description?.length > 150 && '...'}
          </p>
          
          {productInStock && (
            <div className="product-actions mb-4">
              <Form.Group className="quantity-control">
                <Form.Label>Quantity</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="number"
                    min="1"
                    max={currentProduct.stock}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="quantity-input"
                  />
                  <div className="ms-3">
                    <Button
                      onClick={handleAddToCart}
                      variant="primary"
                      className="add-to-cart-btn"
                    >
                      <ShoppingCart size={18} className="me-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Form.Group>
            </div>
          )}
          
          <Button 
            variant={productInWishlist ? "outline-danger" : "outline-secondary"}
            onClick={handleToggleWishlist}
            className="wishlist-btn mb-4"
          >
            <Heart size={18} className="me-2" fill={productInWishlist ? "#ff6b9e" : "none"} />
            {productInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </Button>
          
          <Tabs
            id="product-tabs"
            activeKey={activeTab}
            onSelect={(key) => setActiveTab(key)}
            className="product-tabs mb-4"
          >
            <Tab eventKey="description" title="Description">
              <div className="tab-content-box">
                <p>{currentProduct.description}</p>
              </div>
            </Tab>
            <Tab eventKey="details" title="Details">
              <div className="tab-content-box">
                <ul className="product-details-list">
                  <li><strong>SKU:</strong> {currentProduct.sku || 'N/A'}</li>
                  <li><strong>Weight:</strong> {currentProduct.weight || 'N/A'}</li>
                  <li><strong>Dimensions:</strong> {currentProduct.dimensions || 'N/A'}</li>
                  <li><strong>Stock:</strong> {currentProduct.stock || '0'}</li>
                </ul>
              </div>
            </Tab>
            <Tab eventKey="reviews" title="Reviews">
              <div className="tab-content-box">
                <p>Customer reviews coming soon...</p>
              </div>
            </Tab>
          </Tabs>
        </Col>
      </Row>
      
      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section mt-5">
          <h2 className="section-title">You May Also Like</h2>
          <Row>
            {relatedProducts.map(product => (
              <Col key={product.id} lg={3} md={6} className="mb-4">
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </section>
      )}
    </Container>
  );
};

export default ProductDetailsPage;