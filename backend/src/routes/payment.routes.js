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

// Create order (called before payment)
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required',
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: {
        user_id: req.user.id,
        user_email: req.user.email,
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
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

// Verify payment signature
router.post('/verify-payment', protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
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

    // Generate order number
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderNumber = `ORD-${timestamp}-${random}`;

    // Calculate values
    const subtotal = orderData.subtotal || 0;
    const taxAmount = orderData.tax || 0;
    const shippingCost = orderData.shipping || 0;
    const totalAmount = orderData.total || (subtotal + taxAmount + shippingCost);

    // Create order in database with correct schema field names
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.user.id,
        totalAmount,
        subtotal,
        taxAmount,
        shippingCost,
        status: 'PROCESSING',
        paymentMethod: 'RAZORPAY',
        shippingAddress: orderData.shippingAddress,
        items: {
          create: orderData.items.map((item) => ({
            productId: item.productId || item.product_id,
            productName: item.productName || item.name || 'Unknown Product',
            productImage: item.productImage || item.image || null,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Clear user's cart
    await prisma.cartItem.deleteMany({
      where: { userId: req.user.id },
    });

    // Update product stock
    for (const item of orderData.items) {
      const productId = item.productId || item.product_id;
      if (productId) {
        await prisma.product.update({
          where: { id: productId },
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
      message: 'Payment verified and order created successfully',
      data: {
        order,
        razorpay_payment_id,
      },
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

// Handle payment failure
router.post('/payment-failed', protect, async (req, res) => {
  try {
    const { razorpay_order_id, error } = req.body;

    console.error('Payment failed:', {
      order_id: razorpay_order_id,
      user_id: req.user.id,
      error,
    });

    res.json({
      success: true,
      message: 'Payment failure recorded',
    });
  } catch (error) {
    console.error('Payment failure handler error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to handle payment failure',
    });
  }
});

// Fetch payment details
router.get('/payment/:paymentId', protect, async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await razorpay.payments.fetch(paymentId);

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error('Fetch payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
    });
  }
});

module.exports = router;