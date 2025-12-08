const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productsController');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
// GET /api/products - Get all products with filters
router.get('/', getAllProducts);

// GET /api/products/:id - Get single product
router.get('/:id', getProductById);

// Admin routes (require authentication + admin role)
// POST /api/products - Create product (admin only)
router.post('/', auth, isAdmin, createProduct);

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', auth, isAdmin, updateProduct);

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', auth, isAdmin, deleteProduct);

module.exports = router;