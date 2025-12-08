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
};

export default categoriesService;