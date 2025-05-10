// src/pages/auth/LoginPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import './AuthPages.css';

const LoginPage = () => {
  return (
    <div className="auth-page-container">
      <LoginForm />
    </div>
  );
};

export default LoginPage;