const prisma = require('../config/database');

/**
 * Shipping is tracked manually — an admin/vendor enters the AWB number and
 * tracking URL once a courier is booked outside the app (no live courier
 * API integration).
 */

// Build a simple tracking payload from what's stored on the order.
// Keeps the same response shape the frontend already expects
// (status / updates / estimatedDelivery) so TrackOrder.tsx needs no rework.
function buildTrackingPayload(order) {
    const status = order.shippingStatus || order.status;

    return {
        status,
        location: null,
        estimatedDelivery: null,
        updates: [
            {
                timestamp: order.updatedAt,
                status,
                location: '',
                description: order.trackingUrl
                    ? `Tracking available at ${order.trackingUrl}`
                    : 'Awaiting carrier update'
            }
        ]
    };
}

/**
 * Track shipment by AWB number or order number
 * GET /api/shipping/track/:reference
 */
exports.trackShipment = async (req, res) => {
    try {
        const { reference } = req.params;

        const order = await prisma.order.findFirst({
            where: {
                OR: [
                    { awbNumber: reference },
                    { orderNumber: reference }
                ]
            }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'No shipment found with this number'
            });
        }

        res.json({
            success: true,
            tracking: buildTrackingPayload(order)
        });
    } catch (error) {
        console.error('Track shipment error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to track shipment'
        });
    }
};

/**
 * Manually set/update an order's shipping details (Admin)
 * PUT /api/shipping/:orderId
 */
exports.updateShipping = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { awbNumber, trackingUrl, shippingStatus, markShipped } = req.body;

        const order = await prisma.order.findUnique({ where: { id: orderId } });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                ...(awbNumber !== undefined && { awbNumber }),
                ...(trackingUrl !== undefined && { trackingUrl }),
                ...(shippingStatus !== undefined && { shippingStatus }),
                ...(markShipped && { status: 'SHIPPED' })
            }
        });

        res.json({
            success: true,
            message: 'Shipping details updated',
            data: updatedOrder
        });
    } catch (error) {
        console.error('Update shipping error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update shipping details'
        });
    }
};

/**
 * Cancel a shipment (Admin) — clears the manual tracking status
 * PUT /api/shipping/cancel/:orderId
 */
exports.cancelShipment = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await prisma.order.findUnique({ where: { id: orderId } });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        await prisma.order.update({
            where: { id: orderId },
            data: {
                shippingStatus: 'CANCELLED',
                status: 'CANCELLED'
            }
        });

        res.json({
            success: true,
            message: 'Shipment cancelled successfully'
        });
    } catch (error) {
        console.error('Cancel shipment error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to cancel shipment'
        });
    }
};

/**
 * Get all shipped/tracked orders (Admin)
 * GET /api/shipping/all
 */
exports.getAllShipments = async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;

        const where = {
            awbNumber: { not: null }
        };

        if (status) {
            where.shippingStatus = status;
        }

        const [shipments, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    user: {
                        select: {
                            fullName: true,
                            email: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip: (parseInt(page) - 1) * parseInt(limit),
                take: parseInt(limit)
            }),
            prisma.order.count({ where })
        ]);

        res.json({
            success: true,
            shipments,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get shipments error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch shipments'
        });
    }
};
