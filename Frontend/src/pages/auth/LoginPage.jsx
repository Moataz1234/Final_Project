// src/pages/auth/LoginPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="container mx-auto">
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