const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productsController');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
// GET /api/products - Get all products with filters
router.get('/', getAllProducts);

// routes/products.js
router.get('/products/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        collection: true,
        category: true,
        images: {
          orderBy: { order: 'asc' }
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
      data: product
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', getProductById);

// Admin routes (require authentication + admin role)
// POST /api/products - Create product (admin only)
router.post('/', auth, isAdmin, createProduct);

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', auth, isAdmin, updateProduct);

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', auth, isAdmin, deleteProduct);

module.exports = router;