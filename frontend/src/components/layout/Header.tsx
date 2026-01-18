import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, LogOut, Menu, ChevronDown } from 'lucide-react';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const Header = () => {
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, isAdmin, isAuthenticated, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const menuItems = [
    {
      title: 'SKIN',
      link: '/products?category=skincare',
    },
    {
      title: 'HAIR',
      link: '/products?category=haircare',
    },
    {
      title: 'BATH & BODY',
      link: '/products?category=bath_body',
    },
    {
      title: 'COLLECTIONS',
      submenu: [
        { title: 'Bringaras', link: '/products?collection=bringaras' },
        { title: 'Eladhi', link: '/products?collection=eladhi' },
        { title: 'Ashwaras', link: '/products?collection=ashwaras' },
        { title: 'Kumkumadi', link: '/products?collection=kumkumadi' },
      ],
    },
    {
      title: 'GIFTING',
      link: '/products?category=gifting',
    },
    {
      title: 'BEST SELLER',
      link: '/products?filter=bestseller',
    },
  ];

  return (
    <header className="w-full">
      {/* Announcement Bar */}
      <div className="bg-kama-olive text-kama-cream text-xs py-2 px-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          <span className="font-light">
            Weekend Offer: Complimentary Mini's Worth Upto Rs 5640 On Shopping Above Rs 4000 • 10% off on first order above Rs. 1500. Use Code - KAMA10
          </span>
          <span className="font-light ml-8">
            Weekend Offer: Complimentary Mini's Worth Upto Rs 5640 On Shopping Above Rs 4000 • 10% off on first order above Rs. 1500. Use Code - KAMA10
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Hamburger Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2 hover:bg-muted rounded-full transition-colors flex-shrink-0">
                  <Menu className="w-6 h-6 text-foreground" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <img
                      src="/logo/Gemini_Generated_Image_rpc7qhrpc7qhrpc7.png"
                      alt="Vedessa"
                      className="h-12 w-auto"
                    />
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col space-y-1">
                  {menuItems.map((item, index) => (
                    <div key={index}>
                      {item.submenu ? (
                        <div className="py-2">
                          <div className="font-semibold text-foreground mb-2 px-4">
                            {item.title}
                          </div>
                          <div className="pl-6 space-y-1">
                            {item.submenu.map((subitem, subindex) => (
                              <Link
                                key={subindex}
                                to={subitem.link}
                                onClick={closeMenu}
                                className="block py-2 px-4 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                              >
                                {subitem.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          to={item.link}
                          onClick={closeMenu}
                          className="block py-3 px-4 text-foreground hover:bg-muted rounded-md transition-colors font-medium"
                        >
                          {item.title}
                        </Link>
                      )}
                    </div>
                  ))}

                  {/* Divider */}
                  <div className="border-t border-border my-4"></div>

                  {/* User Menu Items in Sidebar */}
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={closeMenu}
                        className="block py-3 px-4 text-foreground hover:bg-muted rounded-md transition-colors"
                      >
                        {isAdmin ? 'Admin Dashboard' : 'My Account'}
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          closeMenu();
                        }}
                        className="block w-full text-left py-3 px-4 text-destructive hover:bg-muted rounded-md transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={closeMenu}
                      className="block py-3 px-4 text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      Login / Register
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Center: Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src="/logo/1.png"
                alt="Vedessa - Authentic Ayurveda"
                className="h-14 md:h-16 w-auto"
              />
            </Link>

            {/* Center-Right: Navigation Links (Hidden on small screens) */}
            <div className="hidden xl:flex items-center space-x-6 flex-1 justify-center">
              <Link to="/products?category=skincare" className="text-sm font-medium text-foreground hover:text-kama-olive transition-colors">
                SKIN
              </Link>
              <Link to="/products?category=haircare" className="text-sm font-medium text-foreground hover:text-kama-olive transition-colors">
                HAIR
              </Link>
              <Link to="/products?category=bath_body" className="text-sm font-medium text-foreground hover:text-kama-olive transition-colors">
                BATH & BODY
              </Link>

              {/* Collections Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-kama-olive transition-colors">
                  <span>COLLECTIONS</span>
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link to="/products?collection=bringaras" className="cursor-pointer">
                      Bringaras
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/products?collection=eladhi" className="cursor-pointer">
                      Eladhi
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/products?collection=ashwaras" className="cursor-pointer">
                      Ashwaras
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/products?collection=kumkumadi" className="cursor-pointer">
                      Kumkumadi
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/products?category=gifting" className="text-sm font-medium text-foreground hover:text-kama-olive transition-colors">
                GIFTING
              </Link>
              <Link to="/products?filter=bestseller" className="text-sm font-medium text-foreground hover:text-kama-olive transition-colors">
                BEST SELLER
              </Link>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
              <button className="p-2 hover:bg-muted rounded-full transition-colors">
                <Search className="w-5 h-5 text-foreground" />
              </button>
              <Link to="/wishlist" className="p-2 hover:bg-muted rounded-full transition-colors relative">
                <Heart className="w-5 h-5 text-foreground" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-kama-orange text-accent-foreground text-[10px] flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-full transition-colors">
                    <User className="w-5 h-5 text-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        {isAdmin ? 'Admin Dashboard' : 'My Account'}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth" className="p-2 hover:bg-muted rounded-full transition-colors">
                  <User className="w-5 h-5 text-foreground" />
                </Link>
              )}
              <Link to="/cart" className="p-2 hover:bg-muted rounded-full transition-colors relative">
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