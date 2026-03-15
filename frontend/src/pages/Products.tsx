import { useState, useEffect } from 'react';
import { ChevronDown, Loader2, Grid3x3, LayoutGrid, SlidersHorizontal, X, Star } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { categoriesService } from '@/services/categoriesService';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const searchBarQuery = searchParams.get('search') || '';
  
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [selectedCollection, setSelectedCollection] = useState<string>(searchParams.get('collection') || 'all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [inStock, setInStock] = useState<string>('all');
  const [showNew, setShowNew] = useState<boolean>(false);
  const [showBestsellers, setShowBestsellers] = useState<boolean>(false);
  const [gridView, setGridView] = useState<number>(4); // 3 or 4 columns
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);

  // Fetch categories and collections
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, colsRes] = await Promise.all([
          categoriesService.getCategories(),
          categoriesService.getCollections()
        ]);
        setCategories(catsRes.data);
        setCollections(colsRes.data);
      } catch (err) {
        console.error('Failed to fetch filter data:', err);
      }
    };
    fetchData();
  }, []);

  // Build API filters
  const apiFilters: any = {};
  
  if (selectedCategory !== 'all') {
    apiFilters.category = selectedCategory;
  }
  
  if (selectedCollection !== 'all') {
    apiFilters.collection = selectedCollection;
  }

  if (searchBarQuery) {
    apiFilters.search = searchBarQuery;
  }

  if (priceRange !== 'all') {
    const [min, max] = priceRange.split('-').map(Number);
    apiFilters.minPrice = min;
    apiFilters.maxPrice = max;
  }

  if (minRating > 0) {
    apiFilters.minRating = minRating;
  }

  if (inStock !== 'all') {
    apiFilters.inStock = inStock;
  }

  if (showNew) {
    apiFilters.isNew = 'true';
  }

  if (showBestsellers) {
    apiFilters.isBestseller = 'true';
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
            <input 
              type="radio" 
              name="avail" 
              checked={inStock === 'all'}
              onChange={() => setInStock('all')}
              className="border-gray-300"
            />
            <span>All Availability</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="radio" 
              name="avail" 
              checked={inStock === 'true'}
              onChange={() => setInStock('true')}
              className="border-gray-300"
            />
            <span>In stock</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="radio" 
              name="avail" 
              checked={inStock === 'false'}
              onChange={() => setInStock('false')}
              className="border-gray-300"
            />
            <span>Out of stock</span>
          </label>
        </div>
      </div>

      {/* Product Status Filter */}
      <div className="border-b border-gray-200 pb-6">
        <button className="flex items-center justify-between w-full mb-3">
          <span className="text-sm font-medium">Product Status</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="checkbox" 
              checked={showNew}
              onChange={(e) => setShowNew(e.target.checked)}
              className="rounded border-gray-300" 
            />
            <span>New Arrivals</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="checkbox" 
              checked={showBestsellers}
              onChange={(e) => setShowBestsellers(e.target.checked)}
              className="rounded border-gray-300" 
            />
            <span>Bestsellers</span>
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


      {/* Category Filter */}
      <div className="border-b border-gray-200 pb-6">
        <button className="flex items-center justify-between w-full mb-3">
          <span className="text-sm font-medium">Category</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="radio" 
              name="category"
              checked={selectedCategory === 'all'}
              onChange={() => setSelectedCategory('all')}
              className="border-gray-300" 
            />
            <span>All Categories</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <input 
                type="radio" 
                name="category"
                checked={selectedCategory === cat.slug}
                onChange={() => setSelectedCategory(cat.slug)}
                className="border-gray-300" 
              />
              <span>{cat.name} ({cat.product_count})</span>
            </label>
          ))}
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
          {collections.map((col) => (
            <label key={col.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <input 
                type="radio" 
                name="collection"
                checked={selectedCollection === col.slug}
                onChange={() => setSelectedCollection(col.slug)}
                className="border-gray-300" 
              />
              <span>{col.name} ({col.product_count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="pb-6">
        <button className="flex items-center justify-between w-full mb-3">
          <span className="text-sm font-medium">Customer Review</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-2 text-sm cursor-pointer">
              <input 
                type="radio" 
                name="rating" 
                checked={minRating === rating}
                onChange={() => setMinRating(rating)}
                className="border-gray-300" 
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-1 text-gray-600">& Up</span>
              </div>
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="radio" 
              name="rating" 
              checked={minRating === 0}
              onChange={() => setMinRating(0)}
              className="border-gray-300" 
            />
            <span>All Ratings</span>
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