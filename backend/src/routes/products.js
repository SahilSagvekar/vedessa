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

// Public routes
// GET /api/products/suggestions - Get product name suggestions
router.get('/suggestions', getProductSuggestions);
// GET /api/products - Get all products with filters
router.get('/', getAllProducts);

// GET /api/products/:id - Get single product
router.get('/:id', getProductById);

// Admin routes (require authentication + admin role)
// POST /api/products - Create product (admin only)
router.post('/', auth, isAdmin, upload.array('images', 5), createProduct);

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', auth, isAdmin, upload.array('images', 5), updateProduct);

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', auth, isAdmin, deleteProduct);

module.exports = router;