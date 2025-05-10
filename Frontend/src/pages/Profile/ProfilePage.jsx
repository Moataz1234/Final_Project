// src/pages/Profile/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { User, Map, ShoppingBag, Heart, LogOut } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useUserStore from '../../store/userStore';
import LoadingSpinner from '../../components/UI/LoadingSpinner/LoadingSpinner';
// import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { 
    profileData, 
    loading, 
    error, 
    fetchProfile, 
    updateProfile, 
    clearError 
  } = useUserStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/profile');
      return;
    }
    
    fetchProfile();
  }, [isAuthenticated, navigate, fetchProfile]);
  
  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        address: profileData.address || ''
      });
    }
  }, [profileData]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) clearError();
    if (updateSuccess) setUpdateSuccess(false);
  };
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    
    // Reset form if canceling edit
    if (isEditing && profileData) {
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        address: profileData.address || ''
      });
    }
    
    if (error) clearError();
    if (updateSuccess) setUpdateSuccess(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateProfile(formData);
      setIsEditing(false);
      setUpdateSuccess(true);
    } catch (err) {
      // Error is handled in the store and displayed below
      console.error('Failed to update profile:', err);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
  
  // Show spinner while loading
  if (loading && !profileData) {
    return <LoadingSpinner text="Loading your profile..." />;
  }
  
  // Redirect if not authenticated (handled in useEffect)
  if (!isAuthenticated) return null;

  return (
    <Container className="profile-page-container">
      <h1 className="profile-page-title">My Profile</h1>
      
      <Row>
        <Col lg={4} className="mb-4">
          <Card className="profile-sidebar">
            <div className="profile-avatar">
              <div className="avatar-circle">
                <User size={48} />
              </div>
              <h3>{user?.name || 'User'}</h3>
              <p>{user?.email || ''}</p>
            </div>
            
            <div className="profile-menu">
              <Button 
                variant="link" 
                className="profile-menu-item active"
                onClick={() => navigate('/profile')}
              >
                <User size={16} />
                <span>Personal Information</span>
              </Button>
              
              <Button 
                variant="link" 
                className="profile-menu-item"
                onClick={() => navigate('/orders')}
              >
                <ShoppingBag size={16} />
                <span>My Orders</span>
              </Button>
              
              <Button 
                variant="link" 
                className="profile-menu-item"
                onClick={() => navigate('/wishlist')}
              >
                <Heart size={16} />
                <span>Wishlist</span>
              </Button>
              
              <Button 
                variant="link" 
                className="profile-menu-item"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card className="profile-info-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Personal Information</h3>
              <Button 
                variant={isEditing ? "outline-secondary" : "outline-primary"}
                onClick={handleEditToggle}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </Card.Header>
            
            <Card.Body>
              {error && (
                <Alert variant="danger" onClose={clearError} dismissible>
                  {error}
                </Alert>
              )}
              
              {updateSuccess && (
                <Alert variant="success" onClose={() => setUpdateSuccess(false)} dismissible>
                  Profile updated successfully!
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Form.Group>
                
                {isEditing && (
                  <div className="text-end">
                    <Button 
                      variant="primary" 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;