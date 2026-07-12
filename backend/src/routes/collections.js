const express = require('express');
const router = express.Router();
const { getAllCollections, getCollectionBySlug } = require('../controllers/categoriesController');
const { cacheControl } = require('../middleware/cache');

// GET /api/collections - Get all collections
router.get('/', cacheControl(300), getAllCollections);

// GET /api/collections/:slug - Get collection by slug
router.get('/:slug', cacheControl(300), getCollectionBySlug);

module.exports = router;