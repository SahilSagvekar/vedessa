const { PrismaClient } = require('@prisma/client');
const ekartService = require('../services/ekartService');
const shiprocketService = require('../services/shiprocketService');

const prisma = new PrismaClient();

/**
 * Create shipment for an order
 * POST /api/shipping/create
 */
exports.createShipment = async (req, res) => {
    try {
        const { orderId, weight, dimensions } = req.body;

        // Get order details
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                user: true
            }
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if shipment already exists
        if (order.awbNumber) {
            return res.status(400).json({
                message: 'Shipment already created for this order',
                awbNumber: order.awbNumber,
                trackingUrl: order.trackingUrl
            });
        }

        // Prepare shipment data
        const shipmentData = {
            orderNumber: order.orderNumber,
            customerName: order.shippingAddress?.fullName || order.user?.fullName || 'Customer',
            customerPhone: order.shippingAddress?.phone || order.user?.phone || '',
            customerEmail: order.user?.email || '',
            shippingAddress: order.shippingAddress,
            items: order.items.map(item => ({
                productName: item.product.name,
                productId: item.productId,
                quantity: item.quantity,
                price: parseFloat(item.price)
            })),
            subtotal: parseFloat(order.subtotal),
            totalAmount: parseFloat(order.totalAmount),
            paymentMethod: order.paymentMethod === 'COD' ? 'COD' : 'PREPAID',
            weight: weight || 0.5,
            length: dimensions?.length || 10,
            width: dimensions?.width || 10,
            height: dimensions?.height || 10
        };

        // 1. Get Serviceability and find cheapest courier
        const couriers = await shiprocketService.getServiceability(
            process.env.SHIPROCKET_PICKUP_PINCODE || '400001', // Default pickup pincode
            order.shippingAddress.pincode,
            shipmentData.weight,
            order.paymentMethod === 'COD' ? order.totalAmount : 0
        );

        const cheapestCourier = shiprocketService.getCheapestCourier(couriers);
        
        if (!cheapestCourier) {
            return res.status(400).json({ message: 'No serviceability for this location' });
        }

        // 2. Create Order in Shiprocket
        const srOrder = await shiprocketService.createOrder(shipmentData);
        const { order_id: srOrderId, shipment_id: srShipmentId } = srOrder;

        // 3. Generate AWB with the cheapest courier
        const awbData = await shiprocketService.generateAWB(srShipmentId, cheapestCourier.courier_company_id);

        // Update order with shipping details
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                awbNumber: awbData.response.data.awb_code,
                shipmentId: srShipmentId.toString(),
                trackingUrl: `https://shiprocket.co/tracking/${awbData.response.data.awb_code}`,
                shippingStatus: `CREATED (${cheapestCourier.courier_name})`,
                status: 'PROCESSING'
            }
        });

        res.json({
            success: true,
            message: `Shipment created successfully via ${cheapestCourier.courier_name}`,
            shipment: {
                awbNumber: awbData.response.data.awb_code,
                courierName: cheapestCourier.courier_name,
                rate: cheapestCourier.rate,
                trackingUrl: `https://shiprocket.co/tracking/${awbData.response.data.awb_code}`
            },
            order: updatedOrder
        });

    } catch (error) {
        console.error('Create shipment error:', error);
        res.status(500).json({
            message: error.message || 'Failed to create shipment'
        });
    }
};

/**
 * Track shipment
 * GET /api/shipping/track/:awbNumber
 */
exports.trackShipment = async (req, res) => {
    try {
        const { awbNumber } = req.params;

        const tracking = await shiprocketService.trackShipment(awbNumber);

        res.json({
            success: true,
            tracking
        });

    } catch (error) {
        console.error('Track shipment error:', error);
        res.status(500).json({
            message: error.message || 'Failed to track shipment'
        });
    }
};

/**
 * Calculate shipping rate
 * POST /api/shipping/calculate-rate
 */
exports.calculateRate = async (req, res) => {
    try {
        const { destinationPincode, weight, paymentMethod } = req.body;

        if (!destinationPincode) {
            return res.status(400).json({ message: 'Destination pincode is required' });
        }

        const couriers = await shiprocketService.getServiceability(
            process.env.SHIPROCKET_PICKUP_PINCODE || '400001',
            destinationPincode,
            weight || 0.5,
            paymentMethod === 'COD' ? 1 : 0
        );

        res.json({
            success: true,
            couriers
        });

    } catch (error) {
        console.error('Calculate rate error:', error);
        res.status(500).json({
            message: error.message || 'Failed to calculate shipping rate'
        });
    }
};

/**
 * Schedule pickup
 * POST /api/shipping/schedule-pickup
 */
exports.schedulePickup = async (req, res) => {
    try {
        const { pickupDate, orderIds } = req.body;

        if (!pickupDate || !orderIds || orderIds.length === 0) {
            return res.status(400).json({
                message: 'Pickup date and order IDs are required'
            });
        }

        // Get AWB numbers for the orders
        const orders = await prisma.order.findMany({
            where: {
                id: { in: orderIds },
                awbNumber: { not: null }
            },
            select: {
                awbNumber: true
            }
        });

        const awbNumbers = orders.map(order => order.awbNumber).filter(Boolean);

        if (awbNumbers.length === 0) {
            return res.status(400).json({
                message: 'No valid shipments found for the selected orders'
            });
        }

        const pickup = await ekartService.schedulePickup({
            pickupDate,
            awbNumbers,
            numberOfPieces: awbNumbers.length
        });

        res.json({
            success: true,
            pickup
        });

    } catch (error) {
        console.error('Schedule pickup error:', error);
        res.status(500).json({
            message: error.message || 'Failed to schedule pickup'
        });
    }
};

/**
 * Cancel shipment
 * POST /api/shipping/cancel/:orderId
 */
exports.cancelShipment = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (!order.awbNumber) {
            return res.status(400).json({ message: 'No shipment found for this order' });
        }

        await ekartService.cancelShipment(order.awbNumber);

        // Update order
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
            message: error.message || 'Failed to cancel shipment'
        });
    }
};

/**
 * Generate shipping label
 * GET /api/shipping/label/:orderId
 */
exports.generateLabel = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (!order.awbNumber) {
            return res.status(400).json({ message: 'No shipment found for this order' });
        }

        const label = await ekartService.generateShippingLabel(order.awbNumber);

        res.json({
            success: true,
            label
        });

    } catch (error) {
        console.error('Generate label error:', error);
        res.status(500).json({
            message: error.message || 'Failed to generate shipping label'
        });
    }
};

/**
 * Get all shipments (Admin)
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
            message: error.message || 'Failed to fetch shipments'
        });
    }
};

module.exports = exports;
