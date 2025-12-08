const prisma = require('../config/database');

/**
 * Get user's wishlist
 * GET /api/wishlist
 */
const getWishlist = async (req, res) => {
  try {
    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId: req.userId },
      include: {
        product: {
          include: {
            category: {
              select: { name: true, slug: true }
            },
            collection: {
              select: { name: true, slug: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const items = wishlistItems.map(item => ({
      id: item.id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_description: item.product.description,
      product_image: item.product.image,
      product_price: parseFloat(item.product.price),
      rating: parseFloat(item.product.rating),
      reviews: item.product.reviews,
      is_new: item.product.isNew,
      is_bestseller: item.product.isBestseller,
      stock: item.product.stock,
      category: item.product.category?.name,
      collection: item.product.collection?.name,
      added_at: item.createdAt
    }));

    res.json({
      success: true,
      data: {
        items,
        count: items.length
      }
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist',
      error: error.message
    });
  }
};

/**
 * Add item to wishlist
 * POST /api/wishlist
 */
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    // Validation
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if already in wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: req.userId,
          productId
        }
      }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: req.userId,
        productId
      },
      include: {
        product: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Product added to wishlist',
      data: wishlistItem
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to wishlist',
      error: error.message
    });
  }
};

/**
 * Remove item from wishlist
 * DELETE /api/wishlist/:productId
 */
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find wishlist item
    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: req.userId,
          productId
        }
      }
    });

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Product not in wishlist'
      });
    }

    // Delete wishlist item
    await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId: req.userId,
          productId
        }
      }
    });

    res.json({
      success: true,
      message: 'Product removed from wishlist'
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from wishlist',
      error: error.message
    });
  }
};

/**
 * Check if product is in wishlist
 * GET /api/wishlist/check/:productId
 */
const checkWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: req.userId,
          productId
        }
      }
    });

    res.json({
      success: true,
      data: {
        in_wishlist: !!wishlistItem
      }
    });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking wishlist',
      error: error.message
    });
  }
};

/**
 * Clear wishlist
 * DELETE /api/wishlist
 */
const clearWishlist = async (req, res) => {
  try {
    await prisma.wishlist.deleteMany({
      where: { userId: req.userId }
    });

    res.json({
      success: true,
      message: 'Wishlist cleared'
    });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing wishlist',
      error: error.message
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
  clearWishlist
};