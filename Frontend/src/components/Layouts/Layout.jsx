// src/components/Layout/Layout.jsx
import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer';

const Layout = ({ children }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundColor: '#121212'
    }}>
      <Header />
      <main style={{ 
        flex: 1, 
        backgroundColor: '#121212', 
        color: 'white' 
      }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;