// src/components/Products/ProductCard/ProductCard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import useCartStore from '../../../store/cartStore';
import useWishlistStore from '../../../store/wishlistStore';
import useAuthStore from '../../../store/authStore';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  
  // Check if product is in wishlist
  const productInWishlist = isInWishlist(product.id);

  // Function to safely parse and format price
  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
  };

  // Function to handle adding to cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login?redirect=/cart');
      return;
    }
    addToCart(product, 1);
  };

  // Function to handle toggling wishlist
  const handleToggleWishlist = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login?redirect=/wishlist');
      return;
    }
    
    if (productInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-link">
        <img 
          src={product.image_url || 'https://via.placeholder.com/300x300'}
          alt={product.name}
          className="product-image"
        />
        <div className="product-info">
          <h3 className="product-title">{product.name}</h3>
          <p className="product-description">
            {product.description && product.description.length > 100 
              ? `${product.description.substring(0, 100)}...` 
              : product.description}
          </p>
          <div className="product-price-actions">
            <span className="product-price">
              ${formatPrice(product.price)}
            </span>
            <div className="product-actions">
              <button 
                className={`wishlist-btn ${productInWishlist ? 'active' : ''}`}
                onClick={handleToggleWishlist}
                aria-label={productInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={18} fill={productInWishlist ? "#ff6b9e" : "none"} />
              </button>
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                aria-label="Add to cart"
              >
                <ShoppingCart size={18} /> Add
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;