import api from '../lib/api';

const couponService = {
    /**
     * Validate a coupon code
     */
    validateCoupon: async (code: string, cartTotal: number) => {
        return api.post('/coupons/validate', { code: code.trim().toUpperCase(), cartTotal });
    },

    /**
     * Get all coupons (Admin)
     */
    getAllCoupons: async () => {
        return api.get('/coupons');
    },

    /**
     * Create a coupon (Admin)
     */
    createCoupon: async (couponData: any) => {
        return api.post('/coupons', couponData);
    },

    /**
     * Delete a coupon (Admin)
     */
    deleteCoupon: async (id: string) => {
        return api.delete(`/coupons/${id}`);
    }
};

export default couponService;
