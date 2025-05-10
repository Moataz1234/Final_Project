// src/pages/Products/ProductDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Alert, Tabs, Tab } from 'react-bootstrap';
import { Heart, ShoppingCart, ArrowLeft, Check, AlertCircle, ImageOff, Star } from 'lucide-react';
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
  const { isAuthenticated, user } = useAuthStore();
  const { fetchProductById, currentProduct, loading, error, products, fetchProducts } = useProductStore();
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, review: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);

  useEffect(() => {
    fetchProductById(id);
    window.scrollTo(0, 0);
  }, [id, fetchProductById]);

  useEffect(() => {
    if (currentProduct && currentProduct.category) {
      fetchProducts({
        category: currentProduct.category.slug,
        perPage: 4,
      }).then(() => {
        const filtered = products.filter((product) => product.id !== parseInt(id));
        setRelatedProducts(filtered.slice(0, 4));
      });
    }
  }, [currentProduct, id, fetchProducts, products]);

  // Fetch reviews for the product
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewLoading(true);
        const response = await fetch(`http://localhost:8000/api/reviews?product_id=${id}`);
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
        }
        const data = await response.json();
        const productReviews = data.filter(
          (review) => review.product_id === parseInt(id) && review.is_approved
        );
        setReviews(productReviews);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setReviewError(err.message);
      } finally {
        setReviewLoading(false);
      }
    };

    if (id) fetchReviews();
  }, [id]);

  const getImageUrl = () => {
    if (!currentProduct.image_url) return 'https://via.placeholder.com/300x300';
    if (currentProduct.image_url.startsWith('http://') || currentProduct.image_url.startsWith('https://')) {
      return currentProduct.image_url;
    }
    return `http://localhost:8000/storage/${currentProduct.image_url}`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= currentProduct.stock) {
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

  const handleRatingChange = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
    setSubmissionError(null); // Clear error when user interacts
  };

  const handleReviewTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= 500) { // Optional: Limit review text to 500 characters
      setNewReview((prev) => ({ ...prev, review: text }));
      setSubmissionError(null);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate(`/login?redirect=/products/${id}`);
      return;
    }

    // Client-side validation
    if (newReview.rating < 1 || newReview.rating > 5) {
      setSubmissionError('Please select a rating between 1 and 5 stars.');
      return;
    }

    try {
      setReviewLoading(true);
      setSubmissionError(null);
      const response = await fetch('http://localhost:8000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`, // Ensure token is available
        },
        credentials: 'include',
        body: JSON.stringify({
          product_id: parseInt(id),
          rating: newReview.rating,
          review: newReview.review.trim() || null, // Send null if review is empty
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setReviews((prev) => [...prev, { ...data, user: { name: user.name || 'User' } }]);
      setNewReview({ rating: 0, review: '' });
      showSuccessToast('Review submitted successfully! It will be visible once approved.');
    } catch (err) {
      console.error('Error submitting review:', err);
      setSubmissionError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setReviewLoading(false);
    }
  };

  const productInWishlist = currentProduct ? isInWishlist(currentProduct.id) : false;

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
        <Alert variant="warning">Product not found. It may have been removed or is no longer available.</Alert>
        <Link to="/products">
          <Button variant="primary">Browse Products</Button>
        </Link>
      </Container>
    );
  }

  const productInStock = currentProduct.stock > 0;
  const displayPrice = currentProduct.is_on_sale && currentProduct.sale_price ? currentProduct.sale_price : currentProduct.price;
  const originalPrice = currentProduct.is_on_sale ? currentProduct.price : null;

  // Calculate rating distribution
  const ratingDistribution = Array(5).fill(0);
  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingDistribution[review.rating - 1]++;
    }
  });
  const totalReviews = reviews.length;

  return (
    <Container className="product-details-container">
      <Link to="/products" className="back-to-products" aria-label="Back to products">
        <ArrowLeft size={16} className="me-1" /> Back to Products
      </Link>

      <div className="product-details-wrapper">
        {/* Product Image */}
        <div className="product-image">
          {imageError ? (
            <div className="product-detail-fallback">
              <ImageOff size={40} />
              <p>Image not available</p>
            </div>
          ) : (
            <img
              src={getImageUrl()}
              alt={currentProduct.name}
              className="img-fluid"
              onError={handleImageError}
            />
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <div className="product-meta">
            <Link to={`/categories/${currentProduct.category?.slug || 'unknown'}`}>
              Visit the {currentProduct.category?.name || 'Category'} Store
            </Link>
          </div>

          <h1 className="product-title">{currentProduct.name}</h1>

          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.round(currentProduct.average_rating) ? '#ff9900' : 'none'}
                  stroke={i < Math.round(currentProduct.average_rating) ? '#ff9900' : '#ccc'}
                />
              ))}
            </div>
            <span>{currentProduct.average_rating.toFixed(1)}</span>
            <Link to="#reviews">{currentProduct.total_reviews} ratings</Link>
          </div>

          <div className="product-price">
            {originalPrice && <span className="original-price">${formatPrice(originalPrice)}</span>}
            ${formatPrice(displayPrice)}
            {currentProduct.is_on_sale && (
              <span className="sale-percentage">-{currentProduct.sale_percentage}%</span>
            )}
          </div>

          <div className="product-stock-status">
            {productInStock ? (
              <span className="in-stock">
                <Check size={16} /> In Stock ({currentProduct.stock} available)
              </span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>

          <div className="product-category">
            Category: <Link to={`/products?category=${currentProduct.category?.slug}`}>{currentProduct.category?.name}</Link>
          </div>

          {/* Quantity and Action Buttons */}
          <div className="action-buttons">
            {productInStock && (
              <Form.Group className="quantity-selector">
                <Form.Control
                  type="number"
                  min="1"
                  max={currentProduct.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  aria-label="Select quantity"
                />
              </Form.Group>
            )}

            <Button
              onClick={handleAddToCart}
              className="add-to-cart-btn"
              disabled={!productInStock}
              aria-label="Add to cart"
            >
              <ShoppingCart size={18} className="me-2" />
              Add to Cart
            </Button>

            <Button
              onClick={handleToggleWishlist}
              className="wishlist-btn"
              aria-label={productInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                size={18}
                className="me-2"
                fill={productInWishlist ? '#ff6b9e' : 'none'}
                stroke={productInWishlist ? '#ff6b9e' : 'currentColor'}
              />
            </Button>
          </div>

          {/* Product Details */}
          <div className="product-details">
            <ul>
              <li><strong>Care Instructions:</strong> {currentProduct.usage_instructions || 'N/A'}</li>
              <li><strong>Scent Type:</strong> {currentProduct.scent_type || 'N/A'}</li>
              <li><strong>Weight:</strong> {currentProduct.weight || 'N/A'}</li>
              <li><strong>Suitable For:</strong> {currentProduct.suitable_for || 'All'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-section">
        <Tabs
          id="product-tabs"
          activeKey={activeTab}
          onSelect={(key) => setActiveTab(key)}
          className="product-tabs"
        >
          <Tab eventKey="description" title="About this item">
            <div className="tab-content-box">
              <ul>
                <li>{currentProduct.description || 'No description available.'}</li>
                {currentProduct.ingredients && (
                  <li><strong>Ingredients:</strong> {currentProduct.ingredients}</li>
                )}
              </ul>
            </div>
          </Tab>
          <Tab eventKey="details" title="Details">
            <div className="tab-content-box">
              <ul className="product-details-list">
                <li><strong>Stock:</strong> {currentProduct.stock || '0'}</li>
                <li><strong>Category:</strong> {currentProduct.category?.name || 'N/A'}</li>
              </ul>
            </div>
          </Tab>
          <Tab eventKey="reviews" title="Reviews">
            <div className="tab-content-box">
              {reviewLoading ? (
                <LoadingSpinner text="Loading reviews..." />
              ) : reviewError ? (
                <Alert variant="danger">{reviewError}</Alert>
              ) : reviews.length === 0 ? (
                <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
              ) : (
                <div className="reviews-container">
                  <div className="reviews-header">
                    <h4 className="reviews-title">Customer Reviews</h4>
                    <div className="rating-summary">
                      <div className="average-rating">
                        <span className="rating-number">{currentProduct.average_rating.toFixed(1)}</span>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              fill={i < Math.round(currentProduct.average_rating) ? '#ff9900' : 'none'}
                              stroke={i < Math.round(currentProduct.average_rating) ? '#ff9900' : '#ccc'}
                            />
                          ))}
                        </div>
                        <span className="total-reviews">({currentProduct.total_reviews} reviews)</span>
                      </div>
                      <div className="rating-distribution">
                        {ratingDistribution.map((count, index) => {
                          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                          return (
                            <div key={index} className="rating-bar">
                              <span className="star-label">{5 - index} stars</span>
                              <div className="bar-container">
                                <div className="bar" style={{ width: `${percentage}%` }}></div>
                              </div>
                              <span className="count">({count})</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="reviews-list">
                    {reviews.map((review) => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <div className="user-avatar">
                            <span>{review.user?.name?.charAt(0) || 'A'}</span>
                          </div>
                          <div className="user-info">
                            <span className="review-user">{review.user?.name || 'Anonymous'}</span>
                            <div className="review-rating">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  fill={i < review.rating ? '#ff9900' : 'none'}
                                  stroke={i < review.rating ? '#ff9900' : '#ccc'}
                                />
                              ))}
                            </div>
                          </div>
                          {review.is_verified_purchase && (
                            <span className="verified-badge">✓ Verified Purchase</span>
                          )}
                        </div>
                        <p className="review-text">{review.review || 'No review text provided.'}</p>
                        <span className="review-date">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Form */}
              <div className="review-form-section">
                <h4 className="form-title">Write Your Review</h4>
                {isAuthenticated ? (
                  <Form onSubmit={handleReviewSubmit} className="review-form">
                    {submissionError && (
                      <Alert variant="danger" className="mb-3">
                        {submissionError}
                      </Alert>
                    )}
                    <Form.Group className="mb-3">
                      <Form.Label>Rating <span className="text-danger">*</span></Form.Label>
                      <div className="star-rating">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={28}
                            fill={i < newReview.rating ? '#ff9900' : 'none'}
                            stroke={i < newReview.rating ? '#ff9900' : '#ccc'}
                            onClick={() => handleRatingChange(i + 1)}
                            className="rating-star"
                          />
                        ))}
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Review <span className="text-muted">(optional)</span></Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={newReview.review}
                        onChange={handleReviewTextChange}
                        placeholder="Share your experience with this product..."
                        className="review-textarea"
                        maxLength={500}
                      />
                      <div className="text-muted text-end mt-1">
                        {newReview.review.length}/500 characters
                      </div>
                    </Form.Group>
                    <Button
                      type="submit"
                      disabled={reviewLoading || newReview.rating === 0}
                      className="submit-btn"
                    >
                      {reviewLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Submitting...
                        </>
                      ) : (
                        'Submit Review'
                      )}
                    </Button>
                  </Form>
                ) : (
                  <Alert variant="info" className="login-prompt">
                    Please <Link to={`/login?redirect=/products/${id}`}>log in</Link> to write a review.
                  </Alert>
                )}
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>

      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <h2 className="section-title">You May Also Like</h2>
          <Row>
            {relatedProducts.map((product) => (
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