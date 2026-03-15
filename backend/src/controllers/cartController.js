const prisma = require('../config/database');
const ekartService = require('../services/ekartService');

/**
 * Get user's cart
 * GET /api/cart
 */
const getCart = async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
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
        },
        variant: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate totals
    let subtotal = 0;
    const items = cartItems.map(item => {
      const itemTotal = parseFloat(item.product.price) * item.quantity;
      subtotal += itemTotal;

      return {
        id: item.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.image,
        product_price: item.variant?.price ? parseFloat(item.variant.price) : parseFloat(item.product.price),
        quantity: item.quantity,
        item_total: (item.variant?.price ? parseFloat(item.variant.price) : parseFloat(item.product.price)) * item.quantity,
        stock: item.variant ? item.variant.stock : item.product.stock,
        category: item.product.category?.name,
        collection: item.product.collection?.name,
        variant: item.variant ? {
          id: item.variant.id,
          name: item.variant.name,
          value: item.variant.value
        } : null
      };
    });

    const tax = subtotal * 0.18; // 18% tax
    const cartSummaryTotal = subtotal + tax;

    const totalWeight = parseFloat(items.reduce((sum, item) => {
      const weight = item.variant?.weight ? parseFloat(item.variant.weight) : (item.product?.weight ? parseFloat(item.product.weight) : 0.5);
      return sum + (weight * item.quantity);
    }, 0).toFixed(2));

    let shippingEstimate = null;
    let deliveryEstimate = null;

    const { pincode } = req.query;
    if (pincode && pincode.length === 6) {
      try {
        const rateInfo = await ekartService.calculateShippingRate({
          destinationPincode: pincode,
          weight: totalWeight
        });

        if (rateInfo.success) {
          shippingEstimate = rateInfo.rate;
          if (rateInfo.estimatedDays) {
            const date = new Date();
            date.setDate(date.getDate() + rateInfo.estimatedDays);
            deliveryEstimate = date;
          }
        }
      } catch (e) {
        console.error('Shipping estimate error:', e);
      }
    }

    res.json({
      success: true,
      data: {
        items,
        summary: {
          item_count: items.length,
          total_quantity: items.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: parseFloat(subtotal.toFixed(2)),
          tax: parseFloat(tax.toFixed(2)),
          total: parseFloat((cartSummaryTotal + (shippingEstimate || 0)).toFixed(2)),
          total_weight: totalWeight,
          shipping_estimate: shippingEstimate,
          delivery_estimate: deliveryEstimate
        }
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

/**
 * Add item to cart
 * POST /api/cart
 */
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, variantId = null } = req.body;

    // Validation
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
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

    // Check stock
    const stockToCheck = variantId 
      ? (await prisma.productVariant.findUnique({ where: { id: variantId } }))?.stock || 0
      : product.stock;

    if (stockToCheck < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${stockToCheck} items available in stock`
      });
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId: req.userId,
        productId: productId,
        variantId: variantId
      }
    });

    let cartItem;

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;

      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`
        });
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          product: true
        }
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: req.userId,
          productId,
          variantId,
          quantity
        },
        include: {
          product: true
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      data: cartItem
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to cart',
      error: error.message
    });
  }
};

/**
 * Update cart item quantity
 * PUT /api/cart/:id
 */
const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    // Validation
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        userId: req.userId
      },
      include: { product: true }
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Check stock
    if (cartItem.product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${cartItem.product.stock} items available in stock`
      });
    }

    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: true }
    });

    res.json({
      success: true,
      message: 'Cart item updated',
      data: updatedItem
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart item',
      error: error.message
    });
  }
};

/**
 * Remove item from cart
 * DELETE /api/cart/:id
 */
const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        userId: req.userId
      }
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from cart',
      error: error.message
    });
  }
};

/**
 * Clear cart
 * DELETE /api/cart
 */
const clearCart = async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: req.userId }
    });

    res.json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};