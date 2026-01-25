// components/products/ProductCard.tsx
import React, { useState } from 'react';
import { Heart, Star, Eye } from 'lucide-react';
import ProductQuickView from './ProductQuickView';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent opening modal when clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div
        className="group relative bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                -{discount}%
              </span>
            )}
            {product.isBestseller && (
              <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded">
                BESTSELLER
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded">
                OUT OF STOCK
              </span>
            )}
          </div>

          {/* Quick Actions - Show on hover */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsWishlisted(!isWishlisted);
              }}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart
                className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Brand/Vendor */}
          {product.brand && (
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              {product.brand}
            </p>
          )}

          {/* Product Name */}
          <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2 line-clamp-2 hover:text-green-700 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-serif text-gray-900">
              ₹{product.price.toFixed(2)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.comparePrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <ProductQuickView
        product={product}
        open={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}