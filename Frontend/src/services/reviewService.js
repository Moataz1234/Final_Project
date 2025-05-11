// src/services/reviewService.js
import api from './api';

const reviewService = {
    getReviews: async (productId = null) => {
        try {
            const params = productId ? { product_id: productId } : {};
            const response = await api.get('/reviews', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching reviews:', error);
            throw error;
        }
    },

    addReview: async (productId, rating, review = null) => {
        try {
            const response = await api.post('/reviews', {
                product_id: productId,
                rating: rating,
                review: review
            });
            return response.data;
        } catch (error) {
            console.error('Error adding review:', error);
            throw error;
        }
    },

    updateReview: async (reviewId, rating, review = null) => {
        try {
            const response = await api.put(`/reviews/${reviewId}`, {
                rating: rating,
                review: review
            });
            return response.data;
        } catch (error) {
            console.error('Error updating review:', error);
            throw error;
        }
    },

    deleteReview: async (reviewId) => {
        try {
            const response = await api.delete(`/reviews/${reviewId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    },

    approveReview: async (reviewId) => {
        try {
            const response = await api.post(`/admin/reviews/${reviewId}/approve`);
            return response.data;
        } catch (error) {
            console.error('Error approving review:', error);
            throw error;
        }
    }
};

export default reviewService;