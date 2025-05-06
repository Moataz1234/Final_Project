// src/store/wishlistStore.jsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import wishlistService from '../services/wishlistService';
import useAuthStore from './authStore';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      error: null,
      
      // Initialize wishlist - call this when app loads
      initialize: async () => {
        // Skip API calls if not authenticated
        if (!useAuthStore.getState().isAuthenticated) {
          const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '{"items":[]}');
          set({
            items: localWishlist.items || [],
            loading: false
          });
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
          // Fallback to local storage
          const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '{"items":[]}');
          set({
            items: localWishlist.items || [],
            loading: false
          });
        }
      },
      
      // Add item to wishlist
      addItem: (product) => {
        const { items } = get();
        
        // Check if product already exists in wishlist
        if (!items.some(item => item.id === product.id)) {
          set({ items: [...items, product] });
        }
      },
      
      // Remove item from wishlist
      removeItem: (productId) => {
        const { items } = get();
        set({ items: items.filter(item => item.id !== productId) });
      },
      
      // Clear wishlist
      clearWishlist: () => {
        set({ items: [] });
      },
      
      // Toggle item in wishlist (add if not present, remove if present)
      toggleItem: (product) => {
        const { items } = get();
        const exists = items.some(item => item.id === product.id);
        
        if (exists) {
          set({ items: items.filter(item => item.id !== product.id) });
        } else {
          set({ items: [...items, product] });
        }
      },
      
      // Check if product is in wishlist
      isInWishlist: (productId) => {
        const { items } = get();
        return items.some(item => item.id === productId);
      },
      
      // Sync local wishlist to account after login
      syncWishlist: async () => {
        if (!useAuthStore.getState().isAuthenticated) return;
        
        const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '{"items":[]}');
        
        // Skip if local wishlist is empty
        if (!localWishlist.items || localWishlist.items.length === 0) {
          get().initialize();
          return;
        }
        
        set({ loading: true });
        
        // Add each local item to the server wishlist
        try {
          for (const item of localWishlist.items) {
            await wishlistService.addToWishlist(item.id);
          }
          
          // Get updated wishlist from server
          const items = await wishlistService.getWishlist();
          set({
            items: items || [],
            loading: false
          });
          
          // Clear local wishlist
          localStorage.setItem('wishlist', JSON.stringify({
            items: []
          }));
        } catch (error) {
          console.error('Failed to sync wishlist:', error);
          set({ loading: false });
          // Keep using local wishlist on error
        }
      }
    }),
    {
      name: 'wishlist-storage', // unique name for localStorage
    }
  )
);

export default useWishlistStore;