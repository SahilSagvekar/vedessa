const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
  clearWishlist
} = require('../controllers/wishlistController');
const { auth } = require('../middleware/auth');

// All wishlist routes require authentication
router.use(auth);

// GET /api/wishlist - Get user's wishlist
router.get('/', getWishlist);

// POST /api/wishlist - Add item to wishlist
router.post('/', addToWishlist);

// GET /api/wishlist/check/:productId - Check if product in wishlist
router.get('/check/:productId', checkWishlist);

// DELETE /api/wishlist/:productId - Remove item from wishlist
router.delete('/:productId', removeFromWishlist);

// DELETE /api/wishlist - Clear wishlist (must be before /:productId route)
// router.delete('/', clearWishlist);

module.exports = router;