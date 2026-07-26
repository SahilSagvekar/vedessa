const prisma = require('../config/database');
const { mergeOrderedMedia, getExistingMedia, getLegacyPrimaryUrl } = require('../services/productMediaService');

// Get vendor's products
exports.getMyProducts = async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = {
            vendorId: req.user.id
        };

        if (search) {
            where.name = {
                contains: search,
                mode: 'insensitive'
            };
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: parseInt(limit),
                include: {
                    category: true,
                    collection: true,
                    images: {
                        orderBy: { order: 'asc' }
                    },
                    variants: true
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.product.count({ where })
        ]);

        // Add low stock flag to products and variants
        const productsWithAlerts = products.map(product => {
            const isLowStock = product.stock <= product.lowStockThreshold;
            const variantsWithAlerts = product.variants.map(variant => ({
                ...variant,
                isLowStock: variant.stock <= variant.lowStockThreshold
            }));

            return {
                ...product,
                isLowStock: isLowStock || variantsWithAlerts.some(v => v.isLowStock),
                variants: variantsWithAlerts
            };
        });

        res.json({
            success: true,
            data: {
                products: productsWithAlerts,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get vendor products error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: error.message
        });
    }
};

// Create product
exports.createProduct = async (req, res) => {
    try {
        // Check if vendor is approved
        const vendor = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { isApproved: true }
        });

        if (!vendor.isApproved) {
            return res.status(403).json({
                success: false,
                message: 'Your vendor account is pending approval. You cannot add products yet.'
            });
        }

        const {
            name,
            description,
            price,
            categoryId,
            collectionId,
            stock,
            isNew,
            isBestseller,
            lowStockThreshold,
            variants = []
        } = req.body;

        // Handle media (images + videos)
        let order;
        try {
            order = req.body.order ? JSON.parse(req.body.order) : undefined;
        } catch {
            order = undefined;
        }

        let imagesData = mergeOrderedMedia({ files: req.files || [], order });

        if (imagesData.length === 0 && req.body.image && typeof req.body.image === 'string' && req.body.image.trim() !== '') {
            imagesData = [{ url: req.body.image, type: 'IMAGE', isPrimary: true, order: 0 }];
        }

        const primaryImage = getLegacyPrimaryUrl(imagesData);

        if (!name || !price) {
            return res.status(400).json({
                success: false,
                message: 'Product name and price are required'
            });
        }

        const productData = {
            name,
            description,
            price: parseFloat(price),
            image: primaryImage,
            categoryId: (categoryId && typeof categoryId === 'string') ? categoryId : null,
            collectionId: (collectionId && typeof collectionId === 'string') ? collectionId : null,
            vendorId: req.user.id,
            stock: stock ? parseInt(stock) : 100,
            isNew: isNew === 'true' || isNew === true,
            isBestseller: isBestseller === 'true' || isBestseller === true,
            lowStockThreshold: lowStockThreshold ? parseInt(lowStockThreshold) : 5,
            images: {
                create: imagesData
            },
            variants: {
                create: Array.isArray(variants) ? variants.map(v => ({
                  name: v.name,
                  value: v.value,
                  price: v.price ? parseFloat(v.price) : null,
                  stock: v.stock ? parseInt(v.stock) : 0,
                  lowStockThreshold: v.lowStockThreshold ? parseInt(v.lowStockThreshold) : 2,
                  sku: v.sku || null
                })) : []
            }
        };

        const product = await prisma.product.create({
            data: productData,
            include: {
                category: true,
                collection: true,
                images: {
                    orderBy: { order: 'asc' }
                },
                variants: true,
                vendor: {
                    select: {
                        id: true,
                        companyName: true,
                        email: true
                    }
                }
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
            message: 'Failed to create product',
            error: error.message
        });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const existingProduct = await prisma.product.findUnique({
            where: { id },
            select: { vendorId: true }
        });

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (existingProduct.vendorId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this product'
            });
        }

        const {
            name,
            description,
            price,
            categoryId,
            collectionId,
            stock,
            isNew,
            isBestseller,
            lowStockThreshold,
            variants
        } = req.body;

        const updateData = {};

        if (name) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (price) updateData.price = parseFloat(price);
        if (categoryId) updateData.categoryId = categoryId;
        if (collectionId) updateData.collectionId = collectionId;
        if (stock) updateData.stock = parseInt(stock);
        if (isNew !== undefined) updateData.isNew = isNew === 'true' || isNew === true;
        if (isBestseller !== undefined) updateData.isBestseller = isBestseller === 'true' || isBestseller === true;
        if (lowStockThreshold !== undefined) updateData.lowStockThreshold = parseInt(lowStockThreshold);

        // Handle media (images + videos)
        let order;
        try {
            order = req.body.order ? JSON.parse(req.body.order) : undefined;
        } catch {
            order = undefined;
        }

        if ((req.files && req.files.length > 0) || order !== undefined) {
            const existingMedia = await getExistingMedia(id);
            const imagesData = mergeOrderedMedia({ existingMedia, files: req.files || [], order });

            updateData.image = getLegacyPrimaryUrl(imagesData);
            updateData.images = {
                deleteMany: {},
                create: imagesData
            };
        } else if (typeof req.body.image === 'string' && req.body.image.trim() !== '') {
            updateData.image = req.body.image;
            updateData.images = {
                deleteMany: {},
                create: [{ url: req.body.image, type: 'IMAGE', isPrimary: true, order: 0 }]
            };
        } else if (req.body.image === null || req.body.image === 'null') {
            updateData.image = null;
            updateData.images = {
                deleteMany: {}
            };
        }

        // Handle variants update
        if (variants !== undefined) {
          const parsedVariants = Array.isArray(variants) ? variants : JSON.parse(variants || '[]');
          updateData.variants = {
            deleteMany: {},
            create: parsedVariants.map(v => ({
              name: v.name,
              value: v.value,
              price: v.price ? parseFloat(v.price) : null,
              stock: v.stock ? parseInt(v.stock) : 0,
              lowStockThreshold: v.lowStockThreshold ? parseInt(v.lowStockThreshold) : 2,
              sku: v.sku || null
            }))
          };
        }

        const product = await prisma.product.update({
            where: { id },
            data: updateData,
            include: {
                category: true,
                collection: true,
                images: {
                    orderBy: { order: 'asc' }
                },
                variants: true,
                vendor: {
                    select: {
                        id: true,
                        companyName: true
                    }
                }
            }
        });

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update product',
            error: error.message
        });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id },
            select: { vendorId: true }
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.vendorId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this product'
            });
        }

        await prisma.product.delete({
            where: { id }
        });

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error.message
        });
    }
};
