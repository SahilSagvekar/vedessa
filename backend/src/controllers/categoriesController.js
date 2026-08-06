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
      group: cat.group,
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
        group: category.group,
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

/**
 * Create a new category (Admin)
 * POST /api/categories
 */
const createCategory = async (req, res) => {
  try {
    const { name, slug, group } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    const finalSlug = (slug && slug.trim())
      ? slug.trim().toLowerCase()
      : name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (group && !['SKINCARE', 'HAIRCARE'].includes(group)) {
      return res.status(400).json({
        success: false,
        message: "group must be 'SKINCARE' or 'HAIRCARE'"
      });
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        group: group || null,
      }
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'A category with that slug already exists'
      });
    }
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
};

/**
 * Update a category (Admin)
 * PUT /api/categories/:id
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, group } = req.body;

    if (group !== undefined && group !== null && !['SKINCARE', 'HAIRCARE'].includes(group)) {
      return res.status(400).json({
        success: false,
        message: "group must be 'SKINCARE', 'HAIRCARE', or null"
      });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (slug !== undefined) updateData.slug = slug.trim().toLowerCase();
    if (group !== undefined) updateData.group = group || null;

    const category = await prisma.category.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'A category with that slug already exists'
      });
    }
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
};

/**
 * Delete a category (Admin)
 * DELETE /api/categories/:id
 * Products in this category are NOT deleted — their categoryId is set to
 * null (see the onDelete: SetNull relation on Product.category).
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    await prisma.category.delete({ where: { id } });

    res.json({
      success: true,
      message: category._count.products > 0
        ? `Category deleted. ${category._count.products} product(s) are now uncategorized.`
        : 'Category deleted successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
};

module.exports = {
  getAllCategories,
  getAllCollections,
  getCategoryBySlug,
  getCollectionBySlug,
  createCategory,
  updateCategory,
  deleteCategory
};