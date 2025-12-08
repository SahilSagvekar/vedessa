import { useState, useEffect } from 'react';
import { useAuth } from '../components/contexts/AuthContext';
import cartService from '../services/cartService';
import { toast } from 'sonner';

export const useCart = () => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart
  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await cartService.getCart();
      setCart(response.data);
    } catch (err) {
      setError(err);
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await cartService.addToCart(productId, quantity);
      toast.success('Item added to cart');
      await fetchCart(); // Refresh cart
    } catch (err) {
      toast.error(err || 'Failed to add item to cart');
      throw err;
    }
  };

  // Update cart item
  const updateCartItem = async (itemId, quantity) => {
    try {
      await cartService.updateCartItem(itemId, quantity);
      await fetchCart(); // Refresh cart
    } catch (err) {
      toast.error(err || 'Failed to update cart');
      throw err;
    }
  };

  // Remove from cart
  const removeFromCart = async (itemId) => {
    try {
      await cartService.removeFromCart(itemId);
      toast.success('Item removed from cart');
      await fetchCart(); // Refresh cart
    } catch (err) {
      toast.error(err || 'Failed to remove item');
      throw err;
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      await cartService.clearCart();
      toast.success('Cart cleared');
      await fetchCart(); // Refresh cart
    } catch (err) {
      toast.error(err || 'Failed to clear cart');
      throw err;
    }
  };

  // Fetch cart on mount and when auth changes
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  return {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
    itemCount: cart?.summary?.item_count || 0,
    totalQuantity: cart?.summary?.total_quantity || 0,
    subtotal: cart?.summary?.subtotal || 0,
    tax: cart?.summary?.tax || 0,
    total: cart?.summary?.total || 0,
  };
};