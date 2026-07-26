const express = require('express');
const router = express.Router();
const vendorAuthController = require('../controllers/vendorAuthController');
const vendorProfileController = require('../controllers/vendorProfileController');
const vendorProductController = require('../controllers/vendorProductController');
const vendorOrderController = require('../controllers/vendorOrderController');
const vendorAdminController = require('../controllers/vendorAdminController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Helper function to restrict access to specific roles
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action'
            });
        }
        next();
    };
};

// Public routes
router.post('/register', vendorAuthController.registerVendor);

// Protected routes - Vendor only
router.use(auth);
router.use(restrictTo('VENDOR', 'ADMIN'));

// Vendor profile
router.get('/me', vendorProfileController.getMyProfile);
router.put('/me', vendorProfileController.updateMyProfile);

// Vendor products
router.get('/products', vendorProductController.getMyProducts);
router.post('/products', upload.array('media', 8), vendorProductController.createProduct);
router.put('/products/:id', upload.array('media', 8), vendorProductController.updateProduct);
router.delete('/products/:id', vendorProductController.deleteProduct);

// Vendor orders
router.get('/orders', vendorOrderController.getMyOrders);
router.put('/orders/:id/fulfill', vendorOrderController.fulfillOrder);

// Analytics
router.get('/analytics', vendorOrderController.getAnalytics);

// Admin only routes
router.get('/admin/all', restrictTo('ADMIN'), vendorAdminController.getAllVendors);
router.put('/admin/:id/approve', restrictTo('ADMIN'), vendorAdminController.approveVendor);

module.exports = router;
