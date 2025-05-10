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
      
      if (Object.keys(filters).length) {
        queryString = '?' + new URLSearchParams(filters).toString();
      }
      
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
      const response = await api.get(`/products/${productId}/reviews`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error);
      throw error;
    }
  },
  
  // Add a product review (requires authentication)
  addProductReview: async (productId, reviewData) => {
    try {
      const response = await api.post(
        `/reviews`, 
        { product_id: productId, ...reviewData }
      );
      return response.data;
    } catch (error) {
      console.error(`Error adding review for product ${productId}:`, error);
      throw error;
    }
  },
};

export default productService;