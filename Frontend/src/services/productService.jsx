// src/services/productService.js
import api from './api';

const productService = {
    getProducts: async (params = {}) => {
        try {
            // Map frontend filter structure to backend expected structure
            const apiParams = {
                per_page: params.perPage || 12,
                page: params.page || 1
            };

            // Add search filter if present
            if (params.search) {
                apiParams.search = params.search;
            }

            // Add category filter if present
            if (params.category) {
                apiParams.category = params.category;
            }

            // Add price range filters if present
            if (params.minPrice) {
                apiParams.min_price = params.minPrice;
            }

            if (params.maxPrice) {
                apiParams.max_price = params.maxPrice;
            }

            // Add featured filter if present
            if (params.featured !== undefined) {
                apiParams.featured = params.featured;
            }

            const response = await api.get('/products', { params: apiParams });

            // Transform price to float for consistency
            const transformedData = {
                ...response.data,
                data: response.data.data.map(product => ({
                    ...product,
                    price: parseFloat(product.price)
                }))
            };

            return transformedData;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    getProductById: async (id) => {
        try {
            const response = await api.get(`/products/${id}`);
            return {
                ...response.data,
                price: parseFloat(response.data.price)
            };
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    getCategories: async () => {
        try {
            const response = await api.get('/categories');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }
};

export default productService;