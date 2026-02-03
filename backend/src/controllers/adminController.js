const prisma = require('../config/database');

/**
 * Get all vendors with filtering and pagination
 */
exports.getAllVendors = async (req, res) => {
    try {
        const { status, page = 1, limit = 10, search } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build where clause
        const where = {
            role: 'VENDOR'
        };

        if (status === 'pending') {
            where.isApproved = false;
        } else if (status === 'approved') {
            where.isApproved = true;
        }

        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { fullName: { contains: search, mode: 'insensitive' } },
                { companyName: { contains: search, mode: 'insensitive' } }
            ];
        }

        // Get vendors and total count
        const [vendors, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    companyName: true,
                    gstNumber: true,
                    phone: true,
                    address: true,
                    city: true,
                    state: true,
                    pincode: true,
                    isApproved: true,
                    createdAt: true,
                    _count: {
                        select: {
                            products: true
                        }
                    }
                },
                skip,
                take: parseInt(limit),
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.count({ where })
        ]);

        res.json({
            success: true,
            data: vendors,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get vendors error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vendors',
            error: error.message
        });
    }
};

/**
 * Get vendor by ID with detailed information
 */
exports.getVendorById = async (req, res) => {
    try {
        const { id } = req.params;

        const vendor = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                fullName: true,
                companyName: true,
                gstNumber: true,
                phone: true,
                address: true,
                city: true,
                state: true,
                pincode: true,
                bankDetails: true,
                isApproved: true,
                createdAt: true,
                updatedAt: true,
                products: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        stock: true,
                        createdAt: true
                    },
                    take: 10,
                    orderBy: { createdAt: 'desc' }
                },
                _count: {
                    select: {
                        products: true
                    }
                }
            }
        });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        if (vendor.role !== 'VENDOR') {
            return res.status(400).json({
                success: false,
                message: 'User is not a vendor'
            });
        }

        res.json({
            success: true,
            data: vendor
        });
    } catch (error) {
        console.error('Get vendor error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vendor',
            error: error.message
        });
    }
};

/**
 * Approve vendor
 */
exports.approveVendor = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if vendor exists
        const vendor = await prisma.user.findUnique({
            where: { id },
            select: { id: true, role: true, isApproved: true, email: true, fullName: true }
        });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        if (vendor.role !== 'VENDOR') {
            return res.status(400).json({
                success: false,
                message: 'User is not a vendor'
            });
        }

        if (vendor.isApproved) {
            return res.status(400).json({
                success: false,
                message: 'Vendor is already approved'
            });
        }

        // Approve vendor
        const updatedVendor = await prisma.user.update({
            where: { id },
            data: { isApproved: true },
            select: {
                id: true,
                email: true,
                fullName: true,
                companyName: true,
                isApproved: true
            }
        });

        // TODO: Send approval email to vendor
        // const emailService = require('../services/emailService');
        // await emailService.sendVendorApprovalEmail(vendor.email, vendor.fullName);

        res.json({
            success: true,
            message: 'Vendor approved successfully',
            data: updatedVendor
        });
    } catch (error) {
        console.error('Approve vendor error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve vendor',
            error: error.message
        });
    }
};

/**
 * Reject vendor
 */
exports.rejectVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        // Check if vendor exists
        const vendor = await prisma.user.findUnique({
            where: { id },
            select: { id: true, role: true, email: true, fullName: true }
        });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        if (vendor.role !== 'VENDOR') {
            return res.status(400).json({
                success: false,
                message: 'User is not a vendor'
            });
        }

        // For now, we'll just set isApproved to false
        // In a real app, you might want to delete the account or add a rejection reason field
        const updatedVendor = await prisma.user.update({
            where: { id },
            data: { isApproved: false },
            select: {
                id: true,
                email: true,
                fullName: true,
                companyName: true,
                isApproved: true
            }
        });

        // TODO: Send rejection email to vendor
        // const emailService = require('../services/emailService');
        // await emailService.sendVendorRejectionEmail(vendor.email, vendor.fullName, reason);

        res.json({
            success: true,
            message: 'Vendor rejected successfully',
            data: updatedVendor
        });
    } catch (error) {
        console.error('Reject vendor error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reject vendor',
            error: error.message
        });
    }
};

/**
 * Get vendor statistics
 */
exports.getVendorStats = async (req, res) => {
    try {
        const [total, approved, pending, totalProducts] = await Promise.all([
            prisma.user.count({ where: { role: 'VENDOR' } }),
            prisma.user.count({ where: { role: 'VENDOR', isApproved: true } }),
            prisma.user.count({ where: { role: 'VENDOR', isApproved: false } }),
            prisma.product.count({ where: { vendorId: { not: null } } })
        ]);

        res.json({
            success: true,
            data: {
                total,
                approved,
                pending,
                totalProducts,
                averageProductsPerVendor: approved > 0 ? Math.round(totalProducts / approved) : 0
            }
        });
    } catch (error) {
        console.error('Get vendor stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vendor statistics',
            error: error.message
        });
    }
};
