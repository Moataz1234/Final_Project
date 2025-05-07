// src/pages/auth/LoginPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import './AuthPages.css';

const LoginPage = () => {
  return (
    <div className="auth-page-container">
      <LoginForm />
      {/* <p className="text-center mt-4">
        Don't have an account? 
        <Link to="/register" className="text-blue-500 ml-1">
          Register here
        </Link>
      </p> */}
    </div>
  );
};

export default LoginPage;