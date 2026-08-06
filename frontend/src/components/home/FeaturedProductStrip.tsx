import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Heart } from 'lucide-react';

export interface FeaturedProductItem {
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  image: string; // leave '' for now — placeholder shown instead
}

interface FeaturedProductStripProps {
  title: string;
  items: FeaturedProductItem[];
}

export default function FeaturedProductStrip({ title, items }: FeaturedProductStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  const scrollNext = () => {
    scrollRef.current?.scrollBy({ left: 280, behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-[#faf3ee]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-900 mb-10">{title}</h2>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {items.map((item, i) => {
              const discountPct = item.comparePrice
                ? Math.round(((item.comparePrice - item.price) / item.comparePrice) * 100)
                : null;

              return (
                <div
                  key={`${item.name}-${i}`}
                  onClick={() => navigate('/products')}
                  className="flex-shrink-0 w-52 md:w-56 cursor-pointer group"
                >
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-white border border-gray-200">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-gray-400 px-4 text-center">Image coming soon</span>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLiked((prev) => ({ ...prev, [i]: !prev[i] }));
                      }}
                      aria-label="Save to wishlist"
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
                    >
                      <Heart className={`w-4 h-4 ${liked[i] ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                    </button>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 truncate">{item.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-semibold text-gray-900">₹{item.price.toLocaleString('en-IN')}</span>
                      {item.comparePrice && (
                        <>
                          <span className="text-xs text-gray-400 line-through">
                            ₹{item.comparePrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-green-700 font-medium">{discountPct}% OFF</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={scrollNext}
            aria-label={`Scroll ${title} right`}
            className="hidden md:flex absolute right-0 top-[38%] -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
}