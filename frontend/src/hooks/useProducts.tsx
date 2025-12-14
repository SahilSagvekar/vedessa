// hooks/useProducts.ts
import { useState, useEffect } from 'react';

interface UseProductsOptions {
  isBestseller?: boolean;
  limit?: number;
  collection?: string;
  category?: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  isBestseller: boolean;
  isActive: boolean;
  stock: number;
  images: Array<{
    id: string;
    url: string;
    alt?: string;
    order: number;
  }>;
  collection?: {
    id: string;
    name: string;
    slug: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query params
        const params = new URLSearchParams();
        
        if (options.isBestseller) {
          params.append('isBestseller', 'true');
        }
        
        if (options.limit) {
          params.append('limit', options.limit.toString());
        }
        
        if (options.collection) {
          params.append('collection', options.collection);
        }
        
        if (options.category) {
          params.append('category', options.category);
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setProducts(data.data || []);
        } else {
          throw new Error(data.message || 'Failed to fetch products');
        }

      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setProducts([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [options.isBestseller, options.limit, options.collection, options.category]);

  return { products, loading, error };
};