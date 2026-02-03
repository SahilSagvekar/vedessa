const prisma = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');

// Register new vendor
exports.registerVendor = async (req, res) => {
    try {
        const {
            email,
            password,
            fullName,
            companyName,
            gstNumber,
            phone,
            address,
            city,
            state,
            pincode,
            bankDetails
        } = req.body;

        // Validation
        if (!email || !password || !fullName || !companyName || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create vendor user
        const vendor = await prisma.user.create({
            data: {
                email,
                passwordHash,
                fullName,
                role: 'VENDOR',
                companyName,
                gstNumber,
                phone,
                address,
                city,
                state,
                pincode,
                bankDetails: bankDetails ? JSON.stringify(bankDetails) : null,
                isApproved: false // Requires admin approval
            }
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: vendor.id, role: vendor.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Remove password from response
        const { passwordHash: _, ...vendorData } = vendor;

        res.status(201).json({
            success: true,
            message: 'Vendor registration successful. Your account is pending approval.',
            data: {
                user: vendorData,
                token
            }
        });
    } catch (error) {
        console.error('Vendor registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to register vendor',
            error: error.message
        });
    }
};

// Get vendor profile
exports.getMyProfile = async (req, res) => {
    try {
        const vendor = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                fullName: true,
                companyName: true,
                gstNumber: true,
                phone: true,
                address: true,
                city: true,
                state: true,
                pincode: true,
                bankDetails: true,
                isApproved: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        res.json({
            success: true,
            data: vendor
        });
    } catch (error) {
        console.error('Get vendor profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vendor profile',
            error: error.message
        });
    }
};

// Update vendor profile
exports.updateMyProfile = async (req, res) => {
    try {
        const {
            fullName,
            companyName,
            gstNumber,
            phone,
            address,
            city,
            state,
            pincode,
            bankDetails
        } = req.body;

        const updateData = {};
        if (fullName) updateData.fullName = fullName;
        if (companyName) updateData.companyName = companyName;
        if (gstNumber) updateData.gstNumber = gstNumber;
        if (phone) updateData.phone = phone;
        if (address) updateData.address = address;
        if (city) updateData.city = city;
        if (state) updateData.state = state;
        if (pincode) updateData.pincode = pincode;
        if (bankDetails) updateData.bankDetails = JSON.stringify(bankDetails);

        const vendor = await prisma.user.update({
            where: { id: req.user.id },
            data: updateData,
            select: {
                id: true,
                email: true,
                fullName: true,
                companyName: true,
                gstNumber: true,
                phone: true,
                address: true,
                city: true,
                state: true,
                pincode: true,
                bankDetails: true,
                isApproved: true,
                role: true
            }
        });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: vendor
        });
    } catch (error) {
        console.error('Update vendor profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update vendor profile',
            error: error.message
        });
    }
};

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
                    collection: true
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.product.count({ where })
        ]);

        res.json({
            success: true,
            data: {
                products,
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
            isBestseller
        } = req.body;

        let image = req.body.image;
        if (req.file) {
            image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        if (!name || !price) {
            return res.status(400).json({
                success: false,
                message: 'Product name and price are required'
            });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                image,
                categoryId,
                collectionId,
                vendorId: req.user.id,
                stock: stock ? parseInt(stock) : 100,
                isNew: isNew === 'true' || isNew === true,
                isBestseller: isBestseller === 'true' || isBestseller === true
            },
            include: {
                category: true,
                collection: true,
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

        // Check if product belongs to vendor
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
            isBestseller
        } = req.body;

        let image = req.body.image;
        if (req.file) {
            image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (price) updateData.price = parseFloat(price);
        if (image !== undefined) updateData.image = image;
        if (categoryId !== undefined) updateData.categoryId = categoryId;
        if (collectionId !== undefined) updateData.collectionId = collectionId;
        if (stock !== undefined) updateData.stock = parseInt(stock);
        if (isNew !== undefined) updateData.isNew = isNew === 'true' || isNew === true;
        if (isBestseller !== undefined) updateData.isBestseller = isBestseller === 'true' || isBestseller === true;

        const product = await prisma.product.update({
            where: { id },
            data: updateData,
            include: {
                category: true,
                collection: true,
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

        // Check if product belongs to vendor
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

// Get vendor's orders (orders containing their products)
exports.getMyOrders = async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Find orders that contain products from this vendor
        const orders = await prisma.order.findMany({
            where: {
                items: {
                    some: {
                        product: {
                            vendorId: req.user.id
                        }
                    }
                },
                ...(status && { status })
            },
            include: {
                items: {
                    where: {
                        product: {
                            vendorId: req.user.id
                        }
                    },
                    include: {
                        product: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true
                    }
                }
            },
            skip,
            take: parseInt(limit),
            orderBy: { createdAt: 'desc' }
        });

        const total = await prisma.order.count({
            where: {
                items: {
                    some: {
                        product: {
                            vendorId: req.user.id
                        }
                    }
                },
                ...(status && { status })
            }
        });

        res.json({
            success: true,
            data: {
                orders,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get vendor orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
};

// Mark order as fulfilled (for vendor's items)
exports.fulfillOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { trackingNumber, notes } = req.body;

        // Verify order contains vendor's products
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    where: {
                        product: {
                            vendorId: req.user.id
                        }
                    }
                }
            }
        });

        if (!order || order.items.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found or does not contain your products'
            });
        }

        // In a real implementation, you might track fulfillment per item or vendor
        // For now, we'll just add a note about the fulfillment
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                status: 'SHIPPED',
                updatedAt: new Date()
            },
            include: {
                items: true,
                user: {
                    select: {
                        email: true,
                        fullName: true
                    }
                }
            }
        });

        res.json({
            success: true,
            message: 'Order marked as fulfilled',
            data: updatedOrder
        });
    } catch (error) {
        console.error('Fulfill order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fulfill order',
            error: error.message
        });
    }
};

