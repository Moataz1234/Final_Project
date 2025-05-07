// src/store/authStore.jsx
import { create } from 'zustand';
import authService from '../services/authService';

const useAuthStore = create((set, get) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  loading: false,
  error: null,
  
  // Register a new user
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.register(userData);
      set({
        user: response.user,
        isAuthenticated: true,
        loading: false
      });
      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Registration failed',
        loading: false
      });
      throw error;
    }
  },
  
  // Login user
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.login(credentials);
      set({
        user: response.user,
        isAuthenticated: true,
        loading: false
      });
      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Login failed',
        loading: false
      });
      throw error;
    }
  },
  
  // Logout user
  logout: async () => {
    set({ loading: true });
    try {
      await authService.logout();
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Logout failed',
        loading: false
      });
      throw error;
    }
  },
  
  // Get user profile
  fetchProfile: async () => {
    if (!get().isAuthenticated) return;
    
    set({ loading: true, error: null });
    try {
      const user = await authService.getProfile();
      set({ user, loading: false });
      return user;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch profile',
        loading: false
      });
      throw error;
    }
  },
  
  // Update user profile
  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.updateProfile(profileData);
      set({
        user: response.user,
        loading: false
      });
      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update profile',
        loading: false
      });
      throw error;
    }
  },
  
  // Clear any errors
  clearError: () => {
    set({ error: null });
  }
}));

export default useAuthStore;