const prisma = require('../config/database');

/**
 * Get all categories with product count
 * GET /api/categories
 */
const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    const formattedCategories = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      created_at: cat.createdAt,
      product_count: cat._count.products
    }));

    res.json({
      success: true,
      data: formattedCategories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

/**
 * Get all collections with product count
 * GET /api/collections
 */
const getAllCollections = async (req, res) => {
  try {
    const collections = await prisma.collection.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    const formattedCollections = collections.map(col => ({
      id: col.id,
      name: col.name,
      slug: col.slug,
      image: col.image,
      created_at: col.createdAt,
      product_count: col._count.products
    }));

    res.json({
      success: true,
      data: formattedCollections
    });
  } catch (error) {
    console.error('Get collections error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching collections',
      error: error.message
    });
  }
};

/**
 * Get category by slug
 * GET /api/categories/:slug
 */
const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        created_at: category.createdAt,
        product_count: category._count.products
      }
    });
  } catch (error) {
    console.error('Get category by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
};

/**
 * Get collection by slug
 * GET /api/collections/:slug
 */
const getCollectionBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const collection = await prisma.collection.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: collection.id,
        name: collection.name,
        slug: collection.slug,
        image: collection.image,
        created_at: collection.createdAt,
        product_count: collection._count.products
      }
    });
  } catch (error) {
    console.error('Get collection by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching collection',
      error: error.message
    });
  }
};

module.exports = {
  getAllCategories,
  getAllCollections,
  getCategoryBySlug,
  getCollectionBySlug
};