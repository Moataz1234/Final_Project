// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/Products/ProductList/ProductPage';
import ProductDetailsPage from './pages/Products/ProductDetails/ProductDetailsPage';
import CartPage from './pages/Cart/CartPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import OrdersPage from './pages/Orders/OrderList/OrdersPage';
import OrderDetailsPage from './pages/Orders/OrderDetails/OrderDetailsPage'
// import OrderDetailsPage from './pages/Orders/OrderDetailsPage';
import WishlistPage from './pages/Wishlist/WishlistPage';
import ProfilePage from './pages/Profile/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/routing/ProtectedRoute';
import useAuthStore from './store/authStore';
import useCartStore from './store/cartStore';
import useWishlistStore from './store/wishlistStore';
import useProductStore from './store/productStore';
import './App.css';
import './utils/sweetalert-custom.css';
import LoadingSpinner from './components/UI/LoadingSpinner/LoadingSpinner';
function App() {
  const { initializeAuth, isAuthenticated, loading: authLoading } = useAuthStore();
  const { initialize: initializeCart } = useCartStore();
  const { initialize: initializeWishlist } = useWishlistStore();
  
  useEffect(() => {
    // Initialize auth on app load
    initializeAuth();
  }, []);
  
  useEffect(() => {
    // Initialize cart and wishlist when auth status changes
    if (isAuthenticated) {
      initializeCart();
      initializeWishlist();
    } else {
      // Clear cart and wishlist data when logged out
      useCartStore.setState({
        items: [],
        totalItems: 0,
        totalAmount: 0,
        initialized: true
      });
      useWishlistStore.setState({
        items: [],
        initialized: true
      });
    }
  }, [isAuthenticated]);
  
  if (authLoading) {
    return <LoadingSpinner text="Loading..." />;
  }
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:id" element={<OrderDetailsPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
<script src="https://apis.google.com/js/platform.js" async defer></script>
