import { useState, useEffect } from 'react';
import { useAuth } from '../components/contexts/AuthContext';
import ordersService from '../services/ordersService';
import { toast } from 'sonner';

export const useOrders = (filters = {}) => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch orders
  const fetchOrders = async (params = {}) => {
    if (!isAuthenticated) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await ordersService.getOrders({ ...filters, ...params });
      console.log('Orders response:', response);

      // Handle different response structures
      if (response?.data) {
        setOrders(response.data.orders || response.data || []);
        setPagination(response.data.pagination || null);
      } else {
        setOrders([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
      setError(err);
      setOrders([]); // Set empty array instead of leaving it undefined
      // Don't show toast here to avoid spamming user
    } finally {
      setLoading(false);
    }
  };

  // Create order
  const createOrder = async (shippingAddress, paymentMethod = 'COD') => {
    try {
      const response = await ordersService.createOrder(shippingAddress, paymentMethod);
      toast.success('Order placed successfully!');
      await fetchOrders(); // Refresh orders
      return response.data;
    } catch (err) {
      toast.error(err || 'Failed to place order');
      throw err;
    }
  };

  // Cancel order
  const cancelOrder = async (orderId) => {
    try {
      await ordersService.cancelOrder(orderId);
      toast.success('Order cancelled');
      await fetchOrders(); // Refresh orders
    } catch (err) {
      toast.error(err || 'Failed to cancel order');
      throw err;
    }
  };

  // Fetch orders on mount and when auth changes
  useEffect(() => {
    fetchOrders();
  }, [isAuthenticated, JSON.stringify(filters)]);

  return {
    orders,
    pagination,
    loading,
    error,
    createOrder,
    cancelOrder,
    refreshOrders: fetchOrders,
  };
};

export const useOrder = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await ordersService.getOrder(orderId);
        setOrder(response.data);
      } catch (err) {
        setError(err);
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return { order, loading, error };
};