import api from '../lib/api';

export const vendorService = {
    // Register as vendor
    register: async (vendorData) => {
        return await api.post('/vendors/register', vendorData);
    },

    // Get vendor profile
    getProfile: async () => {
        return await api.get('/vendors/me');
    },

    // Update vendor profile
    updateProfile: async (profileData) => {
        return await api.put('/vendors/me', profileData);
    },

    // Get vendor products
    getProducts: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.search) queryParams.append('search', params.search);

        const url = `/vendors/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return await api.get(url);
    },

    // Create product
    createProduct: async (productData) => {
        return await api.post('/vendors/products', productData);
    },

    // Update product
    updateProduct: async (productId, productData) => {
        return await api.put(`/vendors/products/${productId}`, productData);
    },

    // Delete product
    deleteProduct: async (productId) => {
        return await api.delete(`/vendors/products/${productId}`);
    },

    // Get vendor orders
    getOrders: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.status) queryParams.append('status', params.status);

        const url = `/vendors/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return await api.get(url);
    },

    // Fulfill order
    fulfillOrder: async (orderId, data) => {
        return await api.put(`/vendors/orders/${orderId}/fulfill`, data);
    },

    // Get analytics
    getAnalytics: async () => {
        return await api.get('/vendors/analytics');
    },

    // Admin: Get all vendors
    getAllVendors: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.isApproved !== undefined) queryParams.append('isApproved', params.isApproved);

        const url = `/vendors/admin/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return await api.get(url);
    },

    // Admin: Approve or Reject Vendor
    approveVendor: async (vendorId, data) => {
        return await api.put(`/vendors/admin/${vendorId}/approve`, data);
    }
};

export default vendorService;
