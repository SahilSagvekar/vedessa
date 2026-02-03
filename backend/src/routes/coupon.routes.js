const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const {
    validateCoupon,
    getAllCoupons,
    createCoupon,
    deleteCoupon
} = require('../controllers/couponController');

// Public/User routes
router.post('/validate', validateCoupon);

// Admin routes
router.get('/', auth, isAdmin, getAllCoupons);
router.post('/', auth, isAdmin, createCoupon);
router.delete('/:id', auth, isAdmin, deleteCoupon);

module.exports = router;
