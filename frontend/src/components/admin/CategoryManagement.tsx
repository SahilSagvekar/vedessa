import { useState, useEffect } from 'react';
import { FolderTree, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
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
import categoriesService from '@/services/categoriesService';

// Keep in sync with the CategoryGroup enum in backend/prisma/schema.prisma.
// Adding a new group here requires a matching DB migration AND a new
// mega-menu block in Header.tsx — this list intentionally isn't dynamic.
const GROUP_OPTIONS = [
    { value: 'SKINCARE', label: 'Skin Care' },
    { value: 'HAIRCARE', label: 'Hair Care' },
];

const groupLabel = (group: string | null) =>
    GROUP_OPTIONS.find((g) => g.value === group)?.label || 'Unassigned';

const slugify = (value: string) =>
    value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

interface CategoryFormData {
    name: string;
    slug: string;
    group: string; // '' means unassigned / not shown in any nav mega-menu
}

const emptyForm: CategoryFormData = { name: '', slug: '', group: '' };

const CategoryManagement = () => {
    const { toast } = useToast();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<CategoryFormData>(emptyForm);
    // Whether the user has hand-edited the slug — once they do, stop
    // auto-deriving it from the name.
    const [slugTouched, setSlugTouched] = useState(false);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await categoriesService.getCategories();
            setCategories(response.data || []);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load categories',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenDialog = (category?: any) => {
        if (category) {
            setEditingId(category.id);
            setFormData({
                name: category.name,
                slug: category.slug,
                group: category.group || '',
            });
            setSlugTouched(true); // don't auto-overwrite an existing slug
        } else {
            setEditingId(null);
            setFormData(emptyForm);
            setSlugTouched(false);
        }
        setIsDialogOpen(true);
    };

    const handleNameChange = (name: string) => {
        setFormData((prev) => ({
            ...prev,
            name,
            slug: slugTouched ? prev.slug : slugify(name),
        }));
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            toast({
                title: 'Validation Error',
                description: 'Category name is required',
                variant: 'destructive',
            });
            return;
        }

        const payload = {
            name: formData.name.trim(),
            slug: formData.slug.trim() || slugify(formData.name),
            group: formData.group || null,
        };

        try {
            setSubmitting(true);
            if (editingId) {
                await categoriesService.updateCategory(editingId, payload);
                toast({ title: 'Success', description: 'Category updated successfully' });
            } else {
                await categoriesService.createCategory(payload);
                toast({ title: 'Success', description: 'Category created successfully' });
            }
            setIsDialogOpen(false);
            fetchCategories();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.message || error?.response?.data?.message || `Failed to ${editingId ? 'update' : 'create'} category`,
                variant: 'destructive',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string, productCount: number) => {
        const warning = productCount > 0
            ? `"${name}" has ${productCount} product(s) in it. Deleting it will leave those products uncategorized (they will NOT be deleted). Continue?`
            : `Are you sure you want to delete "${name}"?`;
        if (!confirm(warning)) return;

        try {
            await categoriesService.deleteCategory(id);
            toast({ title: 'Deleted', description: 'Category deleted successfully' });
            fetchCategories();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error?.message || error?.response?.data?.message || 'Failed to delete category',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between p-4 border-b border-border">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">Category Management</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Subcategories (e.g. Shampoo, Oils) assigned to a nav group show up automatically in the Skin Care / Hair Care menus.
                    </p>
                </div>
                <Button
                    onClick={() => handleOpenDialog()}
                    className="bg-kama-olive hover:bg-kama-olive-light text-kama-cream"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Category
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="catName">Name *</Label>
                            <Input
                                id="catName"
                                placeholder="e.g. Shampoo"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="catSlug">Slug</Label>
                            <Input
                                id="catSlug"
                                placeholder="e.g. shampoo"
                                value={formData.slug}
                                onChange={(e) => {
                                    setSlugTouched(true);
                                    setFormData({ ...formData, slug: e.target.value });
                                }}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Used in product filter URLs — auto-filled from the name, edit if you need something different.
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="catGroup">Nav Group</Label>
                            <Select
                                value={formData.group || 'NONE'}
                                onValueChange={(value) => setFormData({ ...formData, group: value === 'NONE' ? '' : value })}
                            >
                                <SelectTrigger id="catGroup">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NONE">Unassigned (won't appear in a nav mega-menu)</SelectItem>
                                    {GROUP_OPTIONS.map((g) => (
                                        <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex-1 bg-kama-olive hover:bg-kama-olive-light text-kama-cream"
                            >
                                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {editingId ? 'Update Category' : 'Create Category'}
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
            ) : categories.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <FolderTree className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No categories found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-muted/50">
                                <th className="p-4 font-medium text-sm">Name</th>
                                <th className="p-4 font-medium text-sm">Slug</th>
                                <th className="p-4 font-medium text-sm">Nav Group</th>
                                <th className="p-4 font-medium text-sm">Products</th>
                                <th className="p-4 font-medium text-sm text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="p-4 font-medium text-foreground">{cat.name}</td>
                                    <td className="p-4 text-sm text-muted-foreground">{cat.slug}</td>
                                    <td className="p-4">
                                        <Badge variant={cat.group ? 'success' : 'outline'} className="text-[10px]">
                                            {groupLabel(cat.group)}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-sm text-foreground">{cat.product_count}</td>
                                    <td className="p-4 text-right flex justify-end gap-1">
                                        <button
                                            onClick={() => handleOpenDialog(cat)}
                                            className="p-2 text-muted-foreground hover:text-kama-olive transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id, cat.name, cat.product_count)}
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

export default CategoryManagement;