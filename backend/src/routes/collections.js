const express = require('express');
const router = express.Router();
const { getAllCollections, getCollectionBySlug } = require('../controllers/categoriesController');

// GET /api/collections - Get all collections
router.get('/', getAllCollections);

// GET /api/collections/:slug - Get collection by slug
router.get('/:slug', getCollectionBySlug);

module.exports = router;