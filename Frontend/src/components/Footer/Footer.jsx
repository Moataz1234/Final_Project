import React from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Twitter, 
  Facebook, 
  Mail,
  Phone,
  MapPin,
  Heart,
  Send
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        <Container>
          <Row className="footer-widgets">
            <Col lg={4} md={6} className="footer-widget about-widget">
              <h3 className="footer-logo">MEEMII'S</h3>
              {/* <p className="footer-description">
                Discover adorable and unique products that bring joy to your everyday life. We curate the cutest items from around the world.
              </p> */}
              <div className="footer-social">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <Instagram size={18} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <Twitter size={18} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <Facebook size={18} />
                </a>
                <a href="mailto:contact@meemiis.com" className="social-link">
                  <Mail size={18} />
                </a>
              </div>
            </Col>
            
            <Col lg={2} md={6} className="footer-widget links-widget">
              <h4 className="widget-title">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">Shop</Link></li>
                <li><Link to="/categories">Categories</Link></li>
                <li><Link to="/wishlist">Wishlist</Link></li>
                <li><Link to="/cart">Cart</Link></li>
              </ul>
            </Col>
            
            <Col lg={2} md={6} className="footer-widget links-widget">
              <h4 className="widget-title">Information</h4>
              <ul className="footer-links">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
              </ul>
            </Col>
            
            <Col lg={4} md={6} className="footer-widget newsletter-widget">
              <h4 className="widget-title">Newsletter</h4>
              <p>Subscribe to our newsletter and get 10% off your first purchase</p>
              <InputGroup className="newsletter-form">
                <Form.Control
                  placeholder="Your email address"
                  aria-label="Your email address"
                />
                <Button variant="primary" className="newsletter-btn">
                  <Send size={16} />
                </Button>
              </InputGroup>
              <div className="footer-contact">
                <div className="contact-item">
                  <Phone size={16} className="contact-icon" />
                  <span>+2 01149454541</span>
                </div>
                <div className="contact-item">
                  <Mail size={16} className="contact-icon" />
                  <span>contact@meemiis.com</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      
      <div className="footer-bottom">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="copyright">
              <p>&copy; {new Date().getFullYear()} MEEMII'S. All Rights Reserved.</p>
            </Col>
            <Col md={6} className="payment-methods">
              <div className="payment-icons">
                <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" />
                <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="MasterCard" />
                <img src="https://cdn-icons-png.flaticon.com/512/196/196565.png" alt="PayPal" />
                <img src="https://cdn-icons-png.flaticon.com/512/5968/5968299.png" alt="Apple Pay" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer; 