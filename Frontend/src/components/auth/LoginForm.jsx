import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import useAuthStore from '../../store/authStore';
import './auth.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) {
      navigate('/');
    }
  };

  return (
    <Container 
      className="d-flex flex-column align-items-center justify-content-center" 
      style={{ minHeight: '100vh', backgroundColor: 'var(--background-color)' }}
    >
      <Card 
        className="w-100" 
        style={{ 
          maxWidth: '450px', 
          backgroundColor: 'var(--card-background)', 
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          color: 'var(--text-color)'
        }}
      >
        <Card.Body className="p-4">
          <h1 
            className="text-center mb-3" 
            style={{ color: 'var(--primary-color)' }}
          >
            MEEMII'S
          </h1>
          
          <h2 
            className="text-center mb-4" 
            style={{ color: 'var(--primary-color)' }}
          >
            Sign In
          </h2>
          
          <p className="text-center text-muted mb-4">
            Welcome back! Please sign in to continue.
          </p>

          {error && (
            <Alert 
              variant="danger" 
              className="d-flex justify-content-between align-items-center"
              dismissible
              onClose={clearError}
            >
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label 
                style={{ 
                  color: 'var(--text-color-secondary)', 
                  fontWeight: 'bold' 
                }}
              >
                Email
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  backgroundColor: 'var(--input-background)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-color)'
                }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label 
                style={{ 
                  color: 'var(--text-color-secondary)', 
                  fontWeight: 'bold' 
                }}
              >
                Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  backgroundColor: 'var(--input-background)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-color)'
                }}
              />
            </Form.Group>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-100 py-2"
              style={{
                backgroundColor: 'var(--primary-color)',
                borderColor: 'var(--primary-color)',
                fontWeight: 'bold'
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <span style={{ color: 'var(--text-color-secondary)' }}>
              Don't have an account?{' '}
              <Link 
                to="/register" 
                style={{ 
                  color: 'var(--primary-color)', 
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Sign up
              </Link>
            </span>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginForm;