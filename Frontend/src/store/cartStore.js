// src/store/cartStore.jsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import cartService from '../services/cartService';
import useAuthStore from './authStore';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalAmount: 0,
      loading: false,
      error: null,
      
      // Initialize cart - call this when app loads
      initialize: async () => {
        // Skip API calls if not authenticated
        if (!useAuthStore.getState().isAuthenticated) {
          const localCart = JSON.parse(localStorage.getItem('cart') || '{"items":[],"totalItems":0,"totalAmount":0}');
          set({
            items: localCart.items || [],
            totalItems: localCart.totalItems || 0,
            totalAmount: localCart.totalAmount || 0
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
            loading: false
          });
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Failed to fetch cart',
            loading: false
          });
          // Fallback to local storage
          const localCart = JSON.parse(localStorage.getItem('cart') || '{"items":[],"totalItems":0,"totalAmount":0}');
          set({
            items: localCart.items || [],
            totalItems: localCart.totalItems || 0,
            totalAmount: localCart.totalAmount || 0
          });
        }
      },
      
      // Add item to cart
      addItem: (product, quantity = 1) => {
        const { items } = get();
        
        // Check if item already exists in cart
        const existingItemIndex = items.findIndex(item => item.id === product.id);
        
        if (existingItemIndex > -1) {
          // Item exists, update quantity
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += quantity;
          
          set({
            items: updatedItems,
            ...calculateTotals(updatedItems)
          });
        } else {
          // Item doesn't exist, add new item
          const newItem = {
            ...product,
            quantity
          };
          
          set({
            items: [...items, newItem],
            ...calculateTotals([...items, newItem])
          });
        }
      },
      
      // Update item quantity
      updateItemQuantity: (productId, quantity) => {
        const { items } = get();
        
        if (quantity <= 0) {
          return get().removeItem(productId);
        }
        
        const updatedItems = items.map(item => 
          item.id === productId ? { ...item, quantity } : item
        );
        
        set({
          items: updatedItems,
          ...calculateTotals(updatedItems)
        });
      },
      
      // Remove item from cart
      removeItem: (productId) => {
        const { items } = get();
        const updatedItems = items.filter(item => item.id !== productId);
        
        set({
          items: updatedItems,
          ...calculateTotals(updatedItems)
        });
      },
      
      // Clear cart
      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalAmount: 0
        });
      },
      
      // Check if product is in cart
      isInCart: (productId) => {
        const { items } = get();
        return items.some(item => item.id === productId);
      },
      
      // Get item quantity
      getItemQuantity: (productId) => {
        const { items } = get();
        const item = items.find(item => item.id === productId);
        return item ? item.quantity : 0;
      },
      
      // Sync local cart to account after login
      syncCart: async () => {
        if (!useAuthStore.getState().isAuthenticated) return;
        
        const localCart = JSON.parse(localStorage.getItem('cart') || '{"items":[],"totalItems":0,"totalAmount":0}');
        
        // Skip if local cart is empty
        if (!localCart.items || localCart.items.length === 0) {
          get().initialize();
          return;
        }
        
        set({ loading: true });
        
        // Add each local item to the server cart
        try {
          for (const item of localCart.items) {
            await cartService.addToCart(item.product_id, item.quantity);
          }
          
          // Get updated cart from server
          const response = await cartService.getCart();
          set({
            items: response.items || [],
            totalItems: response.total_items || 0,
            totalAmount: response.total_amount || 0,
            loading: false
          });
          
          // Clear local cart
          localStorage.setItem('cart', JSON.stringify({
            items: [],
            totalItems: 0,
            totalAmount: 0
          }));
        } catch (error) {
          console.error('Failed to sync cart:', error);
          set({ loading: false });
          // Keep using local cart on error
        }
      }
    }),
    {
      name: 'cart-storage', // unique name for localStorage
    }
  )
);

// Helper function to calculate cart totals
const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    return sum + (price * item.quantity);
  }, 0);
  
  return { totalItems, totalAmount };
};

export default useCartStore;