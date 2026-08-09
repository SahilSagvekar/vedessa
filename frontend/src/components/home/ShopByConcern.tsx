import { Link } from 'react-router-dom';

// Hardcoded for now — swap in real image URLs per concern when ready.
// Not wired to real Category records/slugs yet, so each card links to a
// product search for its name instead of a category filter (works
// regardless of whether a matching category/slug exists in the DB).
const concerns = [
  // { name: 'Hair Fall', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1786274996/c1_fq6e46.jpg' },
  { name: 'Hair Growth', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1786274996/c1_fq6e46.jpg' },
  { name: 'Dandruff', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1786275312/c2_pr3jez.jpg' },
  // { name: 'Pigmentation', image: '' },
  { name: 'Acne', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1786275592/c3_twoye0.jpg' },
  { name: 'Dry Skin', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1786275850/c4_ewkkbf.jpg' },
  // { name: 'Anti-Ageing', image: '' },
  { name: 'Tan Removal', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1786276015/c5_epyvcj.jpg' },
];

export default function ShopByConcern() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6 md:px-10">
        <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-10">
          Shop By Concern
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
          {concerns.map((concern) => (
            <Link
              key={concern.name}
              to={`/products?search=${encodeURIComponent(concern.name)}`}
              className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group"
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
      </div>
    </section>
  );
}