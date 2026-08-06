import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, LogOut, Menu, Truck } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/components/contexts/AuthContext';
import SearchModal from '@/components/search/SearchModal';
import { categoriesService } from '@/services/categoriesService';
import { productsService } from '@/services/productsService';
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

interface NavCategory {
  name: string;
  slug: string;
}

interface NewArrivalProduct {
  id: string;
  name: string;
  image: string | null;
}

const Header = () => {
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, isAdmin, isVendor, isAuthenticated, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Which desktop nav item's hover mega-menu is currently open
  const [openMenu, setOpenMenu] = useState<'new' | 'skin' | 'hair' | null>(null);

  // Data that drives the Skin Care / Hair Care / New & Related mega-menus.
  // Fetched once — shared by both the desktop hover menus and the mobile sheet.
  const [skincareCategories, setSkincareCategories] = useState<NavCategory[]>([]);
  const [haircareCategories, setHaircareCategories] = useState<NavCategory[]>([]);
  const [newArrivals, setNewArrivals] = useState<NewArrivalProduct[]>([]);

  useEffect(() => {
    const fetchNavData = async () => {
      try {
        const [categoriesRes, newArrivalsRes] = await Promise.all([
          categoriesService.getCategories(),
          productsService.getProducts({ isNew: 'true', limit: 4 }),
        ]);

        const categories = categoriesRes?.data || [];
        setSkincareCategories(
          categories
            .filter((cat: any) => cat.group === 'SKINCARE')
            .map((cat: any) => ({ name: cat.name, slug: cat.slug }))
        );
        setHaircareCategories(
          categories
            .filter((cat: any) => cat.group === 'HAIRCARE')
            .map((cat: any) => ({ name: cat.name, slug: cat.slug }))
        );

        const products = newArrivalsRes?.data?.products || [];
        setNewArrivals(
          products.map((p: any) => ({ id: p.id, name: p.name, image: p.image }))
        );
      } catch (err) {
        console.error('Failed to load nav menu data:', err);
      }
    };

    fetchNavData();
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  // Shared nav config — drives both the mobile sheet and (indirectly) the
  // desktop hover menus below, so the two never drift out of sync.
  const menuItems = [
    {
      title: 'NEW & RELATED',
      link: '/products',
    },
    {
      title: 'SKIN CARE',
      link: '/products?group=skincare',
      submenu: skincareCategories.map((cat) => ({
        title: cat.name,
        link: `/products?category=${cat.slug}`,
      })),
    },
    {
      title: 'HAIR CARE',
      link: '/products?group=haircare',
      submenu: haircareCategories.map((cat) => ({
        title: cat.name,
        link: `/products?category=${cat.slug}`,
      })),
    },
    {
      title: 'BEST SELLER',
      link: '/products?filter=bestseller',
    },
  ];

  return (
    <>
      <header className="w-full">
        {/* Announcement Bar */}
        <div className="bg-kama-olive text-kama-cream text-xs py-2 px-4 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            <span className="font-light">
              vedessa - Authentic Ayurveda | 100% Natural & Cruelty-Free Products | Shop Now and Experience the Essence of Ayurveda!
            </span>
            <span className="font-light ml-8">
              vedessa - Authentic Ayurveda | 100% Natural & Cruelty-Free Products | Shop Now and Experience the Essence of Ayurveda!
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
                            <Link
                              to={item.link}
                              onClick={closeMenu}
                              className="block font-semibold text-foreground mb-2 px-4 hover:text-kama-olive transition-colors"
                            >
                              {item.title}
                            </Link>
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
                          {isAdmin ? 'Admin Dashboard' : isVendor ? 'Vendor Dashboard' : 'My Account'}
                        </Link>
                        <Link
                          to="/track-order"
                          onClick={closeMenu}
                          className="block py-3 px-4 text-foreground hover:bg-muted rounded-md transition-colors"
                        >
                          Track Order
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
                {/* New & Related */}
                <div
                  className="relative"
                  onMouseEnter={() => setOpenMenu('new')}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <Link
                    to="/products"
                    className="text-sm font-medium text-foreground hover:text-kama-olive transition-colors"
                  >
                    NEW & RELATED
                  </Link>
                  {openMenu === 'new' && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                      <div className="bg-card border border-border rounded-md shadow-lg p-4 w-72">
                        <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                          New Arrivals
                        </p>
                        {newArrivals.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Check back soon</p>
                        ) : (
                          <div className="space-y-2">
                            {newArrivals.map((product) => (
                              <Link
                                key={product.id}
                                to={`/products/${product.id}`}
                                className="flex items-center gap-3 p-1 rounded-md hover:bg-muted transition-colors"
                              >
                                {product.image && (
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-10 h-10 object-cover rounded flex-shrink-0"
                                  />
                                )}
                                <span className="text-sm text-foreground">{product.name}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                        <Link
                          to="/products?isNew=true"
                          className="block mt-3 pt-3 border-t border-border text-xs font-medium text-kama-olive hover:underline"
                        >
                          View all new arrivals &rarr;
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Skin Care */}
                <div
                  className="relative"
                  onMouseEnter={() => setOpenMenu('skin')}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <Link
                    to="/products?group=skincare"
                    className="text-sm font-medium text-foreground hover:text-kama-olive transition-colors"
                  >
                    SKIN CARE
                  </Link>
                  {openMenu === 'skin' && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                      <div className="bg-card border border-border rounded-md shadow-lg p-4 w-56">
                        {skincareCategories.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Loading...</p>
                        ) : (
                          <div className="space-y-1">
                            {skincareCategories.map((cat) => (
                              <Link
                                key={cat.slug}
                                to={`/products?category=${cat.slug}`}
                                className="block py-1.5 text-sm text-foreground hover:text-kama-olive transition-colors"
                              >
                                {cat.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Hair Care */}
                <div
                  className="relative"
                  onMouseEnter={() => setOpenMenu('hair')}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <Link
                    to="/products?group=haircare"
                    className="text-sm font-medium text-foreground hover:text-kama-olive transition-colors"
                  >
                    HAIR CARE
                  </Link>
                  {openMenu === 'hair' && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                      <div className="bg-card border border-border rounded-md shadow-lg p-4 w-56">
                        {haircareCategories.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Loading...</p>
                        ) : (
                          <div className="space-y-1">
                            {haircareCategories.map((cat) => (
                              <Link
                                key={cat.slug}
                                to={`/products?category=${cat.slug}`}
                                className="block py-1.5 text-sm text-foreground hover:text-kama-olive transition-colors"
                              >
                                {cat.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/products?filter=bestseller"
                  className="text-sm font-medium text-foreground hover:text-kama-olive transition-colors"
                >
                  BEST SELLER
                </Link>
              </div>

              {/* Right: Icons */}
              <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
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
                          {isAdmin ? 'Admin Dashboard' : isVendor ? 'Vendor Dashboard' : 'My Account'}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/track-order" className="cursor-pointer">
                          <Truck className="w-4 h-4 mr-2" />
                          Track Order
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

      {/* Search Modal */}
      <SearchModal open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;