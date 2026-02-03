const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const prisma = require('../config/database');
const { auth: protect } = require('../middleware/auth');

const router = express.Router();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Helper: Generate unique order number
 */
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
};

/**
 * 1. Create Order (called before payment modal opens)
 * Now creates a PENDING record in our DB first to track the attempt.
 */
router.post('/create-order', protect, async (req, res) => {
  try {
    const { orderData } = req.body;

    if (!orderData || !orderData.total) {
      return res.status(400).json({
        success: false,
        message: 'Order data with total amount is required',
      });
    }

    const amount = orderData.total;
    const currency = 'INR';

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        user_id: req.user.id,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create record in our database as PENDING
    const dbOrder = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: req.user.id,
        totalAmount: amount,
        subtotal: orderData.subtotal || amount,
        taxAmount: orderData.tax || 0,
        shippingCost: orderData.shipping || 0,
        discountAmount: orderData.discountAmount || 0,
        couponId: orderData.couponId || null,
        status: 'PENDING',
        paymentMethod: 'RAZORPAY',
        shippingAddress: orderData.shippingAddress,
        razorpayOrderId: razorpayOrder.id,
        items: {
          create: orderData.items.map((item) => ({
            productId: item.id || item.productId || item.product_id,
            productName: item.name || item.productName || 'Unknown Product',
            productImage: item.image || item.productImage || null,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      }
    });

    res.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        dbOrderId: dbOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message,
    });
  }
});

/**
 * 2. Verify Payment (Immediate client-side verification)
 */
router.post('/verify-payment', protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }

    // Find our order and update it
    const updatedOrder = await prisma.order.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        status: 'PROCESSING',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      include: { items: true }
    });

    // Increment coupon usage if applied
    if (updatedOrder.couponId) {
      await prisma.coupon.update({
        where: { id: updatedOrder.couponId },
        data: { usedCount: { increment: 1 } }
      });
    }

    // Clear user's cart
    await prisma.cartItem.deleteMany({
      where: { userId: req.user.id },
    });

    // Update product stock
    for (const item of updatedOrder.items) {
      if (item.productId) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
});

/**
 * 3. Webhook Handler (Asynchronous server-side verification)
 * Automatically processes payments even if browser is closed.
 */
router.post('/webhook', async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'order.paid') {
      const razorpayOrder = payload.order.entity;
      const razorpayPaymentId = payload.payment.entity.id;

      // Check if order exists in our DB
      const order = await prisma.order.findUnique({
        where: { razorpayOrderId: razorpayOrder.id },
        include: { items: true }
      });

      if (order && order.status === 'PENDING') {
        // Mark as paid
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'PROCESSING',
            razorpayPaymentId: razorpayPaymentId,
          }
        });

        // Increment coupon usage if applied
        if (order.couponId) {
          await prisma.coupon.update({
            where: { id: order.couponId },
            data: { usedCount: { increment: 1 } }
          });
        }

        // Clear cart (if we have userId)
        if (order.userId) {
          await prisma.cartItem.deleteMany({
            where: { userId: order.userId }
          });
        }

        // Update stock
        for (const item of order.items) {
          if (item.productId) {
            await prisma.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } }
            });
          }
        }
      }
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false, message: 'Webhook handler failed' });
  }
});

module.exports = router;