import { Link } from 'react-router-dom';

// Wired to real Concern slugs (see backend/scripts/seedProducts.js and the
// Concern model in prisma/schema.prisma) so each card filters precisely via
// /products?concern=<slug> — products only show up here once they've been
// tagged with the matching concern in the admin panel's product form.
const concerns = [
  { name: 'Hair Growth', slug: 'hair-growth', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1786274996/c1_fq6e46.jpg' },
  { name: 'Dandruff', slug: 'dandruff', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1786275312/c2_pr3jez.jpg' },
  { name: 'Acne', slug: 'acne', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1786275592/c3_twoye0.jpg' },
  { name: 'Dry Skin', slug: 'dry-skin', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1786275850/c4_ewkkbf.jpg' },
  { name: 'Tan Removal', slug: 'tan-removal', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1786276015/c5_epyvcj.jpg' },
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
              to={`/products?concern=${encodeURIComponent(concern.slug)}`}
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