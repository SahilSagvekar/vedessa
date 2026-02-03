import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Loader2, Plus, Minus, Heart, Share2, Star, Check, ChevronLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/components/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import productsService from '@/services/productsService';
import ProductReviews from '@/components/product/ProductReviews';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fetch product from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch from backend API
        const response = await productsService.getProduct(slug);

        if (response.data) {
          // Transform backend response to expected format
          const productData = response.data;
          setProduct({
            id: productData.id,
            name: productData.name,
            slug: slug,
            description: productData.description,
            price: productData.price,
            comparePrice: productData.compare_price || null,
            stock: productData.stock,
            isBestseller: productData.is_bestseller,
            isNew: productData.is_new,
            rating: productData.rating,
            reviewCount: productData.reviews || 0,
            brand: 'Vedessa',
            vendor: 'Vedessa Ayurveda',
            category: productData.category_name ? { name: productData.category_name } : null,
            collection: productData.collection_name ? { name: productData.collection_name } : null,
            tags: ['Natural', 'Ayurvedic'],
            image: productData.image,
            images: productData.image ? [
              { url: productData.image, alt: productData.name }
            ] : []
          });
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  // Check if product is in wishlist
  useEffect(() => {
    if (product && isAuthenticated) {
      setIsWishlisted(isInWishlist(product.id));
    }
  }, [product, isAuthenticated, isInWishlist]);

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to add items to cart',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product.id, quantity);
      toast({
        title: 'Added to Cart',
        description: `${product.name} has been added to your cart`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to proceed',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product.id, quantity);
      navigate('/checkout');
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to add items to wishlist',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        setIsWishlisted(false);
        toast({
          title: 'Removed from Wishlist',
          description: `${product.name} has been removed from your wishlist`,
        });
      } else {
        await addToWishlist(product.id);
        setIsWishlisted(true);
        toast({
          title: 'Added to Wishlist',
          description: `${product.name} has been added to your wishlist`,
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update wishlist',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `Check out ${product.name} on Vedessa!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Link Copied',
        description: 'Product link copied to clipboard',
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-green-700" />
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-serif text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>
      </Layout>
    );
  }

  const discount = product.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/products" className="text-gray-600 hover:text-gray-900">Products</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={product.images?.[selectedImage]?.url || product.images?.[0]?.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{discount}%
                  </div>
                )}
                {product.isBestseller && (
                  <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                    BESTSELLER
                  </div>
                )}
              </div>

              {/* Stock Badge */}
              {product.stock > 0 && product.stock < 10 && (
                <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Only {product.stock} left
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
                {product.images.map((image: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                      ? 'border-green-700 ring-2 ring-green-200'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Product Details */}
          <div className="flex flex-col">
            {/* Brand */}
            {product.brand && (
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                {product.brand}
              </p>
            )}

            {/* Product Name */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount || 0} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-gray-200">
              <span className="text-4xl sm:text-5xl font-serif text-gray-900">
                ₹{product.price.toFixed(2)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <>
                  <span className="text-xl sm:text-2xl text-gray-400 line-through">
                    ₹{product.comparePrice.toFixed(2)}
                  </span>
                  <span className="text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-base text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Availability */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Availability:</span>
                {product.stock > 0 ? (
                  <div className="flex items-center gap-1 text-green-700">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">{product.stock} in stock</span>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-red-600">Out of stock</span>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-sm font-medium text-gray-700 mb-3">Quantity</p>
              <div className="flex items-center border border-gray-300 rounded-md w-fit">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-8 py-3 text-lg font-medium border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className="w-full bg-[#C17855] hover:bg-[#A66545] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 px-6 rounded-md text-base font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                {addingToCart ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add to Cart'
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0 || addingToCart}
                className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 px-6 rounded-md text-base font-medium uppercase tracking-wider transition-all"
              >
                Buy It Now
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleWishlistToggle}
                  className={`border-2 py-3 px-4 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${isWishlisted
                    ? 'border-red-500 text-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                    }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
                  <span className="hidden sm:inline">{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="border-2 border-gray-300 hover:border-gray-400 py-3 px-4 rounded-md font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </div>

            {/* Product Meta */}
            <div className="border-t border-gray-200 pt-6 space-y-3 text-sm">
              {product.vendor && (
                <div className="flex gap-2">
                  <span className="text-gray-500 min-w-[100px]">Vendor:</span>
                  <span className="text-gray-900 font-medium">{product.vendor}</span>
                </div>
              )}

              {product.category && (
                <div className="flex gap-2">
                  <span className="text-gray-500 min-w-[100px]">Category:</span>
                  <span className="text-gray-900 font-medium">
                    {typeof product.category === 'string' ? product.category : product.category.name}
                  </span>
                </div>
              )}

              {product.collection && (
                <div className="flex gap-2">
                  <span className="text-gray-500 min-w-[100px]">Collection:</span>
                  <span className="text-gray-900 font-medium">
                    {typeof product.collection === 'string' ? product.collection : product.collection.name}
                  </span>
                </div>
              )}

              {product.tags && product.tags.length > 0 && (
                <div className="flex gap-2">
                  <span className="text-gray-500 min-w-[100px]">Tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {product.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200 mt-12">
          <ProductReviews
            productId={product.id}
            productName={product.name}
          />
        </div>
      </div>
    </Layout>
  );
}