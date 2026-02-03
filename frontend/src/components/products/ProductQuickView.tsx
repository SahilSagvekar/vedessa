// components/products/ProductQuickView.tsx
import React, { useState } from 'react';
import { X, Plus, Minus, Heart, Share2, Star, Check, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/components/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProductQuickViewProps {
  product: any;
  open: boolean;
  onClose: () => void;
}

export default function ProductQuickView({ product, open, onClose }: ProductQuickViewProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(product ? isInWishlist(product.id) : false);
  const [addingToCart, setAddingToCart] = useState(false);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to add items to cart',
        variant: 'destructive',
      });
      onClose();
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
      onClose();
      navigate('/auth');
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product.id, quantity);
      onClose();
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
      onClose();
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
    const shareUrl = `${window.location.origin}/products/${product.id}`;
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
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Link Copied',
        description: 'Product link copied to clipboard',
      });
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-4xl lg:max-w-5xl xl:max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 p-6 sm:p-8 md:p-10">
            {/* Left Side - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
                <img
                  src={product.image || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />

                {/* Sale Badge */}
                {product.comparePrice && product.comparePrice > product.price && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    SALE
                  </div>
                )}

                {/* Stock Badge */}
                {product.stock < 10 && product.stock > 0 && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Only {product.stock} left
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Product Details */}
            <div className="flex flex-col">
              {/* Product Header */}
              <div className="mb-6">
                {/* Vendor/Brand */}
                {product.brand && (
                  <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider mb-2">
                    {product.brand}
                  </p>
                )}

                {/* Product Name */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h2>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating)
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
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl sm:text-4xl font-serif text-gray-900">
                    ₹{product.price.toFixed(2)}
                  </span>
                  {product.comparePrice && product.comparePrice > product.price && (
                    <>
                      <span className="text-lg sm:text-xl text-gray-400 line-through">
                        ₹{product.comparePrice.toFixed(2)}
                      </span>
                      <span className="text-sm font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                        Save {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
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

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Color: <span className="text-gray-900">{selectedColor?.name || 'Select'}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all ${selectedColor?.name === color.name
                          ? 'border-gray-900 ring-2 ring-gray-300'
                          : 'border-gray-300 hover:border-gray-400'
                          }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Size: <span className="text-gray-900">{selectedSize || 'Select'}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-md text-sm font-medium transition-all ${selectedSize === size
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 hover:border-gray-400'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Quantity</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="p-2 sm:p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 sm:px-6 py-2 text-base font-medium">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className="p-2 sm:p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addingToCart}
                  className="w-full bg-[#C17855] hover:bg-[#A66545] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 sm:py-4 px-6 rounded-md font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2"
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
                  className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 sm:py-4 px-6 rounded-md font-medium uppercase tracking-wider transition-all"
                >
                  Buy It Now
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={handleWishlistToggle}
                    className={`flex-1 border-2 py-3 px-4 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${isWishlisted
                      ? 'border-red-500 text-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                      }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
                    <span className="hidden sm:inline">{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex-1 border-2 border-gray-300 hover:border-gray-400 py-3 px-4 rounded-md font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>
              </div>

              {/* Product Meta Info */}
              <div className="border-t border-gray-200 pt-6 space-y-2 text-sm">
                {product.vendor && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 min-w-[80px]">Vendor:</span>
                    <span className="text-gray-900 font-medium">{product.vendor}</span>
                  </div>
                )}

                {product.category && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 min-w-[80px]">Category:</span>
                    <span className="text-gray-900 font-medium">{product.category.name}</span>
                  </div>
                )}

                {product.collection && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 min-w-[80px]">Collection:</span>
                    <span className="text-gray-900 font-medium">{product.collection.name}</span>
                  </div>
                )}

                {product.tags && product.tags.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 min-w-[80px]">Tags:</span>
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

              {/* View Full Details Link */}
              {/* <div className="mt-6">

                <Link to={`/products/${product.id}`}
                  onClick={onClose}
                  className="text-sm text-green-700 hover:text-green-800 font-medium underline"
                >
                  View Full Product Details →
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}