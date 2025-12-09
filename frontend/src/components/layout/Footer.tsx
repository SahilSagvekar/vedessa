import { Link } from 'react-router-dom';

const Footer = () => {
  return (

    <footer className="bg-[#2D5016] text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="font-serif text-xl mb-4 tracking-wider">VEDESSA</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Experience authentic Ayurvedic beauty and wellness products crafted with the finest natural ingredients.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 uppercase tracking-wide text-sm">SHOP</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="#" className="hover:text-white transition-colors">Skincare</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Haircare</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Bath & Body</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Gifting</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 uppercase tracking-wide text-sm">ABOUT</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="#" className="hover:text-white transition-colors">Our Story</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Ayurvedic Principles</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Store Locator</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 uppercase tracking-wide text-sm">CUSTOMER CARE</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="#" className="hover:text-white transition-colors">Track Order</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Returns</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Shipping Info</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">FAQs</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-700 mt-12 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2026 VEDESSA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
    // <footer className="bg-kama-olive text-kama-cream">
    //   <div className="container mx-auto px-4 py-12">
    //     <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    //       {/* Brand */}
    //       <div>
    //         <h3 className="text-lg tracking-[0.2em] font-display font-medium mb-4">VEDESSA</h3>
    //         <p className="text-sm text-kama-cream/80 leading-relaxed">
    //           Experience authentic Ayurvedic beauty and wellness products crafted with the finest natural ingredients.
    //         </p>
    //       </div>

    //       {/* Shop */}
    //       <div>
    //         <h4 className="text-sm font-semibold mb-4 tracking-wide">SHOP</h4>
    //         <ul className="space-y-2">
    //           <li><Link to="/products?category=skincare" className="text-sm text-kama-cream/80 hover:text-kama-cream transition-colors">Skincare</Link></li>
    //           <li><Link to="/products?category=haircare" className="text-sm text-kama-cream/80 hover:text-kama-cream transition-colors">Haircare</Link></li>
    //           <li><Link to="/products?category=bath_body" className="text-sm text-kama-cream/80 hover:text-kama-cream transition-colors">Bath & Body</Link></li>
    //           <li><Link to="/products?category=gifting" className="text-sm text-kama-cream/80 hover:text-kama-cream transition-colors">Gifting</Link></li>
    //         </ul>
    //       </div>

    //       {/* About */}
    //       <div>
    //         <h4 className="text-sm font-semibold mb-4 tracking-wide">ABOUT</h4>
    //         <ul className="space-y-2">
    //           <li><Link to="/" className="text-sm text-kama-cream/80 hover:text-kama-cream transition-colors">Our Story</Link></li>
    //           <li><Link to="/" className="text-sm text-kama-cream/80 hover:text-kama-cream transition-colors">Ayurvedic Principles</Link></li>
    //           <li><Link to="/" className="text-sm text-kama-cream/80 hover:text-kama-cream transition-colors">Store Locator</Link></li>
    //           <li><Link to="/" className="text-sm text-kama-cream/80 hover:text-kama-cream transition-colors">Contact</Link></li>
    //         </ul>
    //       </div>

    //       {/* Customer Care */}
    //       <div>
    //         <h4 className="text-sm font-semibold mb-4 tracking-wide">CUSTOMER CARE</h4>
    //         <ul className="space-y-2">
    //           <li><Link to="/" className="text-sm text-kama-cream/80 hover:text-kama-cream transition-colors">Track Order</Link></li>
    //           <li><Link to="/" className="text-sm text-kama-cream/80 hover:text-kama-cream transition-colors">Returns</Link></li>
    //           <li><Link to="/" className="text-sm text-kama-cream/80 hover:text-kama-cream transition-colors">Shipping Info</Link></li>
    //           <li><Link to="/" className="text-sm text-kama-cream/80 hover:text-kama-cream transition-colors">FAQs</Link></li>
    //         </ul>
    //       </div>
    //     </div>

    //     <div className="border-t border-kama-cream/20 mt-8 pt-8 text-center">
    //       <p className="text-sm text-kama-cream/60">© 2024 VEDESSA. All rights reserved.</p>
    //     </div>
    //   </div>
    // </footer>
  );
};

export default Footer;