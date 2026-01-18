import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/components/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';


const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    cart,
    loading,
    error,
    updateCartItem,
    removeFromCart,
    subtotal,
    tax,
    total,
    itemCount
  } = useCart();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kama-olive"></div>
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
            <h1 className="text-3xl font-display text-foreground mb-4">Error loading cart</h1>
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

  // Empty cart state
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-3xl font-display text-foreground mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Start shopping to add items to your cart
            </p>
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

  const handleUpdateQuantity = async (itemId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Calculate shipping (free over ₹1000, else ₹50)
  const shippingCost = subtotal > 1000 ? 0 : 50;
  const finalTotal = total + shippingCost;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-display text-foreground mb-8">
          Shopping Bag
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg">
                <img
                  src={item.product_image || '/placeholder.svg'}
                  alt={item.product_name}
                  className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">
                    {item.product_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.category || ""}
                  </p>
                  <p className="text-lg font-semibold text-foreground mt-2">
                    ₹{item.product_price.toFixed(2)}
                  </p>
                  {item.stock !== undefined &&
                    item.stock < 10 &&
                    item.stock > 0 && (
                      <p className="text-xs text-orange-600 mt-1">
                        Only {item.stock} left in stock
                      </p>
                    )}
                  {item.stock === 0 && (
                    <p className="text-xs text-red-600 mt-1">Out of stock</p>
                  )}
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-between">
                  <div className="flex items-center gap-2 border border-border rounded order-2 sm:order-1">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity, -1)
                      }
                      className="p-2 hover:bg-muted transition-colors disabled:opacity-50"
                      disabled={item.quantity <= 1}
                      title="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity, 1)
                      }
                      className="p-2 hover:bg-muted transition-colors disabled:opacity-50"
                      disabled={
                        item.stock !== undefined && item.quantity >= item.stock
                      }
                      title="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 order-1 sm:order-2">
                    <p className="text-sm font-medium text-foreground">
                      ₹{item.item_total.toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      title="Remove from cart"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-card p-6 rounded-lg h-fit sticky top-4">
            <h2 className="text-xl font-display text-foreground mb-4">
              Order Summary
            </h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-foreground">
                <span>
                  Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-foreground">
                <span>Tax (18%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 ? "FREE" : `₹${shippingCost.toFixed(2)}`}
                </span>
              </div>

              {subtotal > 1000 && shippingCost === 0 && (
                <p className="text-xs text-green-600">
                  ✓ Free shipping on orders over ₹1,000
                </p>
              )}

              {subtotal < 1000 && (
                <p className="text-xs text-muted-foreground">
                  Add ₹{(1000 - subtotal).toFixed(2)} more for free shipping
                </p>
              )}
            </div>

            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between text-lg font-semibold text-foreground">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* <Button 
              onClick={handleCheckout}
              className="w-full bg-kama-olive hover:bg-kama-olive-light text-kama-cream mb-3"
            >
              Proceed to Checkout
            </Button> */}
            <Link to="/checkout" className="w-full">
              <Button className="w-full bg-kama-olive hover:bg-kama-olive-light text-kama-cream">
                Proceed to Checkout
              </Button>
            </Link>

            <Link to="/products">
              <Button
                variant="outline"
                className="w-full border-kama-olive text-kama-olive hover:bg-kama-olive/10"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;