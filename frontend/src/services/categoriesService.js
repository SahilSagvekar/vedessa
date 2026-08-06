import api from '../lib/api';

export const categoriesService = {
  // Get all categories
  getCategories: async () => {
    return await api.get('/categories');
  },

  // Get category by slug
  getCategory: async (slug) => {
    return await api.get(`/categories/${slug}`);
  },

  // Get all collections
  getCollections: async () => {
    return await api.get('/collections');
  },

  // Get collection by slug
  getCollection: async (slug) => {
    return await api.get(`/collections/${slug}`);
  },

  // Create a category (Admin) — { name, slug?, group? }
  createCategory: async (categoryData) => {
    return await api.post('/categories', categoryData);
  },

  // Update a category (Admin)
  updateCategory: async (id, categoryData) => {
    return await api.put(`/categories/${id}`, categoryData);
  },

  // Delete a category (Admin)
  deleteCategory: async (id) => {
    return await api.delete(`/categories/${id}`);
  },
};

export default categoriesService;