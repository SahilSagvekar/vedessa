import api from '../lib/api';

export const cartService = {
  // Get user's cart
  getCart: async () => {
    return await api.get('/cart');
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    return await api.post('/cart', { productId, quantity });
  },

  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    return await api.put(`/cart/${itemId}`, { quantity });
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    return await api.delete(`/cart/${itemId}`);
  },

  // Clear entire cart
  clearCart: async () => {
    return await api.delete('/cart');
  },
};

export default cartService;