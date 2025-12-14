// routes/products.js or routes/productRoutes.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/products - with query filters
router.get('/products', async (req, res) => {
  try {
    const { isBestseller, limit, collection, category } = req.query;

    // Build where clause dynamically
    const where = {};
    
    if (isBestseller === 'true') {
      where.isBestseller = true;
    }
    
    if (collection) {
      where.collectionId = collection;
    }
    
    if (category) {
      where.categoryId = category;
    }

    // Only fetch active/published products
    where.isActive = true;

    const products = await prisma.product.findMany({
      where,
      take: limit ? parseInt(limit) : undefined,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        collection: true,
        category: true,
        images: {
          orderBy: { order: 'asc' }
        }
      }
    });

    res.json({
      success: true,
      data: products,
      count: products.length
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

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
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

export default router;