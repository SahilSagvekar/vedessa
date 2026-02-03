const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');
const { auth, isAdmin } = require('../middleware/auth');

// Create shipment (Admin only)
router.post('/create', auth, isAdmin, shippingController.createShipment);

// Track shipment (Public - anyone with AWB can track)
router.get('/track/:awbNumber', shippingController.trackShipment);

// Calculate shipping rate (Public)
router.post('/calculate-rate', shippingController.calculateRate);

// Schedule pickup (Admin only)
router.post('/schedule-pickup', auth, isAdmin, shippingController.schedulePickup);

// Cancel shipment (Admin only)
router.post('/cancel/:orderId', auth, isAdmin, shippingController.cancelShipment);

// Generate shipping label (Admin only)
router.get('/label/:orderId', auth, isAdmin, shippingController.generateLabel);

// Get all shipments (Admin only)
router.get('/all', auth, isAdmin, shippingController.getAllShipments);

module.exports = router;
