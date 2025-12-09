// src/services/paymentService.js

import api from '../lib/api';

export const paymentService = {
  // Create Razorpay order
  createOrder: async (amount, currency = 'INR') => {
    return await api.post('/payments/create-order', {
      amount,
      currency,
      receipt: `receipt_${Date.now()}`,
    });
  },

  // Verify payment after successful payment
  verifyPayment: async (paymentData, orderData) => {
    return await api.post('/payments/verify-payment', {
      razorpay_order_id: paymentData.razorpay_order_id,
      razorpay_payment_id: paymentData.razorpay_payment_id,
      razorpay_signature: paymentData.razorpay_signature,
      orderData,
    });
  },

  // Handle payment failure
  handlePaymentFailure: async (razorpay_order_id, error) => {
    return await api.post('/payments/payment-failed', {
      razorpay_order_id,
      error,
    });
  },

  // Get payment details
  getPaymentDetails: async (paymentId) => {
    return await api.get(`/payments/payment/${paymentId}`);
  },
};

export default paymentService;