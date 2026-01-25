import { Link, useNavigate } from 'react-router-dom';
import { Heart, Loader2, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/components/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const Wishlist = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { wishlist, loading, error, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/auth');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleRemoveFromWishlist = async (productId: string, productName: string) => {
    try {
      await removeFromWishlist(productId);
      // Success toast is shown by the hook
    } catch (error) {
      console.error('Remove failed:', error);
    }
  };

  const handleAddToCart = async (productId: string, productName: string) => {
    try {
      await addToCart(productId, 1);
      // Success toast is shown by the hook
    } catch (error) {
      console.error('Add to cart failed:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-3xl font-display text-foreground mb-4">Error loading wishlist</h1>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Link to="/products">
              <Button className="bg-kama-olive hover:bg-kama-olive-light text-kama-cream">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Empty wishlist state
  if (!wishlist || wishlist.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="mb-8">
            <h1 className="text-4xl font-display text-foreground">My Wishlist</h1>
            <p className="text-muted-foreground mt-1">0 items</p>
          </div>

          <div className="max-w-md mx-auto text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-display text-foreground mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8">
              Save items you love for later
            </p>
            <Link to="/products">
              <Button className="bg-kama-olive hover:bg-kama-olive-light text-kama-cream">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-display text-foreground">My Wishlist</h1>
          <p className="text-muted-foreground mt-1">{wishlist.length} items</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-card rounded-lg overflow-hidden group">
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => handleRemoveFromWishlist(item.product_id, item.product_name)}
                  className="absolute top-3 right-3 p-2 bg-card/80 rounded-full hover:bg-card transition-colors z-10"
                  title="Remove from wishlist"
                >
                  <Heart className="w-4 h-4 fill-kama-orange text-kama-orange" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Name */}
                <h3 className="font-medium text-foreground mb-1 line-clamp-2">
                  {item.product_name}
                </h3>
                
                {/* Category */}
                {item.category && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                    {item.category}
                  </p>
                )}

                {/* Price & Button */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-foreground">
                    ₹{item.product_price.toFixed(2)}
                  </span>
                  <Button
                    onClick={() => handleAddToCart(item.product_id, item.product_name)}
                    variant="outline"
                    size="sm"
                    className="text-xs border-foreground text-foreground hover:bg-foreground hover:text-background"
                  >
                    Add to Bag
                  </Button>
                </div>

                {/* Stock status */}
                {item.stock !== undefined && (
                  <>
                    {item.stock === 0 && (
                      <p className="text-xs text-red-600 mt-2">Out of stock</p>
                    )}
                    {item.stock > 0 && item.stock < 10 && (
                      <p className="text-xs text-orange-600 mt-2">
                        Only {item.stock} left in stock
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Link to="/products">
            <Button variant="outline" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;