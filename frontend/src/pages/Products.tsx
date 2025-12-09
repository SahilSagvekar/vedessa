import { useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Build API filters
  const apiFilters: any = {};
  
  if (selectedCategory !== 'all') {
    apiFilters.category = selectedCategory;
  }
  
  if (selectedCollection !== 'all') {
    apiFilters.collection = selectedCollection;
  }

  // Map sort options to backend format
  const sortMap: Record<string, string> = {
    'newest': 'created_at_desc',
    'price-low': 'price_asc',
    'price-high': 'price_desc',
    'rating': 'rating_desc'
  };
  
  if (sortBy) {
    apiFilters.sort = sortMap[sortBy];
  }

  // Fetch products from backend
  const { products, loading, error } = useProducts(apiFilters);

  // SAFETY: Always ensure we have an array
  const safeProducts = Array.isArray(products) ? products : [];

  console.log('Products - products:', products);
  console.log('Products - safeProducts:', safeProducts);
  console.log('Products - loading:', loading);

  return (
    <Layout>
      <div className="bg-kama-olive text-kama-cream py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-display mb-2">Our Products</h1>
          <p className="text-kama-cream/80">Discover authentic Ayurvedic beauty</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors">
                <span className="text-sm">
                  {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                </span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedCategory('all')}>
                  All Categories
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCategory('skincare')}>
                  Skincare
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCategory('haircare')}>
                  Haircare
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCategory('bath_body')}>
                  Bath & Body
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCategory('gifting')}>
                  Gifting
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Collection Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors">
                <span className="text-sm">
                  {selectedCollection === 'all' ? 'All Collections' : selectedCollection}
                </span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedCollection('all')}>
                  All Collections
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCollection('bringaras')}>
                  Bringaras
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCollection('eladhi')}>
                  Eladhi
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCollection('ashwaras')}>
                  Ashwaras
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCollection('kumkumadi')}>
                  Kumkumadi
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors">
              <span className="text-sm">
                {sortBy === 'newest' && 'Newest'}
                {sortBy === 'price-low' && 'Price: Low to High'}
                {sortBy === 'price-high' && 'Price: High to Low'}
                {sortBy === 'rating' && 'Top Rated'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('newest')}>
                Newest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('price-low')}>
                Price: Low to High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('price-high')}>
                Price: High to Low
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('rating')}>
                Top Rated
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Products Count */}
        <p className="text-sm text-muted-foreground mb-6">
          {loading ? 'Loading...' : `${safeProducts.length} products`}
        </p>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-destructive mb-2">Failed to load products</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && safeProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && safeProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {safeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Products;