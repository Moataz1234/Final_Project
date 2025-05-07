import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import './auth.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, clearError } = useAuthStore();
  const { syncCart } = useCartStore();
  const { syncWishlist } = useWishlistStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from URL query params
  const getRedirectPath = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('redirect') || '/';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // After successful login, sync cart and wishlist
      await syncCart();
      await syncWishlist();
      navigate(getRedirectPath());
    } catch (error) {
      // Error is already handled in the store
      console.error('Login failed:', error);
    }
  };

  // Clear error when unmounting
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  return (
    <div className="auth-container">
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Login</p>
        <p className="message">Sign in to access your account.</p>

          {error && (
          <div className="error-message">
            {error}
            <button type="button" onClick={clearError}>×</button>
          </div>
        )}

        <label>
          <input 
                type="email"
            className="input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
          <span>Email</span>
        </label>

        <label>
          <input 
                type="password"
            className="input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
          />
          <span>Password</span>
        </label>

        <button className="submit" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="signin">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
          </div>
  );
};

export default LoginForm;