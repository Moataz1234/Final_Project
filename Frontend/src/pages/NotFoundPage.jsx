import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <Container className="text-center py-5 my-5">
      <div className="not-found-container">
        <h1 className="display-1 text-primary">404</h1>
        <h2 className="mb-4">Page Not Found</h2>
        <p className="lead mb-5">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg">
            <Home size={20} className="me-2" /> Go to Homepage
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default NotFoundPage;
