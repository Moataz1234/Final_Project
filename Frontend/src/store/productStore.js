// src/store/productStore.js
import { create } from 'zustand';
import productService from '../services/productService';

const useProductStore = create((set, get) => ({
  products: [],
  categories: [],
  featuredProducts: [],
  currentProduct: null,
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

  fetchFeaturedProducts: async (limit = 4) => {
    set({ loading: true, error: null });
    try {
      const response = await productService.getProducts({ 
        featured: true,
        perPage: limit 
      });
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      set({ 
        featuredProducts: response.data || [], 
        loading: false 
      });
    } catch (error) {
      console.error('Error fetching featured products:', error);
      set({ 
        error: error.message || 'Failed to load featured products', 
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
        min_price: '', // Changed from minPrice
        max_price: '', // Changed from maxPrice
        search: '',
        featured: false,
        page: 1,
        perPage: 12
      }
    });
    get().fetchProducts({ reset: true });
  },
  
  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const product = await productService.getProductById(id);
      set({ currentProduct: product, loading: false });
      return product;
    } catch (error) {
      console.error('Failed to fetch product details', error);
      set({ error: error.message || 'Failed to load product details', loading: false });
      throw error;
    }
  }
}));

export default useProductStore;