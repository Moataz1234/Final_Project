// src/components/UI/LoadingSpinner.jsx
import React from 'react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  margin: 20px auto;
  text-align: center;
`;

const RotatingLogo = styled.div`
  width: 100px;
  height: 100px;
  margin-bottom: 15px;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    animation: rotate 2s linear infinite;
  }
  
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: var(--text-color);
  font-size: 1.1rem;
  margin-top: 10px;
`;

const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <LoadingContainer>
      <RotatingLogo>
        <img src="/logo.png" alt="Loading" />
      </RotatingLogo>
      <LoadingText>{text}</LoadingText>
    </LoadingContainer>
  );
};

export default LoadingSpinner;