import { useState } from 'react';

// Decorative side panel — echoes the lotus + leaf motif from the Vedessa
// logo instead of showing a specific product, so this section reads as
// "the brand" rather than "buy this item".
function BrandMotifPanel({ flip = false }: { flip?: boolean }) {
  return (
    <div
      className={`hidden md:flex col-span-1 items-center justify-center bg-kama-olive/5 relative overflow-hidden ${
        flip ? 'scale-x-[-1]' : ''
      }`}
    >
      {/* Soft dot texture */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.07]" preserveAspectRatio="none">
        <pattern id={`dots-${flip ? 'r' : 'l'}`} width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" className="fill-kama-olive" />
        </pattern>
        <rect width="100%" height="100%" fill={`url(#dots-${flip ? 'r' : 'l'})`} />
      </svg>

      <svg width="200" height="200" viewBox="0 0 200 200" className="relative">
        {/* Medallion ring */}
        <circle cx="100" cy="98" r="72" fill="none" className="stroke-kama-gold" strokeWidth="1" opacity="0.45" />
        <circle cx="100" cy="98" r="65" fill="none" className="stroke-kama-gold" strokeWidth="1" opacity="0.25" />

        {/* Lotus — 7 petals fanned upward, one shape rotated around a shared point */}
        <g transform="translate(100, 106)">
          <path id={`petal-${flip ? 'r' : 'l'}`} d="M0,0 C-8,-14 -8,-32 0,-47 C8,-32 8,-14 0,0 Z" fill="none" className="stroke-kama-gold" strokeWidth="2" />
          <use href={`#petal-${flip ? 'r' : 'l'}`} transform="rotate(-64)" />
          <use href={`#petal-${flip ? 'r' : 'l'}`} transform="rotate(-42)" />
          <use href={`#petal-${flip ? 'r' : 'l'}`} transform="rotate(-21)" />
          <use href={`#petal-${flip ? 'r' : 'l'}`} transform="rotate(21)" />
          <use href={`#petal-${flip ? 'r' : 'l'}`} transform="rotate(42)" />
          <use href={`#petal-${flip ? 'r' : 'l'}`} transform="rotate(64)" />
          <circle cx="0" cy="-2" r="2.6" className="fill-kama-gold" />
        </g>

        {/* Mirrored leaf sprigs beneath the lotus */}
        <g transform="translate(100, 136)" fill="none" className="stroke-kama-olive" strokeWidth="1.8">
          <path id={`leaflet-${flip ? 'r' : 'l'}`} d="M0,0 C-4.5,-6.5 -4.5,-14.5 0,-19 C4.5,-14.5 4.5,-6.5 0,0 Z" />
          <use href={`#leaflet-${flip ? 'r' : 'l'}`} transform="translate(13,5) rotate(58)" />
          <use href={`#leaflet-${flip ? 'r' : 'l'}`} transform="translate(25,14) rotate(78)" />
          <use href={`#leaflet-${flip ? 'r' : 'l'}`} transform="translate(35,27) rotate(92)" />
          <use href={`#leaflet-${flip ? 'r' : 'l'}`} transform="translate(-13,5) rotate(-58)" />
          <use href={`#leaflet-${flip ? 'r' : 'l'}`} transform="translate(-25,14) rotate(-78)" />
          <use href={`#leaflet-${flip ? 'r' : 'l'}`} transform="translate(-35,27) rotate(-92)" />
        </g>
      </svg>
    </div>
  );
}

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Placeholder only — wire up to a real subscribe endpoint later.
    setSubmitted(true);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="relative rounded-2xl overflow-hidden bg-kama-cream border border-gray-200 grid grid-cols-3">
          <BrandMotifPanel />

          <div className="col-span-3 md:col-span-1 flex flex-col items-center justify-center text-center py-14 px-6">
            <span className="text-[11px] tracking-[0.2em] uppercase text-kama-gold font-medium mb-2">
              Vedessa
            </span>
            <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-2">Get Insider Access</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              Ayurvedic rituals, new launches, and members-only offers — straight to your inbox.
            </p>
            {submitted ? (
              <p className="text-sm text-kama-olive font-medium">Thanks — you're on the list!</p>
            ) : (
              <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Please enter your email for latest updates"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-kama-olive focus:border-transparent outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-kama-olive hover:bg-kama-olive-light text-kama-cream px-4 py-2.5 rounded-md text-sm font-medium transition-colors"
                >
                  Submit
                </button>
              </form>
            )}
          </div>

          <BrandMotifPanel flip />
        </div>
      </div>
    </section>
  );
}