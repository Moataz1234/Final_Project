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
  Send,
  ShoppingBag,
  Info,
  HelpCircle
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        <Container>
          <Row className="footer-widgets">
            <Col lg={4} md={6} className="footer-widget about-widget">
              <div className="brand-section">
                <h3 className="footer-logo">MEEMII'S</h3>
                {/* <p className="footer-description">
                  Discover adorable and unique products that bring joy to your everyday life. We curate the cutest items from around the world.
                </p> */}
              </div>
            </Col>
            
            <Col lg={2} md={6} className="footer-widget links-widget">
              <h4 className="widget-title">
                <ShoppingBag size={18} className="widget-icon" />
                Shop
              </h4>
              <ul className="footer-links">
                <li><Link to="/products">All Products</Link></li>
                <li><Link to="/categories">Categories</Link></li>
                <li><Link to="/new-arrivals">New Arrivals</Link></li>
                <li><Link to="/best-sellers">Best Sellers</Link></li>
                <li><Link to="/sale">Sale</Link></li>
              </ul>
            </Col>
            
            <Col lg={2} md={6} className="footer-widget links-widget">
              <h4 className="widget-title">
                <Info size={18} className="widget-icon" />
                Company
              </h4>
              <ul className="footer-links">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/stores">Store Locations</Link></li>
              </ul>
            </Col>
            
            <Col lg={4} md={6} className="footer-widget newsletter-widget">
              <h4 className="widget-title">
                <HelpCircle size={18} className="widget-icon" />
                Help & Support
              </h4>
              <ul className="footer-links mb-4">
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/shipping">Shipping & Returns</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
              </ul>
              
              <div className="newsletter-section">
                <h5 className="newsletter-title">Join Our Newsletter</h5>
                <p className="newsletter-text">Subscribe and get 10% off your first purchase</p>
                <InputGroup className="newsletter-form">
                  <Form.Control
                    placeholder="Your email address"
                    aria-label="Your email address"
                  />
                  <Button variant="primary" className="newsletter-btn">
                    <Send size={16} />
                  </Button>
                </InputGroup>
              </div>
            </Col>
          </Row>
          
          <Row className="mt-5">
            <Col className="text-center">
              <div className="footer-social">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
                  <Twitter size={18} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                  <Facebook size={18} />
                </a>
                <a href="mailto:contact@meemiis.com" className="social-link" aria-label="Email">
                  <Mail size={18} />
                </a>
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
          <Row className="mt-3">
            <Col className="text-center">
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
    </footer>
  );
};

export default Footer; 