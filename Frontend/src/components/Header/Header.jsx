import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  LogIn, 
  Menu, 
  X 
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
        <Link to="/cart" className="nav-item">
          <ShoppingCart size={20} />
          <span>Cart</span>
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/profile" className="button profile">
              <User size={16} />
              Profile
            </Link>
            <button onClick={handleLogout} className="button login">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="button login">
            <LogIn size={16} />
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;