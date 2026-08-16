const express = require('express');
const router = express.Router();
const {
  getAllConcerns,
  getConcernBySlug,
  createConcern,
  updateConcern,
  deleteConcern
} = require('../controllers/concernsController');
const { auth, isAdmin } = require('../middleware/auth');

// GET /api/concerns - Get all concerns
router.get('/', getAllConcerns);

// GET /api/concerns/:slug - Get concern by slug
router.get('/:slug', getConcernBySlug);

// Admin routes
router.post('/', auth, isAdmin, createConcern);
router.put('/:id', auth, isAdmin, updateConcern);
router.delete('/:id', auth, isAdmin, deleteConcern);

module.exports = router;
