const prisma = require('../config/database');

/**
 * Get all products with filters, sorting, and pagination
 * GET /api/products?category=skincare&collection=eladhi&isNew=true&sort=price_asc&limit=20&offset=0
 */
const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      collection,
      isNew,
      isBestseller,
      minPrice,
      maxPrice,
      sort = 'created_at_desc',
      limit = 50,
      offset = 0
    } = req.query;

    // Build where clause
    const where = {};

    if (category) {
      where.category = { slug: category };
    }

    if (collection) {
      where.collection = { slug: collection };
    }

    if (isNew === 'true') {
      where.isNew = true;
    }

    if (isBestseller === 'true') {
      where.isBestseller = true;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Build orderBy clause
    const sortMap = {
      'price_asc': { price: 'asc' },
      'price_desc': { price: 'desc' },
      'name_asc': { name: 'asc' },
      'name_desc': { name: 'desc' },
      'rating_desc': { rating: 'desc' },
      'created_at_desc': { createdAt: 'desc' },
      'created_at_asc': { createdAt: 'asc' }
    };
    const orderBy = sortMap[sort] || { createdAt: 'desc' };

    // Execute queries
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        take: parseInt(limit),
        skip: parseInt(offset),
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          collection: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      }),
      prisma.product.count({ where })
    ]);

    // Format response
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      image: product.image,
      rating: parseFloat(product.rating),
      reviews: product.reviews,
      is_new: product.isNew,
      is_bestseller: product.isBestseller,
      stock: product.stock,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
      category_id: product.category?.id || null,
      category_name: product.category?.name || null,
      category_slug: product.category?.slug || null,
      collection_id: product.collection?.id || null,
      collection_name: product.collection?.name || null,
      collection_slug: product.collection?.slug || null
    }));

    res.json({
      success: true,
      data: {
        products: formattedProducts,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: (parseInt(offset) + formattedProducts.length) < total
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

/**
 * Get single product by ID
 * GET /api/products/:id
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        collection: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        image: product.image,
        rating: parseFloat(product.rating),
        reviews: product.reviews,
        is_new: product.isNew,
        is_bestseller: product.isBestseller,
        stock: product.stock,
        created_at: product.createdAt,
        updated_at: product.updatedAt,
        category_id: product.category?.id || null,
        category_name: product.category?.name || null,
        category_slug: product.category?.slug || null,
        collection_id: product.collection?.id || null,
        collection_name: product.collection?.name || null,
        collection_slug: product.collection?.slug || null
      }
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

/**
 * Create new product (Admin only)
 * POST /api/products
 */
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      categoryId,
      collectionId,
      rating = 4.5,
      reviews = 0,
      isNew = false,
      isBestseller = false,
      stock = 100
    } = req.body;

    let image = req.body.image;
    if (req.file) {
      image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // Validation
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required'
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        categoryId: categoryId || null,
        collectionId: collectionId || null,
        rating: parseFloat(rating),
        reviews: parseInt(reviews),
        isNew: isNew === 'true' || isNew === true,
        isBestseller: isBestseller === 'true' || isBestseller === true,
        stock: parseInt(stock)
      },
      include: {
        category: true,
        collection: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

/**
 * Update product (Admin only)
 * PUT /api/products/:id
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};

    // Build update object with only provided fields
    const allowedFields = [
      'name', 'description', 'price', 'categoryId',
      'collectionId', 'rating', 'reviews', 'isNew', 'isBestseller', 'stock'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'price' || field === 'rating') {
          updateData[field] = parseFloat(req.body[field]);
        } else if (field === 'reviews' || field === 'stock') {
          updateData[field] = parseInt(req.body[field]);
        } else if (field === 'isNew' || field === 'isBestseller') {
          updateData[field] = req.body[field] === 'true' || req.body[field] === true;
        } else {
          updateData[field] = req.body[field];
        }
      }
    });

    if (req.file) {
      updateData.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    } else if (req.body.image !== undefined) {
      updateData.image = req.body.image;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        collection: true
      }
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

/**
 * Delete product (Admin only)
 * DELETE /api/products/:id
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};