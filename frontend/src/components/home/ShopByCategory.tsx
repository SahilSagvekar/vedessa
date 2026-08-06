import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// Hardcoded for now — swap in real image URLs per category when ready.
// Not wired to real Category records/slugs yet, so each circle links to a
// product search for its name instead of a category filter (works
// regardless of whether a matching category/slug exists in the DB).
const categories = [
  { name: 'Face Wash', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1785952385/2_cqxhb1.jpg' },
  { name: 'Gel', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1785954355/7_ru12fx.jpg' },
  { name: 'Face Cream', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1785953941/6_u7klb1.jpg' },
  { name: 'Shampoo', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1785953332/4_xxpiuu.jpg' },
  { name: 'Oil', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1785953661/5_mkxg1z.jpg' },
  { name: 'Sun Screen', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1785952496/3_i3jxdo.jpg' },
  { name: 'Cleanser', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1786041744/a_b1rdhw.jpg' },
];

export default function ShopByCategory() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollNext = () => {
    scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-900 mb-10">
          Shop By Category
        </h2>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?search=${encodeURIComponent(category.name)}`}
                className="flex flex-col items-center flex-shrink-0 group"
              >
                <div className="w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center transition-transform group-hover:scale-105">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-400 px-4 text-center">Image coming soon</span>
                  )}
                </div>
                <span className="mt-4 text-sm md:text-base text-gray-900 text-center max-w-[9rem]">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Scroll-right control */}
          <button
            onClick={scrollNext}
            aria-label="Scroll categories right"
            className="hidden md:flex absolute right-0 top-1/3 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="flex justify-center mt-8">
          <Link
            to="/products"
            className="px-8 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}