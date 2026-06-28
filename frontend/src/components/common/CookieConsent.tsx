import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COOKIE_KEY = 'vedessa_cookie_consent';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      // Small delay so it doesn't flash on first paint
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
      <div className="max-w-2xl mx-auto md:mx-0 md:ml-4 bg-white border border-gray-200 rounded-2xl shadow-2xl p-5 pointer-events-auto">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-full bg-kama-olive/10 flex items-center justify-center">
            <Cookie className="w-4 h-4 text-kama-olive" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 mb-1">We use cookies</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              We use cookies to improve your experience, remember your cart, and analyse site traffic. By clicking "Accept", you consent to our use of cookies as described in our{' '}
              <Link to="/privacy" className="text-kama-olive underline hover:text-kama-olive/80">
                Privacy Policy
              </Link>.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Button
                onClick={accept}
                size="sm"
                className="bg-kama-olive hover:bg-kama-olive/90 text-kama-cream text-xs px-4 h-8"
              >
                Accept
              </Button>
              <Button
                onClick={decline}
                variant="outline"
                size="sm"
                className="text-xs px-4 h-8 border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Decline
              </Button>
            </div>
          </div>
          <button
            onClick={decline}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;