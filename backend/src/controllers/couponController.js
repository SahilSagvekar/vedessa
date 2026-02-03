const prisma = require('../config/database');
const logger = require('../config/logger');

/**
 * Validate a coupon code
 * POST /api/coupons/validate
 */
exports.validateCoupon = async (req, res) => {
    try {
        const { code, cartTotal } = req.body;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code is required'
            });
        }

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Invalid coupon code'
            });
        }

        // Check if active
        if (!coupon.isActive) {
            return res.status(400).json({
                success: false,
                message: 'This coupon is no longer active'
            });
        }

        // Check dates
        const now = new Date();
        if (now < coupon.startDate) {
            return res.status(400).json({
                success: false,
                message: 'This coupon is not yet valid'
            });
        }

        if (coupon.endDate && now > coupon.endDate) {
            return res.status(400).json({
                success: false,
                message: 'This coupon has expired'
            });
        }

        // Check usage limit
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({
                success: false,
                message: 'This coupon usage limit has been reached'
            });
        }

        // Check minimum order amount
        if (cartTotal < parseFloat(coupon.minOrderAmount)) {
            return res.status(400).json({
                success: false,
                message: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`
            });
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = (cartTotal * parseFloat(coupon.discountValue)) / 100;
            if (coupon.maxDiscountAmount && discountAmount > parseFloat(coupon.maxDiscountAmount)) {
                discountAmount = parseFloat(coupon.maxDiscountAmount);
            }
        } else {
            discountAmount = parseFloat(coupon.discountValue);
        }

        // Ensure discount doesn't exceed total
        discountAmount = Math.min(discountAmount, cartTotal);

        res.json({
            success: true,
            data: {
                id: coupon.id,
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                discountAmount: parseFloat(discountAmount.toFixed(2)),
                description: coupon.description
            }
        });

    } catch (error) {
        logger.logError(error, { context: 'validateCoupon' });
        res.status(500).json({
            success: false,
            message: 'Error validating coupon',
            error: error.message
        });
    }
};

/**
 * Get all coupons (Admin only)
 * GET /api/coupons
 */
exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            success: true,
            data: coupons
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching coupons'
        });
    }
};

/**
 * Create a new coupon (Admin only)
 * POST /api/coupons
 */
exports.createCoupon = async (req, res) => {
    try {
        const {
            code,
            description,
            discountType,
            discountValue,
            minOrderAmount,
            maxDiscountAmount,
            startDate,
            endDate,
            usageLimit,
            isActive
        } = req.body;

        if (!code || !discountType || !discountValue) {
            return res.status(400).json({
                success: false,
                message: 'Required fields missing'
            });
        }

        const existing = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code already exists'
            });
        }

        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                description,
                discountType,
                discountValue: parseFloat(discountValue),
                minOrderAmount: parseFloat(minOrderAmount || 0),
                maxDiscountAmount: maxDiscountAmount ? parseFloat(maxDiscountAmount) : null,
                startDate: startDate ? new Date(startDate) : new Date(),
                endDate: endDate ? new Date(endDate) : null,
                usageLimit: usageLimit ? parseInt(usageLimit) : null,
                isActive: isActive !== undefined ? isActive : true
            }
        });

        res.status(201).json({
            success: true,
            message: 'Coupon created successfully',
            data: coupon
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating coupon',
            error: error.message
        });
    }
};

/**
 * Delete a coupon (Admin only)
 * DELETE /api/coupons/:id
 */
exports.deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.coupon.delete({ where: { id } });
        res.json({
            success: true,
            message: 'Coupon deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting coupon'
        });
    }
};
