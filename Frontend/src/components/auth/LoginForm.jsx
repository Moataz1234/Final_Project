import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import FormInput from '../UI/Input';
import ErrorMessage from '../UI/ErrorMessage';
import SocialLogin from '../UI/SocialLogin';
import './auth.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      // After successful login, sync cart and wishlist
      await syncCart();
      await syncWishlist();
      navigate(getRedirectPath());
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Initialize Google Sign-In
      const auth2 = window.gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();
      const idToken = googleUser.getAuthResponse().id_token;
      
      // Send the token to your backend
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Store the token in your auth store
        useAuthStore.getState().setAuth(data.user, data.token);
        
        // Sync cart and wishlist
        await syncCart();
        await syncWishlist();
        navigate(getRedirectPath());
      } else {
        throw new Error('Google login failed');
      }
    } catch (error) {
      console.error('Google login failed:', error);
      // Show error message
    }
  };

  // Clear error when unmounting
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  return (
    <div className="auth-container">
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="title">Welcome Back</h1>
        <p className="message">Sign in to access your account</p>

        <ErrorMessage error={error} onClose={clearError} />

        <FormInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />

        <button className="submit" type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>

        <SocialLogin onGoogleLogin={handleGoogleLogin} />

        <p className="signin">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;