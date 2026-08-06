import { Link } from 'react-router-dom';

const posts = [
  { caption: 'Ayurveda meets everyday skincare', image: '' },
  { caption: 'From root to radiance', image: '' },
  { caption: 'Formulated with traditional herbs', image: '' },
  { caption: 'Your daily ritual, reimagined', image: '' },
  { caption: 'Clean ingredients, visible results', image: '' },
  { caption: 'Ancient wisdom, modern routine', image: '' },
  { caption: 'Ayurvedic care, thoughtfully made', image: '' },
  { caption: 'Loved by our community', image: '' },
];

export default function InstagramGrid() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-900 mb-10">
          Shop Vedessa's Instagram @vedessa
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {posts.map((post, i) => (
            <Link
              key={i}
              to="/products"
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group"
            >
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xs text-gray-400 px-4 text-center">Image coming soon</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="block text-white text-xs md:text-sm leading-snug">{post.caption}</span>
                <span className="block text-white text-[10px] tracking-wider uppercase underline underline-offset-2 mt-1">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}