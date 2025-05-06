import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useAuthStore from '../../store/authStore';
import './auth.css';

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--background-color);
  padding: 20px;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 450px;
  background-color: var(--card-background);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    max-width: 100%;
    padding: 20px;
  }
`;

const Logo = styled.h1`
  text-align: center;
  color: var(--primary-color);
  font-size: 2.5rem;
  margin-bottom: 30px;
  font-weight: bold;

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const FormTitle = styled.h2`
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.8rem;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  background-color: var(--input-background);
  border: 1px solid var(--input-border);
  border-radius: 8px;
  color: var(--text-color);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: var(--primary-color);
  }

  &::placeholder {
    color: var(--text-color-secondary);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--primary-color-dark);
  }

  &:disabled {
    background-color: var(--input-background);
    cursor: not-allowed;
  }
`;

const SignInLink = styled.div`
  text-align: center;
  margin-top: 20px;
  color: var(--text-color-secondary);

  a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: #ff4444;
  color: white;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  text-align: center;
`;

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
  
  const { register, error, isLoading, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearError();
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

    const success = await register(userData);
    if (success) {
      navigate('/');
    }
  };

  return (
    <PageWrapper>
      <FormContainer>
        <Logo>MEEMII'S</Logo>
        <FormTitle>Register</FormTitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <form onSubmit={handleSubmit}>
          <InputWrapper>
            <Input
              type="text"
              name="firstname"
              placeholder="First name"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="lastname"
              placeholder="Last name"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </InputWrapper>

          <Input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ marginBottom: '15px' }}
          />

          <Input
            type="tel"
            name="phone"
            placeholder="Phone number (optional)"
            value={formData.phone}
            onChange={handleChange}
            style={{ marginBottom: '15px' }}
          />

          <Input
            type="text"
            name="address"
            placeholder="Address (optional)"
            value={formData.address}
            onChange={handleChange}
            style={{ marginBottom: '15px' }}
          />

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ marginBottom: '15px' }}
          />

          <Input
            type="password"
            name="password_confirmation"
            placeholder="Confirm password"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
            style={{ marginBottom: '20px' }}
          />

          <SubmitButton 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </SubmitButton>
        </form>

        <SignInLink>
          Already have an account? <Link to="/login">Sign in</Link>
        </SignInLink>
      </FormContainer>
    </PageWrapper>
  );
};

export default RegisterForm;