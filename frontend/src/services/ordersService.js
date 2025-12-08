import api from '../lib/api';

export const ordersService = {
  // Create order from cart
  createOrder: async (shippingAddress, paymentMethod = 'COD') => {
    return await api.post('/orders', {
      shippingAddress,
      paymentMethod,
    });
  },

  // Get user's orders
  getOrders: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    
    const url = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await api.get(url);
  },

  // Get single order
  getOrder: async (orderId) => {
    return await api.get(`/orders/${orderId}`);
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    return await api.put(`/orders/${orderId}/cancel`);
  },

  // Admin: Get all orders
  getAllOrders: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    
    const url = `/orders/admin/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await api.get(url);
  },

  // Admin: Update order status
  updateOrderStatus: async (orderId, status) => {
    return await api.put(`/orders/admin/${orderId}/status`, { status });
  },
};

export default ordersService;