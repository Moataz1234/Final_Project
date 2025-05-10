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
  totalProducts: 0,
  currentPage: 1,
  filters: {
    category: '',
    min_price: '',
    max_price: '',
    search: '',
    rating: '',
    scent_type: '',
    suitable_for: '',
    is_on_sale: '',
    sort: 'name_asc',
    featured: false,
    page: 1,
    perPage: 12
  },

  fetchProducts: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      // Merge provided params with current filters
      const currentFilters = get().filters;
      const apiParams = {
        ...currentFilters,
        ...params
      };
      
      // Clean up filters - remove empty values but keep sort
      const cleanParams = {};
      Object.keys(apiParams).forEach(key => {
        const value = apiParams[key];
        // Always include sort parameter, even if it's the default
        if (key === 'sort' || (value !== '' && value !== null && value !== undefined)) {
          cleanParams[key] = value;
        }
      });
      
      console.log('Sending filters to API:', cleanParams); // Debug log
      console.log('Sort parameter specifically:', cleanParams.sort); // Debug sort
      
      const response = await productService.getProducts(cleanParams);
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      set({ 
        products: response.data || [], 
        loading: false,
        totalPages: response.last_page || 1,
        totalProducts: response.total || 0,
        currentPage: response.current_page || 1
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
    console.log('Setting filter:', newFilters); // Debug log
    
    const shouldResetPage = !newFilters.hasOwnProperty('page');
    
    set(state => ({
      filters: { 
        ...state.filters, 
        ...newFilters, 
        // Reset page to 1 unless we're changing the page itself
        page: shouldResetPage ? 1 : (newFilters.page || state.filters.page)
      }
    }));
    
    // Fetch products after setting filter
    get().fetchProducts();
  },

  resetFilters: () => {
    console.log('Resetting filters'); // Debug log
    
    set({
      filters: {
        category: '',
        min_price: '',
        max_price: '',
        search: '',
        rating: '',
        scent_type: '',
        suitable_for: '',
        is_on_sale: '',
        sort: 'name_asc',
        featured: false,
        page: 1,
        perPage: 12
      }
    });
    
    // Fetch products after resetting filters
    get().fetchProducts();
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