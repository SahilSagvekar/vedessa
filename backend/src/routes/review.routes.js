const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
    markHelpful,
    getUserReviews,
} = require('../controllers/reviewController');

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes (require authentication)
router.post('/product/:productId', auth, createReview);
router.put('/:id', auth, updateReview);
router.delete('/:id', auth, deleteReview);
router.post('/:id/helpful', auth, markHelpful);
router.get('/user/me', auth, getUserReviews);

module.exports = router;
