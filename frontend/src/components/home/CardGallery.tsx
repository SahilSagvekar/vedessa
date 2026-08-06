import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface CardGalleryItem {
  title: string;
  subtitle?: string;
  image: string; // leave '' for now — placeholder shown instead
  href?: string;
}

interface CardGalleryProps {
  title: string;
  viewAllHref?: string;
  items: CardGalleryItem[];
  cardWidthClass?: string; // e.g. 'w-48' — defaults below
  showShopNow?: boolean; // adds a small "SHOP NOW" line under the title
}

export default function CardGallery({
  title,
  viewAllHref,
  items,
  cardWidthClass = 'w-52 md:w-60',
  showShopNow = false,
}: CardGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollNext = () => {
    scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900">{title}</h2>
          {viewAllHref && (
            <Link to={viewAllHref} className="text-sm underline text-gray-700 hover:text-gray-900">
              View All
            </Link>
          )}
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {items.map((item, i) => {
              const Card = (
                <div className={`relative flex-shrink-0 ${cardWidthClass} aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group`}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs text-gray-400 px-4 text-center">Image coming soon</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="block text-white font-medium text-sm md:text-base">{item.title}</span>
                    {item.subtitle && (
                      <span className="block text-white/80 text-xs mt-0.5">{item.subtitle}</span>
                    )}
                    {showShopNow && (
                      <span className="block text-white text-[10px] tracking-wider uppercase underline underline-offset-2 mt-1">
                        Shop Now
                      </span>
                    )}
                  </div>
                </div>
              );

              return item.href ? (
                <Link key={`${item.title}-${i}`} to={item.href}>
                  {Card}
                </Link>
              ) : (
                <div key={`${item.title}-${i}`}>{Card}</div>
              );
            })}
          </div>

          <button
            onClick={scrollNext}
            aria-label={`Scroll ${title} right`}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
}