const prisma = require('../config/database');
const logger = require('../config/logger');

/**
 * Create a review for a product
 */
exports.createReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, title, comment } = req.body;
        const userId = req.user.id;

        // Validation
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5',
            });
        }

        if (!comment || comment.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Review comment must be at least 10 characters',
            });
        }

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Check if user already reviewed this product
        const existingReview = await prisma.review.findFirst({
            where: {
                productId,
                userId,
            },
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product',
            });
        }

        // Check if user purchased this product (verified purchase)
        const hasPurchased = await prisma.orderItem.findFirst({
            where: {
                productId,
                order: {
                    userId,
                    status: 'DELIVERED',
                },
            },
        });

        // Create review
        const review = await prisma.review.create({
            data: {
                productId,
                userId,
                rating: parseInt(rating),
                title: title?.trim() || null,
                comment: comment.trim(),
                isVerified: !!hasPurchased,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                    },
                },
            },
        });

        // Update product rating and review count
        await updateProductRating(productId);

        logger.info('Review created', {
            reviewId: review.id,
            productId,
            userId,
            rating,
        });

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: review,
        });
    } catch (error) {
        logger.logError(error, { context: 'createReview', productId, userId });
        res.status(500).json({
            success: false,
            message: 'Failed to create review',
            error: error.message,
        });
    }
};

/**
 * Get reviews for a product
 */
exports.getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10, rating, sort = 'recent' } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build where clause
        const where = {
            productId,
            isApproved: true,
        };

        if (rating) {
            where.rating = parseInt(rating);
        }

        // Build orderBy clause
        let orderBy = {};
        switch (sort) {
            case 'recent':
                orderBy = { createdAt: 'desc' };
                break;
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'highest':
                orderBy = { rating: 'desc' };
                break;
            case 'lowest':
                orderBy = { rating: 'asc' };
                break;
            case 'helpful':
                orderBy = { helpfulCount: 'desc' };
                break;
            default:
                orderBy = { createdAt: 'desc' };
        }

        // Get reviews and total count
        const [reviews, total, stats] = await Promise.all([
            prisma.review.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            avatarUrl: true,
                        },
                    },
                },
                skip,
                take: parseInt(limit),
                orderBy,
            }),
            prisma.review.count({ where }),
            // Get rating distribution
            prisma.review.groupBy({
                by: ['rating'],
                where: { productId, isApproved: true },
                _count: true,
            }),
        ]);

        // Format rating distribution
        const ratingDistribution = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
        };

        stats.forEach((stat) => {
            ratingDistribution[stat.rating] = stat._count;
        });

        res.json({
            success: true,
            data: reviews,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
            stats: {
                totalReviews: total,
                ratingDistribution,
            },
        });
    } catch (error) {
        logger.logError(error, { context: 'getProductReviews' });
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews',
            error: error.message,
        });
    }
};

/**
 * Update a review
 */
exports.updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, title, comment } = req.body;
        const userId = req.user.id;

        // Find review
        const review = await prisma.review.findUnique({
            where: { id },
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        // Check ownership
        if (review.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You can only edit your own reviews',
            });
        }

        // Validation
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5',
            });
        }

        if (comment && comment.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Review comment must be at least 10 characters',
            });
        }

        // Update review
        const updatedReview = await prisma.review.update({
            where: { id },
            data: {
                ...(rating && { rating: parseInt(rating) }),
                ...(title !== undefined && { title: title?.trim() || null }),
                ...(comment && { comment: comment.trim() }),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                    },
                },
            },
        });

        // Update product rating if rating changed
        if (rating && rating !== review.rating) {
            await updateProductRating(review.productId);
        }

        logger.info('Review updated', {
            reviewId: id,
            userId,
        });

        res.json({
            success: true,
            message: 'Review updated successfully',
            data: updatedReview,
        });
    } catch (error) {
        logger.logError(error, { context: 'updateReview' });
        res.status(500).json({
            success: false,
            message: 'Failed to update review',
            error: error.message,
        });
    }
};

/**
 * Delete a review
 */
exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Find review
        const review = await prisma.review.findUnique({
            where: { id },
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        // Check ownership or admin
        if (review.userId !== userId && req.user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own reviews',
            });
        }

        // Delete review
        await prisma.review.delete({
            where: { id },
        });

        // Update product rating
        await updateProductRating(review.productId);

        logger.info('Review deleted', {
            reviewId: id,
            userId,
        });

        res.json({
            success: true,
            message: 'Review deleted successfully',
        });
    } catch (error) {
        logger.logError(error, { context: 'deleteReview' });
        res.status(500).json({
            success: false,
            message: 'Failed to delete review',
            error: error.message,
        });
    }
};

/**
 * Mark review as helpful
 */
exports.markHelpful = async (req, res) => {
    try {
        const { id } = req.params;
        const { helpful } = req.body; // true or false

        const review = await prisma.review.update({
            where: { id },
            data: {
                ...(helpful
                    ? { helpfulCount: { increment: 1 } }
                    : { notHelpfulCount: { increment: 1 } }),
            },
        });

        res.json({
            success: true,
            data: {
                helpfulCount: review.helpfulCount,
                notHelpfulCount: review.notHelpfulCount,
            },
        });
    } catch (error) {
        logger.logError(error, { context: 'markHelpful' });
        res.status(500).json({
            success: false,
            message: 'Failed to update helpful count',
            error: error.message,
        });
    }
};

/**
 * Get user's reviews
 */
exports.getUserReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: { userId },
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
                skip,
                take: parseInt(limit),
                orderBy: { createdAt: 'desc' },
            }),
            prisma.review.count({ where: { userId } }),
        ]);

        res.json({
            success: true,
            data: reviews,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        logger.logError(error, { context: 'getUserReviews' });
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user reviews',
            error: error.message,
        });
    }
};

/**
 * Helper function to update product rating
 */
async function updateProductRating(productId) {
    try {
        // Calculate average rating
        const [avgResult, reviewCount] = await Promise.all([
            prisma.review.aggregate({
                where: {
                    productId,
                    isApproved: true,
                },
                _avg: {
                    rating: true,
                },
            }),
            prisma.review.count({
                where: {
                    productId,
                    isApproved: true,
                },
            }),
        ]);

        const avgRating = avgResult._avg.rating || 0;

        // Update product
        await prisma.product.update({
            where: { id: productId },
            data: {
                rating: avgRating,
                reviews: reviewCount,
            },
        });

        logger.debug('Product rating updated', {
            productId,
            avgRating,
            reviewCount,
        });
    } catch (error) {
        logger.logError(error, { context: 'updateProductRating', productId });
    }
}
