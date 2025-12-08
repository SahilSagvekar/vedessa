import { Link } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, ChevronDown, LogOut } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/components/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  // const { cartCount, wishlist } = useCart();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, isAdmin, isAuthenticated, signOut } = useAuth();

  // const { user, signOut } = useAuth();

  return (
    <header className="w-full">
      {/* Announcement Bar */}
      {/* <div className="bg-kama-olive text-kama-cream text-xs py-2 text-center">
        Weekend Offer: Complimentary Mini's Worth Upto Rs 5640 On Shopping Above
        Rs 4000 · 10% off on first order above Rs. 1500. Use Code - KAMA10
      </div> */}

      {/* <div className="bg-[#5E7C6B] text-white py-2 px-4 text-center text-sm">
        <marquee className="font-light">
          Weekend Offer: Complimentary Mini's Worth Upto Rs 5640 On Shopping Above Rs 4000 • 10% off on first order above Rs. 1500. Use Code - KAMA10
        </marquee>
      </div> */}

      <div className="bg-[#5E7C6B] text-white py-2 px-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          <span className="font-light">
            Weekend Offer: Complimentary Mini's Worth Upto Rs 5640...
          </span>
          <span className="font-light ml-8">
            Weekend Offer: Complimentary Mini's Worth Upto Rs 5640...
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex flex-col">
              <span className="text-xl tracking-[0.3em] font-display font-medium text-foreground">
                VEDESSA
              </span>
              <span className="text-[10px] tracking-[0.2em] text-muted-foreground">
                AUTHENTIC AYURVEDA
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link
                to="/products?category=skincare"
                className="text-sm font-medium text-foreground hover:text-kama-olive transition-colors"
              >
                SKIN
              </Link>
              <Link
                to="/products?category=haircare"
                className="text-sm font-medium text-foreground hover:text-kama-olive transition-colors"
              >
                HAIR
              </Link>
              <Link
                to="/products?category=bath_body"
                className="text-sm font-medium text-foreground hover:text-kama-olive transition-colors"
              >
                BATH & BODY
              </Link>
              <div className="flex items-center space-x-1 cursor-pointer group">
                <span className="text-sm font-medium text-foreground group-hover:text-kama-olive transition-colors">
                  COLLECTIONS
                </span>
                <ChevronDown className="w-4 h-4 text-foreground group-hover:text-kama-olive transition-colors" />
              </div>
              <Link
                to="/products?category=gifting"
                className="text-sm font-medium text-foreground hover:text-kama-olive transition-colors"
              >
                GIFTING
              </Link>
              <Link
                to="/products"
                className="text-sm font-medium text-foreground hover:text-kama-olive transition-colors"
              >
                BEST SELLER
              </Link>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-muted rounded-full transition-colors">
                <Search className="w-5 h-5 text-foreground" />
              </button>
              <Link
                to="/wishlist"
                className="p-2 hover:bg-muted rounded-full transition-colors relative"
              >
                <Heart className="w-5 h-5 text-foreground" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-kama-orange text-accent-foreground text-[10px] flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-full transition-colors">
                    <User className="w-5 h-5 text-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      {/* <Link to="/admin" className="cursor-pointer">
                        My Account
                      </Link> */}
                      <Link to="/dashboard">
                        {isAdmin ? "Admin Dashboard" : "My Account"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={signOut}
                      className="cursor-pointer text-destructive"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  to="/auth"
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <User className="w-5 h-5 text-foreground" />
                </Link>
              )}
              <Link
                to="/cart"
                className="p-2 hover:bg-muted rounded-full transition-colors relative"
              >
                <ShoppingBag className="w-5 h-5 text-foreground" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-kama-orange text-accent-foreground text-[10px] flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;