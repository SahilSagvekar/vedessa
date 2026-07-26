const prisma = require('../config/database');
const emailService = require('../services/emailService');

// Admin: Get all vendors
exports.getAllVendors = async (req, res) => {
    try {
        const { page = 1, limit = 20, isApproved } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = {
            role: 'VENDOR'
        };

        if (isApproved !== undefined) {
            where.isApproved = isApproved === 'true';
        }

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
                    isApproved: true,
                    createdAt: true
                },
                skip,
                take: parseInt(limit),
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.count({ where })
        ]);

        res.json({
            success: true,
            data: {
                vendors,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get all vendors error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vendors',
            error: error.message
        });
    }
};

// Admin: Approve or Reject Vendor
exports.approveVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const { approve, reason } = req.body;

        const vendor = await prisma.user.findUnique({
            where: { id, role: 'VENDOR' }
        });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        const updatedVendor = await prisma.user.update({
            where: { id },
            data: {
                isApproved: approve
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                companyName: true,
                isApproved: true
            }
        });

        try {
            if (approve) {
                await emailService.sendVendorApprovalEmail(
                    updatedVendor.email,
                    updatedVendor.fullName,
                    updatedVendor.companyName
                );
            } else {
                await emailService.sendVendorRejectionEmail(
                    updatedVendor.email,
                    updatedVendor.fullName,
                    reason || 'Your application did not meet our current requirements.'
                );
            }
        } catch (emailError) {
            console.error('Failed to send vendor approval/rejection email:', emailError);
        }

        res.json({
            success: true,
            message: `Vendor ${approve ? 'approved' : 'rejected'} successfully`,
            data: updatedVendor
        });
    } catch (error) {
        console.error('Approve vendor error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update vendor status',
            error: error.message
        });
    }
};
