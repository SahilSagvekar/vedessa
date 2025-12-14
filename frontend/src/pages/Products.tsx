import { useState } from 'react';
import { ChevronDown, Loader2, Grid3x3, LayoutGrid, SlidersHorizontal, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [gridView, setGridView] = useState<number>(4); // 3 or 4 columns
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Build API filters
  const apiFilters: any = {};
  
  if (selectedCategory !== 'all') {
    apiFilters.category = selectedCategory;
  }
  
  if (selectedCollection !== 'all') {
    apiFilters.collection = selectedCollection;
  }

  if (priceRange !== 'all') {
    const [min, max] = priceRange.split('-').map(Number);
    apiFilters.minPrice = min;
    apiFilters.maxPrice = max;
  }

  // Map sort options to backend format
  const sortMap: Record<string, string> = {
    'newest': 'created_at_desc',
    'price-low': 'price_asc',
    'price-high': 'price_desc',
    'rating': 'rating_desc',
    'alphabetical': 'name_asc'
  };
  
  if (sortBy) {
    apiFilters.sort = sortMap[sortBy];
  }

  // Fetch products from backend
  const { products, loading, error } = useProducts(apiFilters);

  // SAFETY: Always ensure we have an array
  const safeProducts = Array.isArray(products) ? products : [];

  // Filter by price range on frontend (if needed)
  const filteredProducts = safeProducts.filter(product => {
    if (priceRange === 'all') return true;
    const [min, max] = priceRange.split('-').map(Number);
    return product.price >= min && product.price <= max;
  });

  const productCount = filteredProducts.length;

  // Filter Sidebar Component (reused for desktop and mobile)
  const FilterSidebar = () => (
    <div className="space-y-6">
      <h3 className="font-serif text-lg font-semibold">Filter:</h3>

      {/* Availability Filter */}
      <div className="border-b border-gray-200 pb-6">
        <button className="flex items-center justify-between w-full mb-3">
          <span className="text-sm font-medium">Availability</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300" />
            <span>In stock (35)</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300" />
            <span>Out of stock (5)</span>
          </label>
        </div>
      </div>

      {/* Price Filter */}
      <div className="border-b border-gray-200 pb-6">
        <button className="flex items-center justify-between w-full mb-3">
          <span className="text-sm font-medium">Price</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="radio" 
              name="price" 
              checked={priceRange === 'all'}
              onChange={() => setPriceRange('all')}
              className="border-gray-300" 
            />
            <span>All Prices</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="radio" 
              name="price" 
              checked={priceRange === '0-500'}
              onChange={() => setPriceRange('0-500')}
              className="border-gray-300" 
            />
            <span>Under ₹500</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="radio" 
              name="price" 
              checked={priceRange === '500-1000'}
              onChange={() => setPriceRange('500-1000')}
              className="border-gray-300" 
            />
            <span>₹500 - ₹1000</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="radio" 
              name="price" 
              checked={priceRange === '1000-2000'}
              onChange={() => setPriceRange('1000-2000')}
              className="border-gray-300" 
            />
            <span>₹1000 - ₹2000</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="radio" 
              name="price" 
              checked={priceRange === '2000-999999'}
              onChange={() => setPriceRange('2000-999999')}
              className="border-gray-300" 
            />
            <span>Above ₹2000</span>
          </label>
        </div>
      </div>

      {/* Product Type Filter */}
      <div className="border-b border-gray-200 pb-6">
        <button className="flex items-center justify-between w-full mb-3">
          <span className="text-sm font-medium">Product type</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300" />
            <span>Face Wash (12)</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300" />
            <span>Hair Oil (8)</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300" />
            <span>Massage Serum (6)</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300" />
            <span>Moisturizer (10)</span>
          </label>
          <button className="text-xs text-gray-500 hover:text-gray-700 mt-2">
            + Show more
          </button>
        </div>
      </div>

      {/* Collection Filter */}
      <div className="border-b border-gray-200 pb-6">
        <button className="flex items-center justify-between w-full mb-3">
          <span className="text-sm font-medium">Collection</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="radio" 
              name="collection"
              checked={selectedCollection === 'all'}
              onChange={() => setSelectedCollection('all')}
              className="border-gray-300" 
            />
            <span>All Collections</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="radio" 
              name="collection"
              checked={selectedCollection === 'bringaras'}
              onChange={() => setSelectedCollection('bringaras')}
              className="border-gray-300" 
            />
            <span>Bringaras (15)</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="radio" 
              name="collection"
              checked={selectedCollection === 'eladhi'}
              onChange={() => setSelectedCollection('eladhi')}
              className="border-gray-300" 
            />
            <span>Eladhi (12)</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="radio" 
              name="collection"
              checked={selectedCollection === 'ashwaras'}
              onChange={() => setSelectedCollection('ashwaras')}
              className="border-gray-300" 
            />
            <span>Ashwaras (8)</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="radio" 
              name="collection"
              checked={selectedCollection === 'kumkumadi'}
              onChange={() => setSelectedCollection('kumkumadi')}
              className="border-gray-300" 
            />
            <span>Kumkumadi (5)</span>
          </label>
        </div>
      </div>

      {/* Size Filter */}
      <div className="pb-6">
        <button className="flex items-center justify-between w-full mb-3">
          <span className="text-sm font-medium">Size</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300" />
            <span>50g (8)</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300" />
            <span>100g (15)</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300" />
            <span>150ml (12)</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300" />
            <span>200ml (10)</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300" />
            <span>250ml (6)</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      {/* Hero Section - Fully Responsive */}
      {/* <div className="bg-[#f7f6f0] text-gray-800 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-6xl">
          <p className="text-gray-400 text-xs sm:text-sm font-light tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-4 sm:mb-6">
            Our Product
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[7rem] font-serif text-gray-900 tracking-tight leading-[0.9] font-extralight px-4">
            Elegance Awaits You
          </h1>
        </div>
      </div> */}

      <div className="bg-kama-olive text-kama-cream py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-display mb-2">Our Products</h1>
          <p className="text-kama-cream/80">Elegance Awaits You</p>
        </div>
      </div>


      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Desktop Sidebar - Hidden on mobile/tablet */}
          <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
            <div className="sticky top-4">
              <FilterSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile Filter Button + Top Bar */}
            <div className="space-y-4 mb-6">
              {/* Mobile Filter Button */}
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <button className="lg:hidden w-full px-4 py-3 border border-gray-300 rounded-md flex items-center justify-center gap-2 bg-white hover:bg-gray-50 transition-colors">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="font-medium">Filters</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Top Bar - Sort and View Options */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600 order-2 sm:order-1">
                  {loading ? 'Loading...' : `${productCount} Product${productCount !== 1 ? 's' : ''}`}
                </p>

                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 order-1 sm:order-2">
                  {/* Grid View Toggle - Hidden on mobile */}
                  <div className="hidden sm:flex items-center gap-2">
                    <button
                      onClick={() => setGridView(3)}
                      className={`p-2 rounded transition-colors ${
                        gridView === 3 ? 'bg-gray-200' : 'hover:bg-gray-100'
                      }`}
                      aria-label="3 column grid"
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setGridView(4)}
                      className={`p-2 rounded transition-colors ${
                        gridView === 4 ? 'bg-gray-200' : 'hover:bg-gray-100'
                      }`}
                      aria-label="4 column grid"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sort Dropdown - Responsive */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap">
                      <span className="hidden sm:inline">Sort by:</span>
                      <span className="font-medium truncate max-w-[120px] sm:max-w-none">
                        {sortBy === 'newest' && 'Newest'}
                        {sortBy === 'alphabetical' && 'A-Z'}
                        {sortBy === 'price-low' && 'Price ↑'}
                        {sortBy === 'price-high' && 'Price ↓'}
                        {sortBy === 'rating' && 'Top Rated'}
                      </span>
                      <ChevronDown className="w-4 h-4 flex-shrink-0" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 sm:w-56">
                      <DropdownMenuItem onClick={() => setSortBy('newest')}>
                        Newest
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('alphabetical')}>
                        Alphabetically, A-Z
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
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-16 sm:py-20">
                <Loader2 className="w-8 h-8 animate-spin text-green-700" />
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-16 sm:py-20 px-4">
                <p className="text-red-600 mb-2">Failed to load products</p>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredProducts.length === 0 && (
              <div className="text-center py-16 sm:py-20 px-4">
                <p className="text-gray-600 text-base sm:text-lg">No products found</p>
                <p className="text-sm text-gray-500 mt-2">Try adjusting your filters</p>
              </div>
            )}

            {/* Products Grid - Fully Responsive */}
            {!loading && !error && filteredProducts.length > 0 && (
              <div className={`
                grid gap-4 sm:gap-5 lg:gap-6
                grid-cols-2
                ${gridView === 3 ? 'md:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'}
              `}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Products;