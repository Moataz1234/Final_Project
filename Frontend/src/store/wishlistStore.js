// src/store/wishlistStore.jsx
import { create } from 'zustand';
import wishlistService from '../services/wishlistService';
import useAuthStore from './authStore';

const useWishlistStore = create((set, get) => ({
  items: [],
  loading: false,
  error: null,
  
  // Initialize wishlist - call this when app loads
  initialize: async () => {
    // Skip API calls if not authenticated
    if (!useAuthStore.getState().isAuthenticated) {
      set({ items: [], loading: false });
      return;
    }
    
    set({ loading: true, error: null });
    try {
      const items = await wishlistService.getWishlist();
      set({
        items: items || [],
        loading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch wishlist',
        loading: false
      });
    }
  },
  
  // Add item to wishlist
  addItem: async (product) => {
    if (!useAuthStore.getState().isAuthenticated) {
      return;
    }

    set({ loading: true, error: null });
    try {
      const response = await wishlistService.addToWishlist(product.id);
      set(state => ({
        items: [...state.items, response.product],
        loading: false
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to add to wishlist',
        loading: false
      });
    }
  },
  
  // Remove item from wishlist
  removeItem: async (productId) => {
    if (!useAuthStore.getState().isAuthenticated) {
      return;
    }

    set({ loading: true, error: null });
    try {
      await wishlistService.removeFromWishlist(productId);
      set(state => ({
        items: state.items.filter(item => item.id !== productId),
        loading: false
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to remove from wishlist',
        loading: false
      });
    }
  },
  
  // Clear wishlist
  clearWishlist: async () => {
    if (!useAuthStore.getState().isAuthenticated) {
      return;
    }

    set({ loading: true, error: null });
    try {
      await wishlistService.clearWishlist();
      set({ items: [], loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to clear wishlist',
        loading: false
      });
    }
  },
  
  // Toggle item in wishlist (add if not present, remove if present)
  toggleItem: async (product) => {
    const { items } = get();
    const exists = items.some(item => item.id === product.id);
    
    if (exists) {
      await get().removeItem(product.id);
    } else {
      await get().addItem(product);
    }
  },
  
  // Check if product is in wishlist
  isInWishlist: (productId) => {
    const { items } = get();
    return items.some(item => item.id === productId);
  }
}));

export default useWishlistStore;