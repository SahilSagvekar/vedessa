import api from '../lib/api';

const reviewService = {
    /**
     * Create a review for a product
     */
    createReview: async (productId: string, data: {
        rating: number;
        title?: string;
        comment: string;
    }) => {
        return api.post(`/reviews/product/${productId}`, data);
    },

    /**
     * Get reviews for a product
     */
    getProductReviews: async (productId: string, params?: {
        page?: number;
        limit?: number;
        rating?: number;
        sort?: 'recent' | 'oldest' | 'highest' | 'lowest' | 'helpful';
    }) => {
        return api.get(`/reviews/product/${productId}`, { params });
    },

    /**
     * Update a review
     */
    updateReview: async (reviewId: string, data: {
        rating?: number;
        title?: string;
        comment?: string;
    }) => {
        return api.put(`/reviews/${reviewId}`, data);
    },

    /**
     * Delete a review
     */
    deleteReview: async (reviewId: string) => {
        return api.delete(`/reviews/${reviewId}`);
    },

    /**
     * Mark review as helpful
     */
    markHelpful: async (reviewId: string, helpful: boolean) => {
        return api.post(`/reviews/${reviewId}/helpful`, { helpful });
    },

    /**
     * Get user's reviews
     */
    getUserReviews: async (params?: {
        page?: number;
        limit?: number;
    }) => {
        return api.get('/reviews/user/me', { params });
    },
};

export default reviewService;