// Get vendor analytics
exports.getAnalytics = async (req, res) => {
    try {
        const vendorId = req.user.id;

        // Get product count
        const productCount = await prisma.product.count({
            where: { vendorId }
        });

        // Get total orders
        const orderCount = await prisma.order.count({
            where: {
                items: {
                    some: {
                        product: { vendorId }
                    }
                }
            }
        });

        // Get revenue (sum of order items)
        const orderItems = await prisma.orderItem.findMany({
            where: {
                product: { vendorId }
            },
            select: {
                price: true,
                quantity: true
            }
        });

        const totalRevenue = orderItems.reduce((sum, item) => {
            return sum + (parseFloat(item.price) * item.quantity);
        }, 0);

        // Get low stock products
        const lowStockProducts = await prisma.product.count({
            where: {
                vendorId,
                stock: {
                    lt: 10
                }
            }
        });

        res.json({
            success: true,
            data: {
                productCount,
                orderCount,
                totalRevenue: totalRevenue.toFixed(2),
                lowStockProducts
            }
        });
    } catch (error) {
        console.error('Get vendor analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch analytics',
            error: error.message
        });
    }
};

// Admin: Get all vendors
exports.getAllVendors = async (req, res) => {
    try {
        const { page = 1, limit = 20, isApproved } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = {
            role: 'VENDOR'
        };

        if (isApproved !== undefined) {
            where.isApproved = isApproved === 'true';
        }

        const [vendors, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    companyName: true,
                    gstNumber: true,
                    phone: true,
                    isApproved: true,
                    createdAt: true
                },
                skip,
                take: parseInt(limit),
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.count({ where })
        ]);

        res.json({
            success: true,
            data: {
                vendors,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get all vendors error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vendors',
            error: error.message
        });
    }
};

// Admin: Approve or Reject Vendor
exports.approveVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const { approve, reason } = req.body;

        const vendor = await prisma.user.findUnique({
            where: { id, role: 'VENDOR' }
        });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found'
            });
        }

        const updatedVendor = await prisma.user.update({
            where: { id },
            data: {
                isApproved: approve
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                companyName: true,
                isApproved: true
            }
        });

        // Send email notification
        try {
            if (approve) {
                await emailService.sendVendorApprovalEmail(
                    updatedVendor.email,
                    updatedVendor.fullName,
                    updatedVendor.companyName
                );
            } else {
                await emailService.sendVendorRejectionEmail(
                    updatedVendor.email,
                    updatedVendor.fullName,
                    reason || 'Your application did not meet our current requirements.'
                );
            }
        } catch (emailError) {
            console.error('Failed to send vendor approval/rejection email:', emailError);
        }

        res.json({
            success: true,
            message: `Vendor ${approve ? 'approved' : 'rejected'} successfully`,
            data: updatedVendor
        });
    } catch (error) {
        console.error('Approve vendor error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update vendor status',
            error: error.message
        });
    }
};
