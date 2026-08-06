import { Link } from 'react-router-dom';

export interface BannerGridItem {
  title: string;
  image: string; // leave '' for now — placeholder shown instead
  href?: string;
  /** Only used for items after the first (the hero). Column width out of
   * 4 in the secondary grid — 2 = half width, 1 = quarter width. */
  span?: 1 | 2;
}

interface BannerGridProps {
  title: string;
  /** First item is the large hero card on the left; the rest lay out in a
   * 4-column, 2-row grid on the right (widths controlled by `span`). */
  items: BannerGridItem[];
}

function BannerCard({ item, className = '' }: { item: BannerGridItem; className?: string }) {
  const content = (
    <div className={`relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group h-full ${className}`}>
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4">
        <span className="block text-white font-medium text-sm md:text-base">{item.title}</span>
      </div>
    </div>
  );

  return item.href ? (
    <Link to={item.href} className="block h-full">
      {content}
    </Link>
  ) : (
    content
  );
}

export default function BannerGrid({ title, items }: BannerGridProps) {
  const [hero, ...secondary] = items;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-10">{title}</h2>

        <div className="flex flex-col md:flex-row gap-4 md:h-[560px]">
          {/* Hero card — full height on desktop, own row on mobile */}
          {hero && (
            <div className="md:w-1/3 aspect-[4/5] md:aspect-auto md:h-full">
              <BannerCard item={hero} />
            </div>
          )}

          {/* Secondary cards — 4-col / 2-row grid on desktop, simple 2-col grid on mobile */}
          <div className="md:w-2/3 md:h-full grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4">
            {secondary.map((item, i) => (
              <div
                key={`${item.title}-${i}`}
                className={`aspect-square md:aspect-auto ${
                  item.span === 1 ? 'md:col-span-1' : 'md:col-span-2'
                }`}
              >
                <BannerCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}