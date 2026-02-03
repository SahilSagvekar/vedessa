import { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Loader2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import couponService from '@/services/couponService';

const CouponManagement = () => {
    const { toast } = useToast();
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        minOrderAmount: '0',
        maxDiscountAmount: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        usageLimit: '',
        isActive: true,
    });

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const response = await couponService.getAllCoupons();
            setCoupons(response.data);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load coupons',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleSubmit = async () => {
        if (!formData.code || !formData.discountValue) {
            toast({
                title: 'Validation Error',
                description: 'Code and Discount Value are required',
                variant: 'destructive',
            });
            return;
        }

        try {
            setSubmitting(true);
            await couponService.createCoupon(formData);
            toast({
                title: 'Success',
                description: 'Coupon created successfully',
            });
            setIsDialogOpen(false);
            setFormData({
                code: '',
                description: '',
                discountType: 'PERCENTAGE',
                discountValue: '',
                minOrderAmount: '0',
                maxDiscountAmount: '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
                usageLimit: '',
                isActive: true,
            });
            fetchCoupons();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to create coupon',
                variant: 'destructive',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, code: string) => {
        if (!confirm(`Are you sure you want to delete coupon "${code}"?`)) return;

        try {
            await couponService.deleteCoupon(id);
            toast({
                title: 'Deleted',
                description: 'Coupon deleted successfully',
            });
            fetchCoupons();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete coupon',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Coupon Management</h2>
                <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-kama-olive hover:bg-kama-olive-light text-kama-cream"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Coupon
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Coupon</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="code">Coupon Code *</Label>
                            <Input
                                id="code"
                                placeholder="WELCOME10"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                className="uppercase"
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                placeholder="10% off for new users"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="discountType">Discount Type</Label>
                                <Select
                                    value={formData.discountType}
                                    onValueChange={(value) => setFormData({ ...formData, discountType: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                                        <SelectItem value="FIXED_AMOUNT">Fixed Amount (₹)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="discountValue">Value *</Label>
                                <Input
                                    id="discountValue"
                                    type="number"
                                    placeholder="10"
                                    value={formData.discountValue}
                                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="minOrderAmount">Min Order Amount</Label>
                                <Input
                                    id="minOrderAmount"
                                    type="number"
                                    value={formData.minOrderAmount}
                                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="maxDiscountAmount">Max Discount (for %)</Label>
                                <Input
                                    id="maxDiscountAmount"
                                    type="number"
                                    placeholder="No limit"
                                    value={formData.maxDiscountAmount}
                                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="endDate">End Date</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="usageLimit">Usage Limit (Total)</Label>
                            <Input
                                id="usageLimit"
                                type="number"
                                placeholder="No limit"
                                value={formData.usageLimit}
                                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="rounded cursor-pointer"
                            />
                            <Label htmlFor="isActive" className="cursor-pointer">Coupon is Active</Label>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex-1 bg-kama-olive hover:bg-kama-olive-light text-kama-cream"
                            >
                                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Create Coupon
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : coupons.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <Tag className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No coupons found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-muted/50">
                                <th className="p-4 font-medium text-sm">Code</th>
                                <th className="p-4 font-medium text-sm">Discount</th>
                                <th className="p-4 font-medium text-sm">Usage</th>
                                <th className="p-4 font-medium text-sm">Status</th>
                                <th className="p-4 font-medium text-sm text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {coupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-foreground">{coupon.code}</div>
                                        <div className="text-xs text-muted-foreground truncate max-w-[150px]">{coupon.description}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm font-medium text-foreground">
                                            {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground">
                                            Min: ₹{coupon.minOrderAmount}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm text-foreground">
                                            {coupon.usedCount} / {coupon.usageLimit || '∞'}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant={coupon.isActive ? 'success' : 'destructive'} className="text-[10px]">
                                            {coupon.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleDelete(coupon.id, coupon.code)}
                                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CouponManagement;
