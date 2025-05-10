import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import FormInput from '../UI/Input';
import ErrorMessage from '../UI/ErrorMessage';
import SocialLogin from '../UI/SocialLogin';
import './auth.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    password_confirmation: ''
  });
  
  const { register, loading, error, clearError } = useAuthStore();
  const { syncCart } = useCartStore();
  const { syncWishlist } = useWishlistStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.password_confirmation) {
      useAuthStore.getState().setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      useAuthStore.getState().setError('Password must be at least 8 characters long');
      return;
    }

    const userData = {
      name: `${formData.firstname} ${formData.lastname}`,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      password: formData.password,
      password_confirmation: formData.password_confirmation
    };

    try {
      await register(userData);
      // After successful registration, sync cart and wishlist
      await syncCart();
      await syncWishlist();
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Initialize Google Sign-In
      const auth2 = window.gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();
      const profile = googleUser.getBasicProfile();
      const idToken = googleUser.getAuthResponse().id_token;
      
      // Create user data from Google profile
      const userData = {
        name: profile.getName(),
        email: profile.getEmail(),
        googleId: profile.getId(),
        idToken: idToken
      };
      
      // Send to your backend for registration/login
      const response = await fetch('/api/auth/google-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Store the token in your auth store
        useAuthStore.getState().setAuth(data.user, data.token);
        
        // Sync cart and wishlist
        await syncCart();
        await syncWishlist();
        navigate('/');
      } else {
        throw new Error('Google registration failed');
      }
    } catch (error) {
      console.error('Google registration failed:', error);
      useAuthStore.getState().setError('Google registration failed. Please try again.');
    }
  };

  // Clear error when unmounting
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  return (
    <div className="auth-container">
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="title">Create Account</h1>
        <p className="message">Join us to start shopping</p>

        <ErrorMessage error={error} onClose={clearError} />

        <div className="flex">
          <FormInput
            label="First Name"
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
            autoComplete="given-name"
          />
          <FormInput
            label="Last Name"
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
            autoComplete="family-name"
          />
        </div>

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
          label="Phone (optional)"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          autoComplete="tel"
        />

        <FormInput
          label="Address (optional)"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          autoComplete="street-address"
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />

        <FormInput
          label="Confirm Password"
          type="password"
          name="password_confirmation"
          value={formData.password_confirmation}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />

        <button className="submit" type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        <SocialLogin onGoogleLogin={handleGoogleLogin} />

        <p className="signin">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;