const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const {
    getAllVendors,
    getVendorById,
    approveVendor,
    rejectVendor,
    getVendorStats
} = require('../controllers/adminController');

// All routes require admin authentication
router.use(authenticate);
router.use(requireRole('ADMIN'));

// Vendor management routes
router.get('/vendors', getAllVendors);
router.get('/vendors/stats', getVendorStats);
router.get('/vendors/:id', getVendorById);
router.put('/vendors/:id/approve', approveVendor);
router.put('/vendors/:id/reject', rejectVendor);

module.exports = router;
