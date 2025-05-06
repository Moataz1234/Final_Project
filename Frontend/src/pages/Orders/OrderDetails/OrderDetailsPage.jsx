// src/pages/Orders/OrderDetailPage.jsx
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { ArrowLeft, Truck, Calendar, CreditCard, MapPin, AlertCircle } from 'lucide-react';
import useOrderStore from '../../store/orderStore';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import './OrderDetailPage.css';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentOrder, loading, error, fetchOrderDetails, cancelOrder } = useOrderStore();
  
  useEffect(() => {
    fetchOrderDetails(id);
  }, [id]);
  
  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Function to get status badge color
  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'processing':
        return <Badge bg="info">Processing</Badge>;
      case 'completed':
        return <Badge bg="success">Completed</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };
  
  // Function to handle order cancellation
  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await cancelOrder(id);
      } catch (error) {
        console.error('Error cancelling order:', error);
      }
    }
  };
  
  if (loading) return <LoadingSpinner text="Loading order details..." />;
  
  if (error) {
    return (
      <Container className="order-detail-error-container">
        <div className="order-detail-error">
          <AlertCircle size={48} />
          <h2>Error Loading Order</h2>
          <p>{error}</p>
          <div className="error-actions">
            <Button 
              variant="outline-primary" 
              onClick={() => navigate('/orders')}
            >
              Back to Orders
            </Button>
            <Button 
              variant="primary" 
              onClick={() => fetchOrderDetails(id)}
            >
              Try Again
            </Button>
          </div>
        </div>
      </Container>
    );
  }
  
  if (!currentOrder) return null;

  return (
    <Container className="order-detail-container">
      <div className="order-detail-header">
        <div>
          <Link to="/orders" className="back-link">
            <ArrowLeft size={18} /> Back to Orders
          </Link>
          <h1 className="order-detail-title">
            Order #{currentOrder.order_number}
          </h1>
        </div>
        <div className="order-status">
          {getStatusBadge(currentOrder.status)}
        </div>
      </div>
      
      <Row className="order-detail-content">
        <Col lg={8}>
          <Card className="order-info-card">
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="order-info-item">
                <Calendar size={18} />
                <div>
                  <span className="info-label">Order Date</span>
                  <span className="info-value">{formatDate(currentOrder.created_at)}</span>
                </div>
              </div>
              
              <div className="order-info-item">
                <Truck size={18} />
                <div>
                  <span className="info-label">Shipping Status</span>
                  <span className="info-value">{currentOrder.status}</span>
                </div>
              </div>
              
              <div className="order-info-item">
                <CreditCard size={18} />
                <div>
                  <span className="info-label">Payment Method</span>
                  <span className="info-value">{currentOrder.payment_method}</span>
                </div>
              </div>
              
              <div className="order-info-item">
                <CreditCard size={18} />
                <div>
                  <span className="info-label">Payment Status</span>
                  <span className="info-value">
                    <Badge bg={currentOrder.payment_status === 'paid' ? 'success' : 'warning'}>
                      {currentOrder.payment_status}
                    </Badge>
                  </span>
                </div>
              </div>
              
              {currentOrder.notes && (
                <div className="order-notes mt-3">
                  <h6>Order Notes:</h6>
                  <p>{currentOrder.notes}</p>
                </div>
              )}
            </Card.Body>
          </Card>
          
          <Card className="order-items-card mt-4">
            <Card.Header>
              <h5 className="mb-0">Order Items</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className="order-items-table mb-0">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrder.items?.map(item => (
                    <tr key={item.id}>
                      <td className="product-cell">
                        <Link to={`/products/${item.product_id}`} className="product-link">
                          <img 
                            src={item.product?.image_url || 'https://via.placeholder.com/60x60'} 
                            alt={item.product_name} 
                            className="product-image"
                          />
                          <div className="product-info">
                            <h6 className="product-name">{item.product_name}</h6>
                            {item.product?.category && (
                              <span className="product-category">{item.product.category.name}</span>
                            )}
                          </div>
                        </Link>
                      </td>
                      <td>${parseFloat(item.price).toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td className="subtotal-cell">${parseFloat(item.subtotal).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="order-total-card">
            <Card.Header>
              <h5 className="mb-0">Order Total</h5>
            </Card.Header>
            <Card.Body>
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${(parseFloat(currentOrder.total_amount) - parseFloat(currentOrder.shipping_cost) - parseFloat(currentOrder.tax_amount)).toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>${parseFloat(currentOrder.shipping_cost).toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax:</span>
                <span>${parseFloat(currentOrder.tax_amount).toFixed(2)}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total:</span>
                <span>${parseFloat(currentOrder.total_amount).toFixed(2)}</span>
              </div>
              
              {currentOrder.status === 'pending' && (
                <Button 
                  variant="danger" 
                  className="cancel-order-btn mt-3"
                  onClick={handleCancelOrder}
                >
                  Cancel Order
                </Button>
              )}
            </Card.Body>
          </Card>
          
          <Card className="shipping-address-card mt-4">
            <Card.Header>
              <h5 className="mb-0">Shipping Address</h5>
            </Card.Header>
            <Card.Body>
              <div className="address-container">
                <MapPin size={18} />
                <div>
                  <p className="address-text">{currentOrder.shipping_address}</p>
                </div>
              </div>
            </Card.Body>
          </Card>
          
          {currentOrder.billing_address && currentOrder.billing_address !== currentOrder.shipping_address && (
            <Card className="billing-address-card mt-4">
              <Card.Header>
                <h5 className="mb-0">Billing Address</h5>
              </Card.Header>
              <Card.Body>
                <div className="address-container">
                  <MapPin size={18} />
                  <div>
                    <p className="address-text">{currentOrder.billing_address}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetailPage;