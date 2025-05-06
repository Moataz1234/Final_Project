// src/pages/Orders/OrdersPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Table, Badge, Button, Tab, Tabs } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Calendar, Package, Info, ArrowRight } from 'lucide-react';
import useOrderStore from '../../../store/orderStore';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import './OrdersPage.css';

const OrdersPage = () => {
  const { orders, loading, error, fetchOrders } = useOrderStore();
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
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
  
  // Filter orders based on status
  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);
  
  if (loading) return <LoadingSpinner text="Loading your orders..." />;
  
  if (error) {
    return (
      <Container className="orders-error-container">
        <div className="orders-error">
          <h2>Error Loading Orders</h2>
          <p>{error}</p>
          <Button 
            variant="primary" 
            onClick={() => fetchOrders()}
          >
            Try Again
          </Button>
        </div>
      </Container>
    );
  }
  
  if (orders.length === 0) {
    return (
      <Container className="orders-empty-container">
        <div className="orders-empty">
          <Package size={64} />
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet.</p>
          <Link to="/products">
            <Button variant="primary">
              Browse Products
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="orders-page-container">
      <h1 className="orders-page-title">My Orders</h1>
      
      <Tabs
        activeKey={filter}
        onSelect={(k) => setFilter(k)}
        className="orders-tabs mb-4"
      >
        <Tab eventKey="all" title="All Orders" />
        <Tab eventKey="pending" title="Pending" />
        <Tab eventKey="processing" title="Processing" />
        <Tab eventKey="completed" title="Completed" />
        <Tab eventKey="cancelled" title="Cancelled" />
      </Tabs>
      
      {filteredOrders.length === 0 ? (
        <div className="filtered-orders-empty">
          <p>No {filter !== 'all' ? filter : ''} orders found.</p>
        </div>
      ) : (
        <Table responsive className="orders-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Payment</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>
                  <Link to={`/orders/${order.id}`} className="order-number-link">
                    {order.order_number}
                  </Link>
                </td>
                <td>
                  <div className="order-date">
                    <Calendar size={16} />
                    <span>{formatDate(order.created_at)}</span>
                  </div>
                </td>
                <td>{getStatusBadge(order.status)}</td>
                <td className="order-total">${parseFloat(order.total_amount).toFixed(2)}</td>
                <td>
                  <Badge bg={order.payment_status === 'paid' ? 'success' : 'warning'}>
                    {order.payment_status}
                  </Badge>
                </td>
                <td>
                  <Link to={`/orders/${order.id}`} className="order-details-link">
                    <Info size={16} />
                    <span className="d-none d-md-inline">Details</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default OrdersPage;