const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');
const { auth, isAdmin } = require('../middleware/auth');

// Track shipment by AWB or order number (Public)
router.get('/track/:reference', shippingController.trackShipment);

// Get all shipments (Admin only)
router.get('/all', auth, isAdmin, shippingController.getAllShipments);

// Manually set/update an order's AWB + tracking URL (Admin only)
router.put('/:orderId', auth, isAdmin, shippingController.updateShipping);

// Cancel a shipment (Admin only)
router.put('/cancel/:orderId', auth, isAdmin, shippingController.cancelShipment);

module.exports = router;
