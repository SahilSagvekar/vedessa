const prisma = require('../config/database');

/**
 * Get all concerns with product count
 * GET /api/concerns
 */
const getAllConcerns = async (req, res) => {
  try {
    const concerns = await prisma.concern.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    const formattedConcerns = concerns.map(concern => ({
      id: concern.id,
      name: concern.name,
      slug: concern.slug,
      created_at: concern.createdAt,
      product_count: concern._count.products
    }));

    res.json({
      success: true,
      data: formattedConcerns
    });
  } catch (error) {
    console.error('Get concerns error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching concerns',
      error: error.message
    });
  }
};

/**
 * Get concern by slug
 * GET /api/concerns/:slug
 */
const getConcernBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const concern = await prisma.concern.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!concern) {
      return res.status(404).json({
        success: false,
        message: 'Concern not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: concern.id,
        name: concern.name,
        slug: concern.slug,
        created_at: concern.createdAt,
        product_count: concern._count.products
      }
    });
  } catch (error) {
    console.error('Get concern by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching concern',
      error: error.message
    });
  }
};

/**
 * Create a new concern (Admin)
 * POST /api/concerns
 */
const createConcern = async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Concern name is required'
      });
    }

    const finalSlug = (slug && slug.trim())
      ? slug.trim().toLowerCase()
      : name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const concern = await prisma.concern.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
      }
    });

    res.status(201).json({
      success: true,
      message: 'Concern created successfully',
      data: concern
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'A concern with that slug already exists'
      });
    }
    console.error('Create concern error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating concern',
      error: error.message
    });
  }
};

/**
 * Update a concern (Admin)
 * PUT /api/concerns/:id
 */
const updateConcern = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (slug !== undefined) updateData.slug = slug.trim().toLowerCase();

    const concern = await prisma.concern.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Concern updated successfully',
      data: concern
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Concern not found'
      });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'A concern with that slug already exists'
      });
    }
    console.error('Update concern error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating concern',
      error: error.message
    });
  }
};

/**
 * Delete a concern (Admin)
 * DELETE /api/concerns/:id
 * Products tagged with this concern are NOT deleted — the relation row is
 * simply removed (same behavior as deleting a Category).
 */
const deleteConcern = async (req, res) => {
  try {
    const { id } = req.params;

    const concern = await prisma.concern.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } }
    });

    if (!concern) {
      return res.status(404).json({
        success: false,
        message: 'Concern not found'
      });
    }

    await prisma.concern.delete({ where: { id } });

    res.json({
      success: true,
      message: concern._count.products > 0
        ? `Concern deleted. ${concern._count.products} product(s) are no longer tagged with it.`
        : 'Concern deleted successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Concern not found'
      });
    }
    console.error('Delete concern error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting concern',
      error: error.message
    });
  }
};

module.exports = {
  getAllConcerns,
  getConcernBySlug,
  createConcern,
  updateConcern,
  deleteConcern
};
