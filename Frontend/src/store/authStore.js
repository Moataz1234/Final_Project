// src/store/authStore.jsx
import { create } from 'zustand';
import authService from '../services/authService';
import { showSuccessToast, showErrorToast } from '../utils/notifications';

const useAuthStore = create((set, get) => ({
  user: null, // Don't initialize from localStorage
  isAuthenticated: false, // Don't initialize from localStorage
  loading: true, // Start with loading true
  error: null,
  
  // Initialize auth state by checking with server
  initializeAuth: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ user: null, isAuthenticated: false, loading: false });
        return;
      }
      
      // Verify token with server and get user data
      const user = await authService.getProfile();
      set({
        user,
        isAuthenticated: true,
        loading: false
      });
    } catch (error) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });
    }
  },
  
  // Login user
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.login(credentials);
      // Only store the token, not the user data
      localStorage.setItem('token', response.access_token);
      
      // Fetch fresh user data from server
      const user = await authService.getProfile();
      set({
        user,
        isAuthenticated: true,
        loading: false
      });
      showSuccessToast(`Welcome back, ${user.name}!`);
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({
        error: errorMessage,
        loading: false
      });
      showErrorToast(errorMessage);
      throw error;
    }
  },
  
  // Logout user
  logout: async () => {
    set({ loading: true });
    try {
      await authService.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // Remove cached user data
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });
      showSuccessToast('You have been logged out successfully');
    } catch (error) {
      // Even if logout fails, clear local data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({
        user: null,
        isAuthenticated: false,
        loading: false
      });
      showErrorToast('Logout completed');
    }
  },
  
  // Fetch fresh user data from server
  refreshUserData: async () => {
    if (!get().isAuthenticated) return;
    
    try {
      const user = await authService.getProfile();
      set({ user });
      return user;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
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
      const errorMessage = error.response?.data?.message || 'Failed to fetch profile';
      set({
        error: errorMessage,
        loading: false
      });
      showErrorToast(errorMessage);
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
      showSuccessToast('Your profile has been updated successfully');
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      set({
        error: errorMessage,
        loading: false
      });
      showErrorToast(errorMessage);
      throw error;
    }
  },
  
  // Clear any errors
  clearError: () => {
    set({ error: null });
  }
}));

export default useAuthStore;