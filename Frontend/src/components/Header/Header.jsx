import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  LogOut, 
  Menu, 
  X,
  Heart 
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import './Header.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="nav-container">
      <Link to="/" className="logo">MEEMII'S</Link>

      <button className="mobile-menu-button" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/products" className="nav-item">Products</Link>
        <Link to="/categories" className="nav-item">Categories</Link>
      </div>

      <div className="auth-buttons">
        <Link to="/wishlist" className="nav-item">
          <Heart size={20} />
          <span>Wishlist</span>
        </Link>
        
        <Link to="/cart" className="nav-item">
          <ShoppingCart size={20} />
          <span>Cart</span>
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/profile" className="nav-item">
              <User size={20} />
              <span>Profile</span>
            </Link>
            <button onClick={handleLogout} className="nav-item logout-btn">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <Link to="/login" className="nav-item login-highlight">
            <User size={20} />
            <span>Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;