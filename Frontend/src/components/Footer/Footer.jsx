import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Twitter, 
  Facebook, 
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={4} className="footer-col">
            <h5 className="footer-logo">MEEMII'S</h5>
            <p className="footer-description">
              Discover adorable and unique products that bring joy to your everyday life. We curate the cutest items from around the world.
            </p>
            <div className="footer-contact">
              <div className="d-flex align-items-center mb-2">
                <Mail size={16} className="me-2" />
                <span>contact@meemiis.com</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <Phone size={16} className="me-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="d-flex align-items-center">
                <MapPin size={16} className="me-2" />
                <span>123 Cute Street, Adorable City</span>
              </div>
            </div>
          </Col>
          
          <Col md={4} className="footer-col">
            <h5>Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/categories">Categories</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </Col>
          
          <Col md={4} className="footer-col">
            <h5>Customer Service</h5>
            <ul className="footer-links">
              <li><Link to="/shipping">Shipping & Returns</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
            </ul>
            
            <h5 className="mt-4">Connect With Us</h5>
            <div className="social-links">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Twitter size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Facebook size={20} />
              </a>
              <a href="mailto:contact@meemiis.com" className="social-icon">
                <Mail size={20} />
              </a>
            </div>
          </Col>
        </Row>
        
        <hr className="footer-divider" />
        
        <Row>
          <Col className="text-center">
            <p className="copyright">
              © {new Date().getFullYear()} MEEMII'S. All Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 