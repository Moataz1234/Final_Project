// src/pages/auth/RegisterPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="container mx-auto">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;