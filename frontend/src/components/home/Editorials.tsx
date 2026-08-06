import { Link } from 'react-router-dom';

const featured = {
  title: 'VEDESSA JOURNAL',
  subtitle: 'The Ritual Issue',
  image: '',
};

const articles = [
  {
    label: 'INSIDE OUR FORMULATIONS',
    title: 'What Makes Ayurvedic Skincare Different',
    description: 'A look at the herbs and traditional processes behind every Vedessa formula.',
    cta: 'Read More',
    image: '',
  },
  {
    label: 'BUILDING A ROUTINE',
    title: 'Creating a Daily Ritual That Actually Works',
    description: 'Your guide to layering Vedessa products for morning and night.',
    cta: 'Read More',
    image: '',
  },
];

export default function Editorials() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900">Vedessa Editorials</h2>
          <Link to="/about" className="text-sm underline text-gray-700 hover:text-gray-900">
            Read More
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative md:col-span-1 aspect-[4/5] rounded-xl overflow-hidden bg-gray-900 border border-gray-200">
            {featured.image ? (
              <img src={featured.image} alt={featured.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xs text-gray-400 px-4 text-center">Image coming soon</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="block text-white/80 text-xs tracking-widest uppercase">{featured.title}</span>
              <span className="block text-white text-2xl font-serif mt-1">{featured.subtitle}</span>
            </div>
          </div>

          <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
            {articles.map((article) => (
              <div key={article.title} className="flex flex-col">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  {article.image ? (
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs text-gray-400 px-4 text-center">Image coming soon</span>
                    </div>
                  )}
                </div>
                <span className="text-[10px] tracking-widest uppercase text-gray-400 mt-4">{article.label}</span>
                <h3 className="text-base font-medium text-gray-900 mt-1">{article.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{article.description}</p>
                <Link
                  to="/about"
                  className="mt-3 inline-block w-fit px-5 py-2 border border-gray-300 rounded-md text-xs font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  {article.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}