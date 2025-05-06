import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  ShoppingCart, 
  User, 
  LogIn, 
  Menu, 
  X 
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const NavContainer = styled.nav`
  background-color: #1e1e1e;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const Logo = styled(Link)`
  color: #fc8fa7;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    display: none;
    flex-direction: column;
    width: 100%;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #1e1e1e;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }
`;

const MobileNavLinks = styled(NavLinks)`
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
  }
`;

const NavItem = styled(Link)`
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.3s ease;

  &:hover {
    color: #fc8fa7;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    margin-top: 15px;
  }
`;

const Button = styled(Link)`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 15px;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &.login {
    background-color: #fc8fa7;
    color: white;

    &:hover {
      background-color: #ff6b9e;
    }
  }

  &.profile {
    background-color: #2c2c2c;
    color: white;

    &:hover {
      background-color: #3c3c3c;
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <NavContainer>
      <Logo to="/">MEEMII'S</Logo>

      <MobileMenuButton onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </MobileMenuButton>

      <NavLinks>
        <NavItem to="/">Home</NavItem>
        <NavItem to="/products">Products</NavItem>
        <NavItem to="/categories">Categories</NavItem>
      </NavLinks>

      <MobileNavLinks isOpen={isMobileMenuOpen}>
        <NavItem to="/">Home</NavItem>
        <NavItem to="/products">Products</NavItem>
        <NavItem to="/categories">Categories</NavItem>
      </MobileNavLinks>

      <AuthButtons>
        <NavItem to="/cart">
          <ShoppingCart size={20} />
          <span>Cart</span>
        </NavItem>

        {isAuthenticated ? (
          <>
            <Button 
              to="/profile" 
              className="profile"
            >
              <User size={16} />
              Profile
            </Button>
            <Button 
              as="button" 
              onClick={handleLogout} 
              className="login"
            >
              Logout
            </Button>
          </>
        ) : (
          <Button 
            to="/login" 
            className="login"
          >
            <LogIn size={16} />
            Login
          </Button>
        )}
      </AuthButtons>
    </NavContainer>
  );
};

export default Header;