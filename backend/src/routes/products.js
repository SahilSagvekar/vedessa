const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductSuggestions
} = require('../controllers/productsController');
const { auth, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { cacheControl } = require('../middleware/cache');

// Public routes
// GET /api/products/suggestions - Get product name suggestions
router.get('/suggestions', cacheControl(60), getProductSuggestions);
// GET /api/products - Get all products with filters
router.get('/', cacheControl(60), getAllProducts);

// GET /api/products/:id - Get single product
router.get('/:id', cacheControl(60), getProductById);

// Admin routes (require authentication + admin role)
// POST /api/products - Create product (admin only)
router.post('/', auth, isAdmin, upload.array('media', 8), createProduct);

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', auth, isAdmin, upload.array('media', 8), updateProduct);

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', auth, isAdmin, deleteProduct);

module.exports = router;