import { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/contexts/AuthContext';
import reviewService from '@/services/reviewService';

interface Review {
    id: string;
    rating: number;
    title?: string;
    comment: string;
    isVerified: boolean;
    helpfulCount: number;
    notHelpfulCount: number;
    createdAt: string;
    user: {
        id: string;
        fullName: string;
        avatarUrl?: string;
    };
}

interface ReviewStats {
    totalReviews: number;
    ratingDistribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
}

interface ProductReviewsProps {
    productId: string;
    productName: string;
}

const ProductReviews = ({ productId, productName }: ProductReviewsProps) => {
    const { user } = useAuth();
    const { toast } = useToast();

    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<ReviewStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('recent');
    const [filterRating, setFilterRating] = useState<number | null>(null);

    // Review form state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        rating: 5,
        title: '',
        comment: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (productId) {
            fetchReviews();
        }
    }, [productId, page, sortBy, filterRating]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await reviewService.getProductReviews(productId, {
                page,
                limit: 10,
                sort: sortBy as any,
                ...(filterRating && { rating: filterRating }),
            });

            if (response.success) {
                setReviews(response.data);
                setStats(response.stats);
                setTotalPages(response.pagination.pages);
            }
        } catch (error: any) {
            console.error('Error fetching reviews:', error);
            // Don't show toast for 404/Empty - just handle gracefully
            if (error.response?.status !== 404) {
                toast({
                    title: 'Error',
                    description: 'Failed to load reviews',
                    variant: 'destructive',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async () => {
        if (!user) {
            toast({
                title: 'Login Required',
                description: 'Please login to write a review',
                variant: 'destructive',
            });
            return;
        }

        if (formData.comment.trim().length < 10) {
            toast({
                title: 'Invalid Review',
                description: 'Review must be at least 10 characters',
                variant: 'destructive',
            });
            return;
        }

        try {
            setSubmitting(true);
            const response = await reviewService.createReview(productId, formData);

            if (response.success) {
                toast({
                    title: 'Review Submitted',
                    description: 'Thank you for your review!',
                });

                setIsDialogOpen(false);
                setFormData({ rating: 5, title: '', comment: '' });
                fetchReviews();
            }
        } catch (error: any) {
            console.error('Submit review error:', error);
            toast({
                title: 'Error',
                description: typeof error === 'string' ? error : (error.response?.data?.message || 'Failed to submit review'),
                variant: 'destructive',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleMarkHelpful = async (reviewId: string, helpful: boolean) => {
        if (!user) {
            toast({
                title: 'Login Required',
                description: 'Please login to vote',
                variant: 'destructive',
            });
            return;
        }

        try {
            const response = await reviewService.markHelpful(reviewId, helpful);
            if (response.success) {
                fetchReviews();
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update vote',
                variant: 'destructive',
            });
        }
    };

    const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
        const sizeClass = size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${sizeClass} ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
        );
    };

    const renderRatingDistribution = () => {
        if (!stats) return null;

        const total = stats.totalReviews;
        if (total === 0) return null;

        return (
            <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                    const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] || 0;
                    const percentage = total > 0 ? (count / total) * 100 : 0;

                    return (
                        <button
                            key={rating}
                            onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                            className={`w-full flex items-center gap-2 text-sm hover:bg-muted/50 p-2 rounded transition-colors ${filterRating === rating ? 'bg-muted' : ''
                                }`}
                        >
                            <span className="w-8 text-right font-medium">{rating}</span>
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-400 transition-all"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <span className="w-12 text-right text-muted-foreground">{count}</span>
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-serif text-gray-900">Customer Reviews</h2>
                    {stats && (
                        <p className="text-sm text-gray-500 mt-1">
                            {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
                        </p>
                    )}
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-kama-olive hover:bg-kama-olive-light text-kama-cream">
                            Write a Review
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-serif">Write a Review</DialogTitle>
                            <p className="text-sm text-gray-500">For {productName}</p>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            <div>
                                <Label className="text-base font-medium">Rating *</Label>
                                <div className="flex gap-2 mt-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, rating: star })}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${star <= formData.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="title" className="text-base font-medium">Title (Optional)</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Sum up your review in one line"
                                    className="mt-2 border-gray-300"
                                    maxLength={100}
                                />
                            </div>

                            <div>
                                <Label htmlFor="comment" className="text-base font-medium">Review *</Label>
                                <Textarea
                                    id="comment"
                                    value={formData.comment}
                                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                    placeholder="Share your experience with this product..."
                                    rows={5}
                                    className="mt-2 border-gray-300"
                                    minLength={10}
                                />
                                <p className="text-xs text-gray-400 mt-2">
                                    Minimum 10 characters ({formData.comment.length}/10)
                                </p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    onClick={handleSubmitReview}
                                    disabled={submitting || formData.comment.length < 10}
                                    className="flex-1 bg-kama-olive hover:bg-kama-olive-light text-kama-cream py-6 h-auto text-lg"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                            Submitting...
                                        </>
                                    ) : 'Submit Review'}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="py-6 h-auto text-lg px-8 border-gray-300"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Rating Distribution */}
            {stats && stats.totalReviews > 0 && (
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 mb-4">Rating Distribution</h3>
                    {renderRatingDistribution()}
                    {filterRating && (
                        <Button
                            variant="link"
                            size="sm"
                            onClick={() => setFilterRating(null)}
                            className="mt-4 text-kama-olive p-0"
                        >
                            Clear Filter
                        </Button>
                    )}
                </div>
            )}

            {/* Sort Options */}
            {stats && stats.totalReviews > 0 && (
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Sort by:</span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-48 border-gray-300">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem value="recent">Most Recent</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="highest">Highest Rating</SelectItem>
                            <SelectItem value="lowest">Lowest Rating</SelectItem>
                            <SelectItem value="helpful">Most Helpful</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-10 h-10 border-4 border-kama-olive/20 border-t-kama-olive rounded-full animate-spin" />
                        <p className="text-gray-500 font-medium">Loading reviews...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 border border-dashed border-gray-200 rounded-lg">
                        <p className="text-gray-600 font-medium">
                            {filterRating
                                ? `No ${filterRating}-star reviews yet`
                                : 'No reviews yet for this product.'}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            Be the first to share your experience!
                        </p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-6 space-y-4 hover:border-gray-300 transition-colors bg-white">
                            {/* Review Header */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-kama-olive/10 text-kama-olive flex items-center justify-center font-bold text-lg">
                                        {review.user.fullName?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                            <span className="font-semibold text-gray-900">{review.user.fullName || 'Anonymous'}</span>
                                            {review.isVerified && (
                                                <Badge variant="success" className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-2 py-0 text-[10px] uppercase font-bold tracking-wider rounded-sm flex items-center">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Verified Purchase
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                                {renderStars(review.rating, 'sm')}
                            </div>

                            {/* Review Title */}
                            <div className="space-y-2">
                                {review.title && (
                                    <h4 className="font-bold text-gray-900">{review.title}</h4>
                                )}
                                {/* Review Comment */}
                                <p className="text-gray-700 leading-relaxed text-sm lg:text-base">{review.comment}</p>
                            </div>

                            {/* Helpful Votes */}
                            <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Helpful?</span>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleMarkHelpful(review.id, true)}
                                        className="gap-1.5 h-8 px-3 border-gray-200 hover:bg-gray-50 text-gray-600"
                                    >
                                        <ThumbsUp className="w-3.5 h-3.5" />
                                        <span className="text-xs">{review.helpfulCount}</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleMarkHelpful(review.id, false)}
                                        className="gap-1.5 h-8 px-3 border-gray-200 hover:bg-gray-50 text-gray-600"
                                    >
                                        <ThumbsDown className="w-3.5 h-3.5" />
                                        <span className="text-xs">{review.notHelpfulCount}</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-6">
                    <Button
                        variant="outline"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="border-gray-300"
                    >
                        Previous
                    </Button>
                    <span className="text-sm font-medium text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="border-gray-300"
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ProductReviews;
