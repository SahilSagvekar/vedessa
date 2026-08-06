import { useState } from 'react';

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
          <div className="hidden md:flex col-span-1 bg-gray-100 items-center justify-center">
            <span className="text-xs text-gray-400 px-4 text-center">Image coming soon</span>
          </div>

          <div className="col-span-3 md:col-span-1 flex flex-col items-center justify-center text-center py-12 px-6">
            <h2 className="text-2xl font-serif text-gray-900 mb-4">Get Insider Access</h2>
            {submitted ? (
              <p className="text-sm text-gray-600">Thanks — you're on the list!</p>
            ) : (
              <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Please enter your email for latest updates"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-kama-olive focus:border-transparent outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-kama-olive hover:bg-kama-olive-light text-kama-cream px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Submit
                </button>
              </form>
            )}
          </div>

          <div className="hidden md:flex col-span-1 bg-gray-100 items-center justify-center">
            <span className="text-xs text-gray-400 px-4 text-center">Image coming soon</span>
          </div>
        </div>
      </div>
    </section>
  );
}