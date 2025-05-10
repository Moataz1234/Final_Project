import api from './api';

const wishlistService = {
    getWishlist: async () => {
        try {
            const response = await api.get('/wishlist');
            return response.data;
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            throw error;
        }
    },

    addToWishlist: async (productId) => {
        try {
            const response = await api.post('/wishlist', {
                product_id: productId
            });
            return response.data;
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            throw error;
        }
    },

    removeFromWishlist: async (productId) => {
        try {
            const response = await api.delete(`/wishlist/${productId}`);
            return response.data;
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            throw error;
        }
    },

    clearWishlist: async () => {
        try {
            const response = await api.delete('/wishlist');
            return response.data;
        } catch (error) {
            console.error('Error clearing wishlist:', error);
            throw error;
        }
    }
};

export default wishlistService;
