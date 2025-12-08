const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/ordersController');
const { auth, isAdmin } = require('../middleware/auth');

// Customer routes (require authentication)
router.post('/', auth, createOrder);
router.get('/', auth, getOrders);
router.get('/:id', auth, getOrderById);
router.put('/:id/cancel', auth, cancelOrder);

// Admin routes (require authentication + admin role)
router.get('/admin/all', auth, isAdmin, getAllOrders);
router.put('/admin/:id/status', auth, isAdmin, updateOrderStatus);

module.exports = router;