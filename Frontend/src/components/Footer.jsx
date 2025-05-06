import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  Instagram, 
  Twitter, 
  Facebook, 
  Mail 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer 
      className="bg-dark text-white py-5 mt-5"
      style={{ backgroundColor: '#1e1e1e' }}
    >
      <Container>
        <Row>
          <Col md={4}>
            <h5>MEEMII'S</h5>
            <p>
              Discover adorable and unique products that bring joy to your everyday life.
            </p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>About Us</li>
              <li>Contact</li>
              <li>Shipping & Returns</li>
              <li>Privacy Policy</li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Connect With Us</h5>
            <div className="d-flex gap-3">
              <Instagram />
              <Twitter />
              <Facebook />
              <Mail />
            </div>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col className="text-center">
            © {new Date().getFullYear()} MEEMII'S. All Rights Reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;