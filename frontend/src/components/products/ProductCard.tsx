import { Star, Heart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/components/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Backend product type (matches API response)
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  is_new: boolean;
  is_bestseller: boolean;
  stock: number;
  category_name?: string;
  category_slug?: string;
  collection_name?: string;
  collection_slug?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = async () => {
    // Check if user is logged in
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to add items to your bag.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    // Check stock
    if (product.stock === 0) {
      toast({
        title: "Out of stock",
        description: `${product.name} is currently out of stock.`,
        variant: "destructive",
      });
      return;
    }

    try {
      await addToCart(product.id, 1);
      // Success toast is shown by the hook
    } catch (error) {
      // Error toast is shown by the hook
      console.error('Add to cart failed:', error);
    }
  };

  const handleWishlistToggle = async () => {
    // Check if user is logged in
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to save items to your wishlist.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    try {
      await toggleWishlist(product.id);
      // Success toast is shown by the hook
    } catch (error) {
      // Error toast is shown by the hook
      console.error('Wishlist toggle failed:', error);
    }
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden group">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        {product.is_new && (
          <span className="absolute top-3 left-3 bg-kama-orange text-accent-foreground text-xs px-2 py-1 rounded z-10">
            New
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
            Out of Stock
          </span>
        )}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 bg-card/80 rounded-full hover:bg-card transition-colors z-10"
        >
          <Heart
            className={`w-4 h-4 ${inWishlist ? 'fill-kama-orange text-kama-orange' : 'text-foreground'}`}
          />
        </button>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-kama-orange text-kama-orange" />
          <span className="text-sm font-medium text-foreground">{product.rating}</span>
          <span className="text-sm text-muted-foreground">({product.reviews})</span>
        </div>

        {/* Name */}
        <h3 className="font-medium text-foreground mb-1 line-clamp-2">{product.name}</h3>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{product.description}</p>

        {/* Price & Button */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">₹{product.price.toFixed(2)}</span>
          <Button
            onClick={handleAddToCart}
            variant="outline"
            size="sm"
            className="text-xs border-foreground text-foreground hover:bg-foreground hover:text-background"
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;