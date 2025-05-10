// src/store/wishlistStore.js
import { create } from 'zustand';
import api from '../services/api';

const useWishlistStore = create((set, get) => ({
  items: [],
  loading: false,
  error: null,
  initialized: false,
  
  // Initialize wishlist from server
  initialize: async () => {
    if (get().initialized) return; // Prevent multiple initializations
    
    set({ loading: true, error: null });
    try {
      const response = await api.get('/wishlist');
      set({
        items: response.data.data || response.data || [],
        loading: false,
        initialized: true
      });
    } catch (error) {
      console.error('Failed to initialize wishlist:', error);
      set({
        error: error.response?.data?.message || 'Failed to load wishlist',
        loading: false,
        initialized: true
      });
    }
  },
  
  // Fetch wishlist from server
  fetchWishlist: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/wishlist');
      set({
        items: response.data.data || response.data || [],
        loading: false
      });
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      set({
        error: error.response?.data?.message || 'Failed to load wishlist',
        loading: false
      });
    }
  },
  
  // Add item to wishlist
  addItem: async (product) => {
    set({ loading: true, error: null });
    try {
      await api.post('/wishlist', { product_id: product.id });
      // Fetch fresh wishlist from server
      await get().fetchWishlist();
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      set({
        error: error.response?.data?.message || 'Failed to add to wishlist',
        loading: false
      });
    }
  },
  
  // Remove item from wishlist
  removeItem: async (productId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/wishlist/${productId}`);
      // Fetch fresh wishlist from server
      await get().fetchWishlist();
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      set({
        error: error.response?.data?.message || 'Failed to remove from wishlist',
        loading: false
      });
    }
  },
  
  // Clear wishlist (for logout)
  clearWishlist: () => {
    set({
      items: [],
      initialized: false
    });
  },
  
  // Check if an item is in wishlist
  isInWishlist: (productId) => {
    return get().items.some(item => item.product_id === productId);
  }
}));

export default useWishlistStore;