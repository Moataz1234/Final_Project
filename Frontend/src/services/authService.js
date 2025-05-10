// src/services/authService.js
import api from './api';

const authService = {
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                // Don't store user data
            }
            return response.data;
        } catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
    },

    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                // Don't store user data
            }
            return response.data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
            localStorage.removeItem('token');
            // Don't need to remove user as we're not storing it
        } catch (error) {
            console.error('Error during logout:', error);
            localStorage.removeItem('token');
            throw error;
        }
    },

    // Remove this method as we don't want to use cached data
    // getCurrentUser: () => { ... },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    getProfile: async () => {
        try {
            const response = await api.get('/user/profile');
            return response.data;
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
    },

    updateProfile: async (profileData) => {
        try {
            const response = await api.put('/user/profile', profileData);
            // Don't cache the updated user data
            return response.data;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }
};

export default authService;