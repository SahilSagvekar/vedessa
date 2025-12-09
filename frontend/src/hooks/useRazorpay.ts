// src/hooks/useRazorpay.js

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import paymentService from '../services/paymentService';
import { useToast } from './use-toast';

export const useRazorpay = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const initiatePayment = async (orderData) => {
    try {
      setLoading(true);

      // Step 1: Create Razorpay order
      const orderResponse = await paymentService.createOrder(orderData.total);
      const { orderId, amount, currency, keyId } = orderResponse.data;

      // Step 2: Configure Razorpay options
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'Vedessa Ayurveda',
        description: 'Order Payment',
        image: '/logo.png', // Your logo
        order_id: orderId,
        handler: async function (response) {
          // Step 3: Verify payment on success
          try {
            const verifyResponse = await paymentService.verifyPayment(
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              orderData
            );

            // Payment verified successfully
            toast({
              title: 'Payment Successful!',
              description: 'Your order has been placed successfully.',
            });

            // Redirect to order confirmation page
            navigate(`/orders/${verifyResponse.data.order.id}`);
          } catch (error) {
            toast({
              title: 'Payment Verification Failed',
              description: error.message || 'Please contact support.',
              variant: 'destructive',
            });
          }
        },
        prefill: {
          name: orderData.shippingAddress?.fullName || '',
          email: orderData.userEmail || '',
          contact: orderData.shippingAddress?.phone || '',
        },
        notes: {
          address: orderData.shippingAddress?.address || '',
        },
        theme: {
          color: '#5E7C6B', // Your brand color (kama-olive)
        },
        modal: {
          ondismiss: function () {
            toast({
              title: 'Payment Cancelled',
              description: 'You cancelled the payment.',
            });
            setLoading(false);
          },
        },
      };

      // Step 4: Open Razorpay checkout
      const rzp = new window.Razorpay(options);

      // Handle payment failure
      rzp.on('payment.failed', async function (response) {
        await paymentService.handlePaymentFailure(orderId, response.error);
        
        toast({
          title: 'Payment Failed',
          description: response.error.description || 'Payment failed. Please try again.',
          variant: 'destructive',
        });
        
        setLoading(false);
      });

      rzp.open();
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to initiate payment',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return {
    initiatePayment,
    loading,
  };
};

export default useRazorpay;