const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoriesController');
const { auth, isAdmin } = require('../middleware/auth');

// GET /api/categories - Get all categories
// No longer cached: category list is admin-editable now, and it's a small
// enough table that the cache wasn't buying much — freshness matters more,
// especially so admin's own edits show up immediately in their own list.
router.get('/', getAllCategories);

// GET /api/categories/:slug - Get category by slug
router.get('/:slug', getCategoryBySlug);

// Admin routes
router.post('/', auth, isAdmin, createCategory);
router.put('/:id', auth, isAdmin, updateCategory);
router.delete('/:id', auth, isAdmin, deleteCategory);

module.exports = router;