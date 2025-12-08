import api from '../lib/api';

export const wishlistService = {
  // Get user's wishlist
  getWishlist: async () => {
    return await api.get('/wishlist');
  },

  // Add item to wishlist
  addToWishlist: async (productId) => {
    return await api.post('/wishlist', { productId });
  },

  // Remove item from wishlist
  removeFromWishlist: async (productId) => {
    return await api.delete(`/wishlist/${productId}`);
  },

  // Check if product is in wishlist
  checkWishlist: async (productId) => {
    return await api.get(`/wishlist/check/${productId}`);
  },
};

export default wishlistService;