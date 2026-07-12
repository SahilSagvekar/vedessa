const prisma = require('../config/database');

// Maps freshly-uploaded multer/Cloudinary files to ProductImage rows.
// Type is derived from the file's mimetype, not the resulting URL.
const buildMediaFromFiles = (files = []) => {
  return files.map((file) => ({
    url: file.path || file.secure_url,
    type: file.mimetype && file.mimetype.startsWith('video/') ? 'VIDEO' : 'IMAGE'
  }));
};

// Builds the final ordered media list for a create/update, merging kept
// existing rows (looked up server-side, never trusting client-supplied URLs)
// with newly uploaded files.
//
// order: optional client manifest, e.g.
//   [{ kind: 'existing', id: '...' }, { kind: 'new', fileIndex: 0 }, ...]
// When omitted, falls back to existing-then-new-files in given order.
const mergeOrderedMedia = ({ existingMedia = [], files = [], order }) => {
  const newMedia = buildMediaFromFiles(files);
  const existingById = new Map(existingMedia.map((m) => [m.id, m]));

  let merged;
  if (Array.isArray(order) && order.length > 0) {
    merged = order
      .map((entry) => {
        if (entry.kind === 'existing') {
          const found = existingById.get(entry.id);
          return found ? { url: found.url, type: found.type } : null;
        }
        if (entry.kind === 'new') {
          return newMedia[entry.fileIndex] || null;
        }
        return null;
      })
      .filter(Boolean);
  } else {
    merged = [
      ...existingMedia.map((m) => ({ url: m.url, type: m.type })),
      ...newMedia
    ];
  }

  return merged.map((item, index) => ({
    url: item.url,
    type: item.type,
    isPrimary: index === 0,
    order: index
  }));
};

const getExistingMedia = async (productId) => {
  return prisma.productImage.findMany({ where: { productId } });
};

// The legacy `Product.image` column mirrors the primary thumbnail and is
// rendered with plain <img> tags across the app (cards, cart, wishlist...).
// It must never point at a video, even if a video is ordered first in the
// gallery, so pick the first image-typed item instead of imagesData[0].
const getLegacyPrimaryUrl = (imagesData = []) => {
  const firstImage = imagesData.find((m) => m.type !== 'VIDEO');
  return (firstImage || imagesData[0] || {}).url || null;
};

module.exports = { buildMediaFromFiles, mergeOrderedMedia, getExistingMedia, getLegacyPrimaryUrl };
