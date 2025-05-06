// src/pages/Checkout/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, AlertCircle } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useOrderStore from '../../store/orderStore';
import useAuthStore from '../../store/authStore';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items, totalItems, totalPrice, clearCart, initialize } = useCartStore();
  const { placeOrder, loading, error } = useOrderStore();
  
  const [formData, setFormData] = useState({
    shipping_address: '',
    billing_address: '',
    payment_method: 'credit_card',
    notes: ''
  });
  
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  
  useEffect(() => {
    // Fetch cart data
    initialize();
    
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
    }
    
    // Redirect if cart is empty
    if (totalItems === 0) {
      navigate('/cart');
    }
  }, [isAuthenticated, totalItems]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const toggleSameAddress = () => {
    setUseSameAddress(!useSameAddress);
    
    if (!useSameAddress) {
      // If toggling to use same address, clear billing address
      setFormData(prev => ({
        ...prev,
        billing_address: ''
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.shipping_address.trim()) {
      errors.shipping_address = 'Shipping address is required';
    }
    
    if (!useSameAddress && !formData.billing_address.trim()) {
      errors.billing_address = 'Billing address is required';
    }
    
    if (!formData.payment_method) {
      errors.payment_method = 'Payment method is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Prepare order data
    const orderData = {
      ...formData,
      // If using same address, set billing to shipping
      billing_address: useSameAddress ? formData.shipping_address : formData.billing_address
    };
    
    try {
      const response = await placeOrder(orderData);
      
      // Clear the cart after successful order
      clearCart();
      
      // Redirect to order success page
      navigate(`/orders/${response.order.id}?success=true`);
    } catch (error) {
      console.error('Error placing order:', error);
      // Error handling is managed by the store
    }
  };
  
  if (loading) return <LoadingSpinner text="Processing your order..." />;
  
  // Calculate order summary
  const subtotal = totalPrice;
  const taxRate = 0.05; // 5% tax rate
  const taxAmount = subtotal * taxRate;
  const shippingCost = 10.00; // Flat shipping rate
  const orderTotal = subtotal + taxAmount + shippingCost;
  
  return (
    <Container className="checkout-page-container">
      <h1 className="checkout-page-title">Checkout</h1>
      
      {error && (
        <div className="checkout-error">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}
      
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={8}>
            <Card className="checkout-card">
              <Card.Header>
                <h3 className="card-title">
                  <Truck size={20} /> Shipping Information
                </h3>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-4">
                  <Form.Label>Shipping Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleInputChange}
                    isInvalid={!!validationErrors.shipping_address}
                    placeholder="Full shipping address"
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.shipping_address}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    id="same-address"
                    label="Billing address is the same as shipping address"
                    checked={useSameAddress}
                    onChange={toggleSameAddress}
                  />
                </Form.Group>
                
                {!useSameAddress && (
                  <Form.Group className="mb-4">
                    <Form.Label>Billing Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="billing_address"
                      value={formData.billing_address}
                      onChange={handleInputChange}
                      isInvalid={!!validationErrors.billing_address}
                      placeholder="Full billing address"
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.billing_address}
                    </Form.Control.Feedback>
                  </Form.Group>
                )}
              </Card.Body>
            </Card>
            
            <Card className="checkout-card mt-4">
              <Card.Header>
                <h3 className="card-title">
                  <CreditCard size={20} /> Payment Method
                </h3>
              </Card.Header>
              <Card.Body>
                <Form.Group>
                  <div className="payment-methods">
                    <div className="payment-method">
                      <Form.Check
                        type="radio"
                        id="credit-card"
                        name="payment_method"
                        value="credit_card"
                        label="Credit Card"
                        checked={formData.payment_method === 'credit_card'}
                        onChange={handleInputChange}
                        isInvalid={!!validationErrors.payment_method}
                      />
                    </div>
                    
                    <div className="payment-method">
                      <Form.Check
                        type="radio"
                        id="paypal"
                        name="payment_method"
                        value="paypal"
                        label="PayPal"
                        checked={formData.payment_method === 'paypal'}
                        onChange={handleInputChange}
                        isInvalid={!!validationErrors.payment_method}
                      />
                    </div>
                    
                    <div className="payment-method">
                      <Form.Check
                        type="radio"
                        id="bank-transfer"
                        name="payment_method"
                        value="bank_transfer"
                        label="Bank Transfer"
                        checked={formData.payment_method === 'bank_transfer'}
                        onChange={handleInputChange}
                        isInvalid={!!validationErrors.payment_method}
                      />
                    </div>
                  </div>
                  
                  {validationErrors.payment_method && (
                    <div className="text-danger mt-2">
                      {validationErrors.payment_method}
                    </div>
                  )}
                </Form.Group>
                
                {/* For demo purposes, we're not collecting actual payment details */}
                <div className="payment-notice mt-3">
                  <p>
                    <strong>Note:</strong> In a production environment, this is where you would 
                    integrate a secure payment processor like Stripe, PayPal, etc.
                  </p>
                </div>
              </Card.Body>
            </Card>
            
            <Card className="checkout-card mt-4">
              <Card.Header>
                <h3 className="card-title">Order Notes</h3>
              </Card.Header>
              <Card.Body>
                <Form.Group>
                  <Form.Label>Additional Notes (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Special instructions for delivery, etc."
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="checkout-card order-summary-card">
              <Card.Header>
                <h3 className="card-title">Order Summary</h3>
              </Card.Header>
              <Card.Body>
                <div className="order-items">
                  <h4 className="order-items-title">Items ({totalItems})</h4>
                  
                  {items.map(item => (
                    <div key={item.id} className="order-item">
                      <div className="item-info">
                        <span className="item-name">
                          {item.product.name} x {item.quantity}
                        </span>
                      </div>
                      <span className="item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="order-calculations">
                  <div className="calc-row">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="calc-row">
                    <span>Tax (5%):</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="calc-row">
                    <span>Shipping:</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="calc-row total-row">
                    <span>Total:</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="place-order-btn"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default CheckoutPage;