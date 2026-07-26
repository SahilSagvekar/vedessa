const prisma = require('../config/database');

// Get vendor's orders (orders containing their products)
exports.getMyOrders = async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = {
            items: {
                some: {
                    product: {
                        vendorId: req.user.id
                    }
                }
            },
            ...(status && { status })
        };

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    items: {
                        where: {
                            product: {
                                vendorId: req.user.id
                            }
                        },
                        include: {
                            product: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            email: true,
                            fullName: true
                        }
                    }
                },
                skip,
                take: parseInt(limit),
                orderBy: { createdAt: 'desc' }
            }),
            prisma.order.count({ where })
        ]);

        res.json({
            success: true,
            data: {
                orders,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get vendor orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
};

// Mark order as fulfilled (for vendor's items). Tracking is now entered
// manually — if the vendor supplies a tracking number, save it directly
// on the order rather than calling out to a courier API.
exports.fulfillOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { trackingNumber, notes } = req.body;

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    where: {
                        product: {
                            vendorId: req.user.id
                        }
                    }
                }
            }
        });

        if (!order || order.items.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found or does not contain your products'
            });
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                status: 'SHIPPED',
                ...(trackingNumber && { awbNumber: trackingNumber, shippingStatus: 'SHIPPED' }),
                updatedAt: new Date()
            },
            include: {
                items: true,
                user: {
                    select: {
                        email: true,
                        fullName: true
                    }
                }
            }
        });

        res.json({
            success: true,
            message: 'Order marked as fulfilled',
            data: updatedOrder
        });
    } catch (error) {
        console.error('Fulfill order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fulfill order',
            error: error.message
        });
    }
};

// Get vendor analytics
exports.getAnalytics = async (req, res) => {
    try {
        const vendorId = req.user.id;

        const [productCount, orderCount, orderItems, productsWithStock] = await Promise.all([
            prisma.product.count({ where: { vendorId } }),
            prisma.order.count({
                where: {
                    items: {
                        some: {
                            product: { vendorId }
                        }
                    }
                }
            }),
            prisma.orderItem.findMany({
                where: {
                    product: { vendorId }
                },
                select: {
                    price: true,
                    quantity: true
                }
            }),
            prisma.product.findMany({
                where: { vendorId },
                select: {
                    id: true,
                    stock: true,
                    lowStockThreshold: true,
                    variants: {
                        select: { stock: true, lowStockThreshold: true }
                    }
                }
            })
        ]);

        const totalRevenue = orderItems.reduce((sum, item) => {
            return sum + (parseFloat(item.price) * item.quantity);
        }, 0);

        let lowStockCount = 0;
        productsWithStock.forEach(product => {
            if (product.stock <= product.lowStockThreshold) {
                lowStockCount++;
            } else if (product.variants.some(v => v.stock <= v.lowStockThreshold)) {
                lowStockCount++;
            }
        });

        res.json({
            success: true,
            data: {
                productCount,
                orderCount,
                totalRevenue: totalRevenue.toFixed(2),
                lowStockProducts: lowStockCount
            }
        });
    } catch (error) {
        console.error('Get vendor analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch analytics',
            error: error.message
        });
    }
};
