import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const collectionParam = searchParams.get('collection');
  const filterParam = searchParams.get('filter');

  const [category, setCategory] = useState<string>(categoryParam || 'all');
  const [collection, setCollection] = useState<string>(collectionParam || 'all');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Build API filters
  const apiFilters = {
    category: category !== 'all' ? category : undefined,
    collection: collection !== 'all' ? collection : undefined,
    isNew: filterParam === 'new' ? true : undefined,
    sort: sortBy === 'price-low' ? 'price_asc' :
          sortBy === 'price-high' ? 'price_desc' :
          sortBy === 'rating' ? 'rating_desc' :
          'created_at_desc', // newest
  };

  // Fetch products from backend API
  const { products, loading, error } = useProducts(apiFilters);

  const productList = Array.isArray(products) ? products : [];

  // Update filters when URL params change
  useEffect(() => {
    if (categoryParam) setCategory(categoryParam);
    if (collectionParam) setCollection(collectionParam);
  }, [categoryParam, collectionParam]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-display text-foreground mb-2">
            All Products
          </h1>
          <p className="text-muted-foreground">
            Explore our complete range of Ayurvedic beauty and wellness products
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <span className="text-sm font-medium text-muted-foreground">
            FILTERS:
          </span>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[160px] bg-card">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="skincare">Skincare</SelectItem>
              <SelectItem value="haircare">Haircare</SelectItem>
              <SelectItem value="bath_body">Bath & Body</SelectItem>
              <SelectItem value="gifting">Gifting</SelectItem>
            </SelectContent>
          </Select>

          <Select value={collection} onValueChange={setCollection}>
            <SelectTrigger className="w-[180px] bg-card">
              <SelectValue placeholder="All Collections" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Collections</SelectItem>
              <SelectItem value="bringaras">Bringaras</SelectItem>
              <SelectItem value="eladhi">Eladhi</SelectItem>
              <SelectItem value="ashwaras">Ashwaras</SelectItem>
              <SelectItem value="kumkumadi">Kumkumadi</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] bg-card">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>

          {!loading && (
            <span className="text-sm text-muted-foreground ml-auto">
              {products.length} products
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-8">
            <p className="font-medium">Error loading products</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))} */}
            {Array.isArray(products) &&
              productList.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground mb-2">
              No products found
            </p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Products;