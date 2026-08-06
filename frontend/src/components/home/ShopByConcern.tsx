import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// Hardcoded for now — swap in real image URLs per concern when ready.
// Not wired to real Category records/slugs yet, so each card links to a
// product search for its name instead of a category filter (works
// regardless of whether a matching category/slug exists in the DB).
const concerns = [
  { name: 'Hair Fall', image: '' },
  { name: 'Hair Growth', image: '' },
  { name: 'Dandruff', image: '' },
  { name: 'Pigmentation', image: '' },
  { name: 'Acne', image: '' },
  { name: 'Dry Skin', image: '' },
  { name: 'Anti-Ageing', image: '' },
  { name: 'Tan Removal', image: '' },
];

export default function ShopByConcern() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollNext = () => {
    scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-10">
          Shop By Concern
        </h2>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {concerns.map((concern) => (
              <Link
                key={concern.name}
                to={`/products?search=${encodeURIComponent(concern.name)}`}
                className="relative flex-shrink-0 w-56 md:w-64 aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group"
              >
                {concern.image ? (
                  <img
                    src={concern.image}
                    alt={concern.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs text-gray-400 px-4 text-center">Image coming soon</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute bottom-4 left-4 right-4 text-white font-medium text-base md:text-lg">
                  {concern.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Scroll-right control */}
          <button
            onClick={scrollNext}
            aria-label="Scroll concerns right"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
}