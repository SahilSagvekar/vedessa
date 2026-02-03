const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
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
router.post('/register', vendorController.registerVendor);

// Protected routes - Vendor only
router.use(auth);
router.use(restrictTo('VENDOR', 'ADMIN'));

// Vendor profile
router.get('/me', vendorController.getMyProfile);
router.put('/me', vendorController.updateMyProfile);

// Vendor products
router.get('/products', vendorController.getMyProducts);
router.post('/products', upload.single('image'), vendorController.createProduct);
router.put('/products/:id', upload.single('image'), vendorController.updateProduct);
router.delete('/products/:id', vendorController.deleteProduct);

// Vendor orders
router.get('/orders', vendorController.getMyOrders);
router.put('/orders/:id/fulfill', vendorController.fulfillOrder);

// Analytics
router.get('/analytics', vendorController.getAnalytics);

// Admin only routes
router.get('/admin/all', restrictTo('ADMIN'), vendorController.getAllVendors);
router.put('/admin/:id/approve', restrictTo('ADMIN'), vendorController.approveVendor);

module.exports = router;
