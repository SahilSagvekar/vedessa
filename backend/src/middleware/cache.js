// Cache-Control for public, read-only GET responses (products/categories/collections).
// Lets the browser and any CDN in front of the API skip re-hitting Neon for repeat requests.
const cacheControl = (maxAgeSeconds, staleWhileRevalidateSeconds = maxAgeSeconds * 5) => {
  return (req, res, next) => {
    res.set('Cache-Control', `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${staleWhileRevalidateSeconds}`);
    next();
  };
};

module.exports = { cacheControl };
