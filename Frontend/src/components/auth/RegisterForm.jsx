import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
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
      alert('Passwords do not match');
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
      // Error is already handled in the store
      console.error('Registration failed:', error);
    }
  };

  // Clear error when unmounting
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  return (
    <div className="auth-container">
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Register</p>
        <p className="message">Create your account to start shopping.</p>

        {error && (
          <div className="error-message">
            {error}
            <button type="button" onClick={clearError}>×</button>
          </div>
        )}

        <div className="flex">
          <label>
            <input
              type="text"
              name="firstname"
              className="input"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
            <span>First Name</span>
          </label>

          <label>
            <input
              type="text"
              name="lastname"
              className="input"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
            <span>Last Name</span>
          </label>
        </div>

        <label>
          <input
            type="email"
            name="email"
            className="input"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <span>Email</span>
        </label>

        <label>
          <input
            type="tel"
            name="phone"
            className="input"
            value={formData.phone}
            onChange={handleChange}
          />
          <span>Phone (optional)</span>
        </label>

        <label>
          <input
            type="text"
            name="address"
            className="input"
            value={formData.address}
            onChange={handleChange}
          />
          <span>Address (optional)</span>
        </label>

        <label>
          <input
            type="password"
            name="password"
            className="input"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span>Password</span>
        </label>

        <label>
          <input
            type="password"
            name="password_confirmation"
            className="input"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
          />
          <span>Confirm Password</span>
        </label>

        <button className="submit" type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="signin">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;