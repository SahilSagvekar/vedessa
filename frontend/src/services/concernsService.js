import api from '../lib/api';

export const concernsService = {
  // Get all concerns
  getConcerns: async () => {
    return await api.get('/concerns');
  },

  // Get concern by slug
  getConcern: async (slug) => {
    return await api.get(`/concerns/${slug}`);
  },

  // Create a concern (Admin) — { name, slug? }
  createConcern: async (concernData) => {
    return await api.post('/concerns', concernData);
  },

  // Update a concern (Admin)
  updateConcern: async (id, concernData) => {
    return await api.put(`/concerns/${id}`, concernData);
  },

  // Delete a concern (Admin)
  deleteConcern: async (id) => {
    return await api.delete(`/concerns/${id}`);
  },
};

export default concernsService;
