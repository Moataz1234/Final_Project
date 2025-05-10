import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  response => {
    // Transform product data to fix stock handling
    if (response.data && 
        (response.config.url.includes('/products/') || 
         response.config.url.includes('/products?'))) {
      
      console.log('API response data:', response.data);
      
      // If this is a product detail response
      if (response.data && !response.data.data && response.data.id) {
        response.data.in_stock = response.data.stock > 0;
      }
      
      // If this is a paginated product list
      if (response.data && response.data.data) {
        response.data.data = response.data.data.map(product => {
          return {
            ...product,
            in_stock: product.stock > 0
          };
        });
      }
    }
    
    return response;
  },
  error => {
    if (error.response) {
      // Server returned an error response
      const status = error.response.status;
      
      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        Cookies.remove('token');
        window.location.href = '/login';
      }
      
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      // No response was received from the server
      console.error('No response received:', error.request);
    } else {
      // Error setting up the request
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;