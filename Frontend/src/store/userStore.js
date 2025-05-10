// src/store/userStore.js
import { create } from 'zustand';
import api from '../services/api';

const useUserStore = create((set, get) => ({
  profileData: null,
  addresses: [],
  loading: false,
  error: null,
  
  // Fetch user profile data
  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/user/profile');
      set({ 
        profileData: response.data,
        loading: false 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
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
      const response = await api.put('/user/profile', profileData);
      set({ 
        profileData: response.data.user,
        loading: false 
      });
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to update profile',
        loading: false 
      });
      throw error;
    }
  },
  
  // Fetch user addresses
  fetchAddresses: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/user/addresses');
      set({ 
        addresses: response.data,
        loading: false 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching addresses:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch addresses',
        loading: false 
      });
      throw error;
    }
  },
  
  // Add new address
  addAddress: async (addressData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/user/addresses', addressData);
      set(state => ({ 
        addresses: [...state.addresses, response.data],
        loading: false 
      }));
      return response.data;
    } catch (error) {
      console.error('Error adding address:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to add address',
        loading: false 
      });
      throw error;
    }
  },
  
  // Update address
  updateAddress: async (addressId, addressData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/user/addresses/${addressId}`, addressData);
      set(state => ({ 
        addresses: state.addresses.map(addr => 
          addr.id === addressId ? response.data : addr
        ),
        loading: false 
      }));
      return response.data;
    } catch (error) {
      console.error('Error updating address:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to update address',
        loading: false 
      });
      throw error;
    }
  },
  
  // Delete address
  deleteAddress: async (addressId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/user/addresses/${addressId}`);
      set(state => ({ 
        addresses: state.addresses.filter(addr => addr.id !== addressId),
        loading: false 
      }));
    } catch (error) {
      console.error('Error deleting address:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to delete address',
        loading: false 
      });
      throw error;
    }
  },
  
  // Set default address
  setDefaultAddress: async (addressId) => {
    set({ loading: true, error: null });
    try {
      await api.post(`/user/addresses/${addressId}/default`);
      set(state => ({ 
        addresses: state.addresses.map(addr => ({
          ...addr,
          is_default: addr.id === addressId
        })),
        loading: false 
      }));
    } catch (error) {
      console.error('Error setting default address:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to set default address',
        loading: false 
      });
      throw error;
    }
  },
  
  // Clear errors
  clearError: () => set({ error: null })
}));

export default useUserStore;