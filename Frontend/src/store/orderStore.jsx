// src/store/orderStore.jsx
import { create } from 'zustand';
import orderService from '../services/orderService';

const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  
  // Fetch all orders for the user
  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const orders = await orderService.getOrders();
      set({
        orders,
        loading: false
      });
      return orders;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch orders',
        loading: false
      });
      throw error;
    }
  },
  
  // Fetch a single order by ID
  fetchOrderDetails: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const order = await orderService.getOrderDetails(orderId);
      set({
        currentOrder: order,
        loading: false
      });
      return order;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch order details',
        loading: false
      });
      throw error;
    }
  },
  
  // Place a new order
  placeOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      const response = await orderService.placeOrder(orderData);
      set({
        currentOrder: response.order,
        loading: false
      });
      
      // Add the new order to the orders list
      set(state => ({
        orders: [response.order, ...state.orders]
      }));
      
      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to place order',
        loading: false
      });
      throw error;
    }
  },
  
  // Cancel an order
  cancelOrder: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const response = await orderService.cancelOrder(orderId);
      
      // Update the order in the orders list
      set(state => ({
        orders: state.orders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'cancelled' } 
            : order
        ),
        currentOrder: state.currentOrder?.id === orderId 
          ? { ...state.currentOrder, status: 'cancelled' } 
          : state.currentOrder,
        loading: false
      }));
      
      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to cancel order',
        loading: false
      });
      throw error;
    }
  },
  
  // Clear error
  clearError: () => {
    set({ error: null });
  }
}));

export default useOrderStore;