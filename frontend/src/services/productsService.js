import api from '../lib/api';

export const productsService = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.category) queryParams.append('category', params.category);
    if (params.collection) queryParams.append('collection', params.collection);
    if (params.isNew !== undefined) queryParams.append('isNew', params.isNew);
    if (params.isBestseller !== undefined) queryParams.append('isBestseller', params.isBestseller);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice);
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    
    const url = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await api.get(url);
  },

  // Get single product
  getProduct: async (id) => {
    return await api.get(`/products/${id}`);
  },

  // Create product (admin only)
  createProduct: async (productData) => {
    return await api.post('/products', productData);
  },

  // Update product (admin only)
  updateProduct: async (id, productData) => {
    return await api.put(`/products/${id}`, productData);
  },

  // Delete product (admin only)
  deleteProduct: async (id) => {
    return await api.delete(`/products/${id}`);
  },
};

export default productsService;