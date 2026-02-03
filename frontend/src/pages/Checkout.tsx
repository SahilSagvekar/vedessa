import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CreditCard, Truck } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/components/contexts/AuthContext';
import { useRazorpay } from '@/hooks/useRazorpay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import couponService from '@/services/couponService';
import { Tag, X } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cart, loading: cartLoading } = useCart();
  const { initiatePayment, loading: paymentLoading } = useRazorpay();
  const { toast } = useToast();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !cartLoading) {
      navigate('/auth');
    }
  }, [isAuthenticated, cartLoading, navigate]);

  // Redirect if cart is empty (but wait for loading to finish first)
  useEffect(() => {
    if (!cartLoading && cart !== null && (!cart.items || cart.items.length === 0)) {
      navigate('/cart');
      toast({
        title: 'Cart is empty',
        description: 'Add items to cart before checkout',
      });
    }
  }, [cart, cartLoading, navigate, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const required = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];

    for (const field of required) {
      if (!shippingAddress[field]?.trim()) {
        toast({
          title: 'Validation Error',
          description: `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`,
          variant: 'destructive',
        });
        return false;
      }
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingAddress.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return false;
    }

    // Validate phone (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(shippingAddress.phone)) {
      toast({
        title: 'Invalid Phone',
        description: 'Please enter a valid 10-digit phone number',
        variant: 'destructive',
      });
      return false;
    }

    // Validate pincode (6 digits)
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(shippingAddress.pincode)) {
      toast({
        title: 'Invalid Pincode',
        description: 'Please enter a valid 6-digit pincode',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      setIsApplyingCoupon(true);
      const response = await couponService.validateCoupon(couponCode, cart.summary.total);

      if (response.success) {
        setAppliedCoupon(response.data);
        toast({
          title: 'Coupon Applied!',
          description: `You saved ₹${response.data.discountAmount}`,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Invalid Coupon',
        description: typeof error === 'string' ? error : (error.response?.data?.message || 'Failed to apply coupon'),
        variant: 'destructive',
      });
      setAppliedCoupon(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    const shippingCost = cart.summary.subtotal > 1000 ? 0 : 50;
    const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;

    // Prepare order data
    const orderData = {
      total: Math.max(0, cart.summary.total + shippingCost - discountAmount),
      subtotal: cart.summary.subtotal,
      tax: cart.summary.tax,
      shipping: shippingCost,
      discountAmount,
      couponId: appliedCoupon?.id,
      shippingAddress,
      userEmail: user.email,
      items: cart.items.map(item => ({
        productId: item.product_id,
        productName: item.product_name,
        productImage: item.product_image,
        quantity: item.quantity,
        price: item.product_price,
      })),
    };

    // Initiate Razorpay payment
    await initiatePayment(orderData);
  };

  if (cartLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!cartLoading && (!cart || !cart.items || cart.items.length === 0)) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Your cart is empty</p>
        </div>
      </Layout>
    );
  }

  const shippingCost = cart.summary.subtotal > 1000 ? 0 : 50;
  const finalTotal = cart.summary.total + shippingCost;

  return (
    <Layout>
      <div className="bg-kama-olive text-kama-cream py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-display mb-2">Checkout</h1>
          <p className="text-kama-cream/80">Complete your order</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Shipping Address Form */}
          <div className="md:col-span-2 bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Truck className="w-5 h-5 text-foreground" />
              <h2 className="text-xl font-semibold text-foreground">Shipping Address</h2>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={shippingAddress.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  maxLength={10}
                />
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  placeholder="House No, Street, Area"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    placeholder="Maharashtra"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={shippingAddress.pincode}
                    onChange={handleInputChange}
                    placeholder="400001"
                    maxLength={6}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-card border border-border rounded-lg p-6 h-fit">
            <h2 className="text-xl font-semibold text-foreground mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.product_name} x {item.quantity}
                  </span>
                  <span className="text-foreground">₹{item.item_total.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">₹{cart.summary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (18%)</span>
                <span className="text-foreground">₹{cart.summary.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">
                  {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}
                </span>
              </div>
              {cart.summary.subtotal > 1000 && (
                <p className="text-xs text-green-600">🎉 You get free shipping!</p>
              )}

              {/* Coupon UI */}
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-3">Apply Coupon</p>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm font-bold text-green-700">{appliedCoupon.code}</p>
                        <p className="text-xs text-green-600">₹{appliedCoupon.discountAmount.toFixed(2)} saved</p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-green-700 hover:text-green-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="uppercase"
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode}
                      variant="outline"
                      className="border-kama-olive text-kama-olive"
                    >
                      {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                    </Button>
                  </div>
                )}
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-sm text-green-600 font-medium pt-2">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>-₹{appliedCoupon.discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">₹{(finalTotal - (appliedCoupon?.discountAmount || 0)).toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={handlePlaceOrder}
              disabled={paymentLoading}
              className="w-full mt-6 bg-kama-olive hover:bg-kama-olive-light text-kama-cream"
            >
              {paymentLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Proceed to Payment
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Secure payment powered by Razorpay
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;