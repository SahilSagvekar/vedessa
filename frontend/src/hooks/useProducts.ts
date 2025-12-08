import { useState, useEffect } from 'react';
import productsService from '../services/productsService';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await productsService.getProducts({ ...filters, ...params });
      
      // DEBUG: Log the response structure
      console.log('API Response:', response);
      console.log('Response.data:', response?.data);
      console.log('Products:', response?.data?.products);
      
      // Ensure products is always an array
      const productList = response?.data?.products || [];
      setProducts(Array.isArray(productList) ? productList : []);
      setPagination(response?.data?.pagination || null);
    } catch (err) {
      console.error('Error details:', err);
      setError(err);
      setProducts([]); // Reset to empty array on error
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(filters)]);

  return {
    products,
    pagination,
    loading,
    error,
    refetch: fetchProducts,
  };
};

export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await productsService.getProduct(productId);
        setProduct(response.data);
      } catch (err) {
        setError(err);
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};