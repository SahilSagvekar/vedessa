const express = require('express');
const router = express.Router();
const { getAllCategories, getCategoryBySlug } = require('../controllers/categoriesController');
const { cacheControl } = require('../middleware/cache');

// GET /api/categories - Get all categories
router.get('/', cacheControl(300), getAllCategories);

// GET /api/categories/:slug - Get category by slug
router.get('/:slug', cacheControl(300), getCategoryBySlug);

module.exports = router;