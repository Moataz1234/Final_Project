// src/services/productService.js
import api from './api';

// Helper to format full image URL if needed
const formatImageUrl = (product) => {
  if (!product.image_url) return product;

  // If already a full URL, keep it
  if (product.image_url.startsWith('http://') || product.image_url.startsWith('https://')) {
    return product;
  }

  // For local development with Laravel storage
  product.image_url = `http://localhost:8000/storage/${product.image_url}`;
  return product;
};

const productService = {
  // Get all products with optional filters
  getProducts: async (filters = {}) => {
    try {
      let queryString = '';
      
      // Clean up filters and prepare for API
      const cleanFilters = {};
      Object.keys(filters).forEach(key => {
        const value = filters[key];
        
        // Skip empty values except for is_on_sale which could be "0"
        if (value === '' || value === null || value === undefined) {
          return;
        }
        
        // Handle boolean/binary values
        if (key === 'is_on_sale' || key === 'featured') {
          // Convert string "1" or "0" to actual integers for the API
          cleanFilters[key] = value === '1' || value === true ? 1 : 0;
        } else {
          cleanFilters[key] = value;
        }
      });
      
      console.log('Cleaned filters for API:', cleanFilters); // Debug log
      
      if (Object.keys(cleanFilters).length) {
        queryString = '?' + new URLSearchParams(cleanFilters).toString();
      }
      
      console.log('Final API URL:', `/products${queryString}`); // Debug log
      
      const response = await api.get(`/products${queryString}`);
      
      // Format product images in paginated responses
      if (response.data && response.data.data) {
        response.data.data = response.data.data.map(product => formatImageUrl(product));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  
  // Get product details by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      
      // Format image URL for single product
      const formattedProduct = formatImageUrl(response.data);
      
      return formattedProduct;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },
  
  // Get all product categories
  getCategories: async () => {
    try {
      const response = await api.get(`/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
  
  // Get product reviews
  getProductReviews: async (productId) => {
    try {
      const response = await api.get(`/reviews?product_id=${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error);
      throw error;
    }
  },
  
  // Get all reviews (with optional filtering)
  getReviews: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/reviews${queryString ? `?${queryString}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },
  
  // Add a product review (requires authentication)
  addProductReview: async (reviewData) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },
  
  // Update a review (requires authentication)
  updateProductReview: async (reviewId, reviewData) => {
    try {
      const response = await api.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      console.error(`Error updating review ${reviewId}:`, error);
      throw error;
    }
  },
  
  // Delete a review (requires authentication)
  deleteProductReview: async (reviewId) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting review ${reviewId}:`, error);
      throw error;
    }
  },
  
  // Approve a review (admin only)
  approveProductReview: async (reviewId) => {
    try {
      const response = await api.post(`/admin/reviews/${reviewId}/approve`);
      return response.data;
    } catch (error) {
      console.error(`Error approving review ${reviewId}:`, error);
      throw error;
    }
  },
};

export default productService;