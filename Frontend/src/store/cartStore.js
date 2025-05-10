// src/store/cartStore.jsx
import { create } from 'zustand';
import cartService from '../services/cartService';
import useAuthStore from './authStore';
import { showSuccessToast, showErrorToast } from '../utils/notifications';

const useCartStore = create((set, get) => ({
  items: [],
  totalItems: 0,
  totalAmount: 0,
  loading: false,
  error: null,
  initialized: false,
  
  // Initialize cart - call this when app loads or user logs in
  initialize: async () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    
    if (!isAuthenticated) {
      // Not logged in, clear cart
      set({
        items: [],
        totalItems: 0,
        totalAmount: 0,
        initialized: true
      });
      return;
    }
    
    set({ loading: true, error: null });
    try {
      const response = await cartService.getCart();
      set({
        items: response.items || [],
        totalItems: response.total_items || 0,
        totalAmount: response.total_amount || 0,
        loading: false,
        initialized: true
      });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      set({
        error: error.response?.data?.message || 'Failed to fetch cart',
        loading: false,
        initialized: true,
        items: [],
        totalItems: 0,
        totalAmount: 0
      });
    }
  },
  
  // Add item to cart (database)
  addItem: async (product, quantity = 1) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    
    if (!isAuthenticated) {
      showErrorToast('Please login to add items to cart');
      return;
    }
    
    set({ loading: true, error: null });
    try {
      await cartService.addToCart(product.id, quantity);
      // Fetch updated cart from server
      await get().fetchCart();
      showSuccessToast(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add to cart';
      set({ error: errorMessage, loading: false });
      showErrorToast(errorMessage);
    }
  },
  
  // Update item quantity (database)
  updateItemQuantity: async (productId, quantity) => {
    if (quantity <= 0) {
      return get().removeItem(productId);
    }
    
    set({ loading: true, error: null });
    try {
      // Find the cart item id
      const item = get().items.find(item => item.product_id === productId);
      if (!item) return;
      
      await cartService.updateCartItem(item.id, quantity);
      // Fetch updated cart from server
      await get().fetchCart();
      showSuccessToast('Cart updated');
    } catch (error) {
      console.error('Failed to update cart:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update cart';
      set({ error: errorMessage, loading: false });
      showErrorToast(errorMessage);
    }
  },
  
  // Remove item from cart (database)
  removeItem: async (productId) => {
    set({ loading: true, error: null });
    try {
      // Find the cart item id
      const item = get().items.find(item => item.product_id === productId);
      if (!item) return;
      
      await cartService.removeFromCart(item.id);
      // Fetch updated cart from server
      await get().fetchCart();
      showSuccessToast('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      const errorMessage = error.response?.data?.message || 'Failed to remove from cart';
      set({ error: errorMessage, loading: false });
      showErrorToast(errorMessage);
    }
  },
  
  // Clear cart (database)
  clearCart: async () => {
    set({ loading: true, error: null });
    try {
      await cartService.clearCart();
      set({
        items: [],
        totalItems: 0,
        totalAmount: 0,
        loading: false
      });
      showSuccessToast('Cart cleared');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      const errorMessage = error.response?.data?.message || 'Failed to clear cart';
      set({ error: errorMessage, loading: false });
      showErrorToast(errorMessage);
    }
  },
  
  // Fetch cart from server
  fetchCart: async () => {
    try {
      const response = await cartService.getCart();
      set({
        items: response.items || [],
        totalItems: response.total_items || 0,
        totalAmount: response.total_amount || 0,
        loading: false
      });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      throw error;
    }
  },
  
  // Check if product is in cart
  isInCart: (productId) => {
    const { items } = get();
    return items.some(item => item.product_id === productId);
  },
  
  // Get item quantity
  getItemQuantity: (productId) => {
    const { items } = get();
    const item = items.find(item => item.product_id === productId);
    return item ? item.quantity : 0;
  }
}));

export default useCartStore;