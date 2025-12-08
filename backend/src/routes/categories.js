const express = require('express');
const router = express.Router();
const { getAllCategories, getCategoryBySlug } = require('../controllers/categoriesController');

// GET /api/categories - Get all categories
router.get('/', getAllCategories);

// GET /api/categories/:slug - Get category by slug
router.get('/:slug', getCategoryBySlug);

module.exports = router;