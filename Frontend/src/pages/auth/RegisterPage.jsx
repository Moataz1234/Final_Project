// src/pages/auth/RegisterPage.jsx
import React from 'react';
import RegisterForm from '../../components/auth/RegisterForm';
import './AuthPages.css';

const RegisterPage = () => {
  return (
    <div className="auth-page-container">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;