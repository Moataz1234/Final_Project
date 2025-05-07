// src/store/productStore.js
import { create } from 'zustand';
import productService from '../services/productService';

const useProductStore = create((set, get) => ({
  products: [],
  categories: [],
  loading: false,
  error: null,
  totalPages: 1,
  filters: {
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    featured: false,
    page: 1,
    perPage: 12
  },

  fetchProducts: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      // If reset flag is passed, reset filters first
      if (params.reset) {
        set({
          filters: {
            ...get().filters,
            category: '',
            minPrice: '',
            maxPrice: '',
            search: '',
            page: 1
          }
        });
      }
      
      // Merge provided params with current filters
      const currentFilters = params.reset ? 
        { page: 1, perPage: get().filters.perPage } : 
        get().filters;
        
      const apiParams = {
        ...currentFilters,
        ...params
      };
      
      const response = await productService.getProducts(apiParams);
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      set({ 
        products: response.data || [], 
        loading: false,
        totalPages: response.last_page || 1
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ 
        error: error.message || 'Failed to load products', 
        loading: false 
      });
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await productService.getCategories();
      set({ categories: categories || [] });
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  },

  setFilter: (newFilters) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters, page: 1 }
    }));
    get().fetchProducts();
  },

  resetFilters: () => {
    set({
      filters: {
        category: '',
        minPrice: '',
        maxPrice: '',
        search: '',
        featured: false,
        page: 1,
        perPage: 12
      }
    });
    get().fetchProducts({ reset: true });
  }
}));

export default useProductStore;