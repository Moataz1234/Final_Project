// src/pages/Cart/CartPage.jsx
import React from 'react';
import { Container, Table, Button, Form, Row, Col, Card } from 'react-bootstrap';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import './CartPage.css';

const CartPage = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCartStore();

  // Function to safely format price
  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return !isNaN(numPrice) ? numPrice.toFixed(2) : '0.00';
  };

  if (items.length === 0) {
    return (
      <Container className="cart-empty-container">
        <div className="cart-empty">
          <ShoppingBag size={64} />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products">
            <Button variant="primary" className="continue-shopping-btn">
              <ArrowLeft size={18} /> Continue Shopping
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="cart-page-container">
      <h1 className="cart-page-title">Shopping Cart</h1>
      <Row className="cart-content">
        <Col lg={8}>
          <Table responsive className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td className="cart-product-info">
                    <img 
                      src={item.image_url || 'https://via.placeholder.com/80x80'} 
                      alt={item.name}
                      className="cart-product-image"
                    />
                    <div>
                      <h5>{item.name}</h5>
                      {item.category && <span className="product-category">{item.category.name}</span>}
                    </div>
                  </td>
                  <td>${formatPrice(item.price)}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="quantity-input"
                    />
                  </td>
                  <td className="product-total">${formatPrice(item.price * item.quantity)}</td>
                  <td>
                    <Button 
                      variant="light"
                      onClick={() => removeItem(item.id)}
                      className="remove-btn"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="cart-actions">
            <Link to="/products">
              <Button variant="outline-primary">
                <ArrowLeft size={18} /> Continue Shopping
              </Button>
            </Link>
            <Button 
              variant="outline-danger" 
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          </div>
        </Col>
        <Col lg={4}>
          <Card className="cart-summary">
            <Card.Header>
              <h4>Cart Summary</h4>
            </Card.Header>
            <Card.Body>
              <div className="summary-item">
                <span>Items:</span>
                <span>{totalItems}</span>
              </div>
              <div className="summary-item">
                <span>Subtotal:</span>
                <span>${formatPrice(totalPrice)}</span>
              </div>
              <div className="summary-item">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="summary-total">
                <span>Total:</span>
                <span>${formatPrice(totalPrice)}</span>
              </div>
              <Button 
                variant="primary" 
                className="checkout-btn"
                onClick={() => console.log('Proceed to checkout')}
              >
                Proceed to Checkout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;