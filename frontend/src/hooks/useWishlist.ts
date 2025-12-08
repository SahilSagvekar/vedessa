import { useState, useEffect } from 'react';
import { useAuth } from '../components/contexts/AuthContext';
import wishlistService from '../services/wishlistService';
import { toast } from 'sonner';

export const useWishlist = () => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch wishlist
  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await wishlistService.getWishlist();
      setWishlist(response.data.items || []);
    } catch (err) {
      setError(err);
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add to wishlist
  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    try {
      await wishlistService.addToWishlist(productId);
      toast.success('Added to wishlist');
      await fetchWishlist(); // Refresh wishlist
    } catch (err) {
      toast.error(err || 'Failed to add to wishlist');
      throw err;
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      toast.success('Removed from wishlist');
      await fetchWishlist(); // Refresh wishlist
    } catch (err) {
      toast.error(err || 'Failed to remove from wishlist');
      throw err;
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product_id === productId);
  };

  // Toggle wishlist
  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  // Fetch wishlist on mount and when auth changes
  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  return {
    wishlist,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    refreshWishlist: fetchWishlist,
    count: wishlist.length,
  };
};