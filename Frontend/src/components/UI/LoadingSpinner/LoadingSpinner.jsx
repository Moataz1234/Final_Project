// src/components/UI/LoadingSpinner/LoadingSpinner.jsx
import React from 'react';
import { Spinner } from 'react-bootstrap';
import './LoadingSpinner.css';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner-content">
        <div className="spinner-wrapper">
          <Spinner animation="border" role="status" className="spinner" />
        </div>
        <p className="loading-text">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;