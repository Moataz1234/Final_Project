// src/components/Products/ProductCard/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import useCartStore from '../../../store/cartStore';
import useWishlistStore from '../../../store/wishlistStore';
import './ProductCard.css';

const ProductCard = ({ product }) => {
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
    addToCart(product, 1);
    
    // Show confirmation toast
    // You can implement a toast notification system later
    console.log('Product added to cart:', product.name);
  };

  // Function to handle toggling wishlist
  const handleToggleWishlist = (e) => {
    e.preventDefault();
    
    if (productInWishlist) {
      removeFromWishlist(product.id);
      console.log('Product removed from wishlist:', product.name);
    } else {
      addToWishlist(product);
      console.log('Product added to wishlist:', product.name);
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="product-link">
      <div className="product-card">
        <img 
          src={product.image_url || 'https://via.placeholder.com/300x300'}
          alt={product.name}
          className="product-card__image"
        />
        <div className="product-card__info">
          <h3 className="product-card__title">{product.name}</h3>
          <p className="product-card__description">
            {product.description && product.description.length > 100 
              ? `${product.description.substring(0, 100)}...` 
              : product.description}
          </p>
          <div className="product-card__price-actions">
            <span className="product-card__price">
              ${formatPrice(product.price)}
            </span>
            <div className="product-card__actions">
              <button 
                className={`product-card__action-btn ${productInWishlist ? 'active' : ''}`}
                onClick={handleToggleWishlist}
                aria-label={productInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={18} />
              </button>
              <button 
                className="product-card__add-to-cart"
                onClick={handleAddToCart}
                aria-label="Add to cart"
              >
                <ShoppingCart size={18} /> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;