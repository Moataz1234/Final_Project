// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/Products/Product/ProductPage';
// import ProductDetailPage from './pages/Products/ProductDetails/ProductDetailsPage';
import CartPage from './pages/Cart/CartPage';
import WishlistPage from './pages/Wishlist/WishlistPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
// import ProfilePage from './pages/Profile/ProfilePage';
import ProtectedRoute from './components/Routing/ProtectedRoute';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Global styles
import './styles/globals.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            {/* Public routes with main layout */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            {/* <Route path="products/:id" element={<ProductDetailPage />} /> */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* <Route path="*" element={<NotFoundPage />} /> */}

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              {/* <Route path="profile" element={<ProfilePage />} /> */}
              {/* <Route path="orders" element={<OrdersPage />} /> */}
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;