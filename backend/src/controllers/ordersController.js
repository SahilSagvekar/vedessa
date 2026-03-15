const prisma = require('../config/database');
const emailService = require('../services/emailService');
const ekartService = require('../services/ekartService');

/**
 * Generate unique order number
 */
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
};

/**
 * Create order from cart
 * POST /api/orders
 */
const createOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod = 'COD'
    } = req.body;

    // Validation
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.userId },
      include: { 
        product: true,
        variant: true
      }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Check stock for all items
    for (const item of cartItems) {
      const stockAvailable = item.variant ? item.variant.stock : item.product.stock;
      if (stockAvailable < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product.name}${item.variant ? ` (${item.variant.value})` : ''}. Only ${stockAvailable} available.`
        });
      }
    }

    // Calculate totals and weight
    let subtotal = 0;
    let totalWeight = 0;
    cartItems.forEach(item => {
      const itemPrice = item.variant?.price ? parseFloat(item.variant.price) : parseFloat(item.product.price);
      subtotal += itemPrice * item.quantity;
      
      const itemWeight = item.variant?.weight ? parseFloat(item.variant.weight) : (item.product.weight ? parseFloat(item.product.weight) : 0.5);
      totalWeight += itemWeight * item.quantity;
    });

    const taxAmount = subtotal * 0.18; // 18% tax
    
    // Calculate dynamic shipping cost via Ekart
    let shippingCost = 0;
    let estimatedDelivery = null;
    
    try {
      const shippingInfo = await ekartService.calculateShippingRate({
        destinationPincode: shippingAddress.pincode,
        weight: totalWeight,
        paymentMethod: paymentMethod
      });
      
      if (shippingInfo.success) {
        // Free shipping over ₹1000 logic can still apply if desired, or override with API rate
        shippingCost = subtotal > 1000 ? 0 : (shippingInfo.rate || 50);
        
        if (shippingInfo.estimatedDays) {
          estimatedDelivery = new Date();
          estimatedDelivery.setDate(estimatedDelivery.getDate() + shippingInfo.estimatedDays);
        }
      } else {
        shippingCost = subtotal > 1000 ? 0 : 50;
      }
    } catch (error) {
      console.error('Shipping calculation error, falling back to default:', error);
      shippingCost = subtotal > 1000 ? 0 : 50;
    }

    const totalAmount = subtotal + taxAmount + shippingCost;

    // Create order and order items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: req.userId,
          status: 'PENDING',
          subtotal,
          taxAmount,
          shippingCost,
          totalAmount,
          shippingAddress,
          paymentMethod,
          estimatedDelivery,
          items: {
            create: cartItems.map(item => ({
              productId: item.productId,
              variantId: item.variantId,
              productName: item.product.name,
              productImage: item.product.image,
              quantity: item.quantity,
              price: item.variant?.price ? item.variant.price : item.product.price
            }))
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      // Update product/variant stock and check thresholds
      for (const item of cartItems) {
        if (item.variantId) {
          const updatedVariant = await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } }
          });
          
          // Trigger alert if low stock
          if (updatedVariant.stock <= updatedVariant.lowStockThreshold) {
            // In a real app, this might queue a job or send an email to the vendor
            console.log(`LOW STOCK ALERT: Variant ${updatedVariant.id} of Product ${item.productId} is at ${updatedVariant.stock}`);
            // Logic to notify vendor could go here
          }
        } else {
          const updatedProduct = await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
          });

          if (updatedProduct.stock <= updatedProduct.lowStockThreshold) {
            console.log(`LOW STOCK ALERT: Product ${updatedProduct.id} is at ${updatedProduct.stock}`);
          }
        }
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { userId: req.userId }
      });

      return newOrder;
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });

    // Send order confirmation email asynchronously
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { email: true, fullName: true }
      });

      if (user && user.email) {
        await emailService.sendOrderConfirmationEmail(user.email, order, user.fullName);
      }
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

/**
 * Get user's orders
 * GET /api/orders
 */
const getOrders = async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    const where = { userId: req.userId };
    if (status) {
      where.status = status.toUpperCase();
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  price: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset)
      }),
      prisma.order.count({ where })
    ]);

    // Format orders
    const formattedOrders = orders.map(order => ({
      id: order.id,
      order_number: order.orderNumber,
      status: order.status,
      total_amount: parseFloat(order.totalAmount),
      subtotal: parseFloat(order.subtotal),
      tax_amount: parseFloat(order.taxAmount),
      shipping_cost: parseFloat(order.shippingCost),
      discount_amount: parseFloat(order.discountAmount || 0),
      shipping_address: order.shippingAddress,
      awb_number: order.awbNumber,
      tracking_url: order.trackingUrl,
      payment_method: order.paymentMethod,
      created_at: order.createdAt,
      updated_at: order.updatedAt,
      items: order.items.map(item => ({
        id: item.id,
        product_id: item.productId,
        product_name: item.productName,
        product_image: item.productImage,
        quantity: item.quantity,
        price: parseFloat(item.price),
        item_total: parseFloat(item.price) * item.quantity
      })),
      item_count: order.items.length,
      total_quantity: order.items.reduce((sum, item) => sum + item.quantity, 0)
    }));

    res.json({
      success: true,
      data: {
        orders: formattedOrders,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: (parseInt(offset) + formattedOrders.length) < total
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

/**
 * Get single order
 * GET /api/orders/:id
 */
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId: req.userId
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
                category: {
                  select: { name: true, slug: true }
                }
              }
            }
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const formattedOrder = {
      id: order.id,
      order_number: order.orderNumber,
      status: order.status,
      total_amount: parseFloat(order.totalAmount),
      subtotal: parseFloat(order.subtotal),
      tax_amount: parseFloat(order.taxAmount),
      shipping_cost: parseFloat(order.shippingCost),
      discount_amount: parseFloat(order.discountAmount || 0),
      shipping_address: order.shippingAddress,
      awb_number: order.awbNumber,
      tracking_url: order.trackingUrl,
      estimated_delivery: order.estimatedDelivery,
      payment_method: order.paymentMethod,
      created_at: order.createdAt,
      updated_at: order.updatedAt,
      items: order.items.map(item => ({
        id: item.id,
        product_id: item.productId,
        product_name: item.productName,
        product_image: item.productImage,
        quantity: item.quantity,
        price: parseFloat(item.price),
        item_total: parseFloat(item.price) * item.quantity
      })),
      item_count: order.items.length,
      total_quantity: order.items.reduce((sum, item) => sum + item.quantity, 0)
    };

    res.json({
      success: true,
      data: formattedOrder
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

/**
 * Cancel order (only if PENDING)
 * PUT /api/orders/:id/cancel
 */
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Find order
    const order = await prisma.order.findFirst({
      where: {
        id,
        userId: req.userId
      },
      include: { items: true }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'Only pending orders can be cancelled'
      });
    }

    // Update order status and restore stock
    await prisma.$transaction(async (tx) => {
      // Update order status
      await tx.order.update({
        where: { id },
        data: { status: 'CANCELLED' }
      });

      // Restore product stock
      for (const item of order.items) {
        if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity
              }
            }
          });
        }
      }
    });

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
};

/**
 * Get all orders (Admin only)
 * GET /api/orders/admin/all
 */
const getAllOrders = async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    const where = {};
    if (status) {
      where.status = status.toUpperCase();
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  image: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset)
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: (parseInt(offset) + orders.length) < total
        }
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

/**
 * Update order status (Admin only)
 * PUT /api/orders/admin/:id/status
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validation
    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
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
      message: 'Order status updated',
      data: order
    });

    // Send status update email
    if (status === 'SHIPPED' && order.user && order.user.email) {
      try {
        await emailService.sendOrderShippedEmail(order.user.email, order);
      } catch (emailError) {
        console.error('Failed to send order shipped email:', emailError);
      }
    }
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
};