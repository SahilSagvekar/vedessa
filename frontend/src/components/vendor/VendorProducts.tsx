import { useState, useEffect } from 'react';
import { Loader2, Plus, Edit2, Trash2, Search, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import vendorService from '@/services/vendorService';
import productsService from '@/services/productsService';

export default function VendorProducts() {
    const { toast } = useToast();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [collections, setCollections] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        images: [],
        categoryId: '',
        collectionId: '',
        isNew: false,
        isBestseller: false,
        lowStockThreshold: 5,
        variants: []
    });
    const [imageFiles, setImageFiles] = useState([]);

    useEffect(() => {
        fetchProducts();
        fetchCategoriesAndCollections();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await vendorService.getProducts({ search: searchQuery });
            setProducts(response.data.products || []);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch products',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchCategoriesAndCollections = async () => {
        try {
            const [categoriesRes, collectionsRes] = await Promise.all([
                productsService.getCategories(),
                productsService.getCollections()
            ]);
            setCategories(categoriesRes.data || []);
            setCollections(collectionsRes.data || []);
        } catch (error) {
            console.error('Error fetching categories/collections:', error);
        }
    };

    const handleSearch = () => {
        fetchProducts();
    };

    const handleAddProduct = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            stock: '',
            images: [],
            categoryId: '',
            collectionId: '',
            isNew: false,
            isBestseller: false,
            lowStockThreshold: 5,
            variants: []
        });
        setShowAddModal(true);
        setImageFiles([]);
    };

    const handleEditProduct = (product) => {
        console.log('=== EDIT PRODUCT CLICKED ===');
        console.log('Product object:', product);
        console.log('Product categoryId:', product.categoryId);
        console.log('Product category:', product.category);
        console.log('Product collectionId:', product.collectionId);
        console.log('Product collection:', product.collection);

        setEditingProduct(product);

        const formValues = {
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            stock: product.stock.toString(),
            images: product.images || [],
            // Handle both direct ID fields and nested objects
            categoryId: product.categoryId || product.category?.id || '',
            collectionId: product.collectionId || product.collection?.id || '',
            isNew: product.isNew || false,
            isBestseller: product.isBestseller || false,
            lowStockThreshold: product.lowStockThreshold || 5,
            variants: product.variants || []
        };

        console.log('Setting form data to:', formValues);
        setFormData(formValues);
        setShowAddModal(true);
        setImageFiles([]);
    };

    const handleDeleteProduct = async (productId) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await vendorService.deleteProduct(productId);
            toast({
                title: 'Success',
                description: 'Product deleted successfully',
            });
            fetchProducts();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete product',
                variant: 'destructive',
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('=== FORM SUBMIT ===');
        console.log('Editing product:', editingProduct);
        console.log('Form data:', formData);
        console.log('Image files:', imageFiles);

        try {
            const data = new FormData();

            // Append all fields except image/images
            Object.keys(formData).forEach(key => {
                if (key !== 'image' && key !== 'images' && key !== 'variants') {
                    console.log(`Appending ${key}:`, formData[key]);
                    data.append(key, formData[key]);
                }
            });

            // Handle variants as JSON string
            if (formData.variants && formData.variants.length > 0) {
                data.append('variants', JSON.stringify(formData.variants));
            }

            // Handle images separately
            if (imageFiles && imageFiles.length > 0) {
                imageFiles.forEach(file => {
                    data.append('images', file);
                });
            } else if (formData.images && formData.images.length > 0) {
                // Keep existing images (this is a simplified logic, ideally we'd allow reordering/deleting)
                formData.images.forEach(img => {
                    data.append('image', img.url); // Legacy support or URL support
                });
            }

            console.log('FormData entries:');
            for (let pair of data.entries()) {
                console.log(pair[0] + ':', pair[1]);
            }

            if (editingProduct) {
                console.log('Updating product ID:', editingProduct.id);
                await vendorService.updateProduct(editingProduct.id, data);
                toast({
                    title: 'Success',
                    description: 'Product updated successfully',
                });
            } else {
                await vendorService.createProduct(data);
                toast({
                    title: 'Success',
                    description: 'Product created successfully',
                });
            }
            setShowAddModal(false);
            fetchProducts();
        } catch (error) {
            console.error('Product save error:', error);
            console.error('Error response:', error.response?.data);

            const errorMessage = error.response?.data?.message
                || error.response?.data?.error
                || error.message
                || 'Failed to save product';

            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-green-700" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search and Add */}
            <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        />
                    </div>
                </div>
                <button
                    onClick={handleAddProduct}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                    <p className="text-gray-500 mb-6">Start by adding your first product</p>
                    <button
                        onClick={handleAddProduct}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg font-medium transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Product
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="aspect-square bg-gray-100">
                                <img
                                    src={product.image || '/placeholder.svg'}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                                    }}
                                />
                                {product.isLowStock && (
                                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-md">
                                        <Package className="w-3 h-3" />
                                        LOW STOCK
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                                <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-lg font-bold text-gray-900">₹{parseFloat(product.price).toFixed(2)}</span>
                                    <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditProduct(product)}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-2xl font-serif text-gray-900 mb-6">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Price (₹) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Stock *
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Low Stock Threshold
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.lowStockThreshold}
                                            onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) || 0 })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        />
                                        <p className="text-[10px] text-gray-500 mt-1">Alert when stock falls below this number</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Product Image
                                    </label>
                                    <div className="space-y-3">
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            {/* Existing/Stored Images */}
                                            {formData.images && formData.images.map((img, idx) => (
                                                <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                                                    <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                            {/* Newly Selected Files */}
                                            {imageFiles.map((file, idx) => (
                                                <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                                                    <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-2">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => setImageFiles(Array.from(e.target.files))}
                                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                            />
                                            <p className="text-xs text-gray-500">You can select up to 5 images. The first one will be the primary image.</p>
                                        </div>
                                    </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category
                                        </label>
                                        <select
                                            value={formData.categoryId}
                                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Collection
                                        </label>
                                        <select
                                            value={formData.collectionId}
                                            onChange={(e) => setFormData({ ...formData, collectionId: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        >
                                            <option value="">Select Collection</option>
                                            {collections.map((col) => (
                                                <option key={col.id} value={col.id}>{col.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

 
                                {/* Variants Section */}
                                <div className="space-y-4 border-t border-b border-gray-100 py-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({
                                                ...formData,
                                                variants: [...formData.variants, { name: 'Size', value: '', price: '', stock: '', sku: '' }]
                                            })}
                                            className="text-sm text-green-700 hover:text-green-800 font-medium flex items-center gap-1"
                                        >
                                            <Plus className="w-4 h-4" /> Add Variant
                                        </button>
                                    </div>
                                    
                                    {formData.variants.length === 0 ? (
                                        <p className="text-sm text-gray-500 italic">No variants added. This will be a simple product.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {formData.variants.map((variant, idx) => (
                                                <div key={idx} className="grid grid-cols-12 gap-2 items-end bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                    <div className="col-span-3">
                                                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Attr</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Size/Color"
                                                            value={variant.name}
                                                            onChange={(e) => {
                                                                const newVariants = [...formData.variants];
                                                                newVariants[idx].name = e.target.value;
                                                                setFormData({ ...formData, variants: newVariants });
                                                            }}
                                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 outline-none"
                                                        />
                                                    </div>
                                                    <div className="col-span-3">
                                                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Value</label>
                                                        <input
                                                            type="text"
                                                            placeholder="100ml/Red"
                                                            value={variant.value}
                                                            onChange={(e) => {
                                                                const newVariants = [...formData.variants];
                                                                newVariants[idx].value = e.target.value;
                                                                setFormData({ ...formData, variants: newVariants });
                                                            }}
                                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 outline-none"
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Price</label>
                                                        <input
                                                            type="number"
                                                            placeholder="Price"
                                                            value={variant.price}
                                                            onChange={(e) => {
                                                                const newVariants = [...formData.variants];
                                                                newVariants[idx].price = e.target.value;
                                                                setFormData({ ...formData, variants: newVariants });
                                                            }}
                                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 outline-none"
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Stock</label>
                                                        <input
                                                            type="number"
                                                            placeholder="Stock"
                                                            value={variant.stock}
                                                            onChange={(e) => {
                                                                const newVariants = [...formData.variants];
                                                                newVariants[idx].stock = e.target.value;
                                                                setFormData({ ...formData, variants: newVariants });
                                                            }}
                                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 outline-none"
                                                        />
                                                    </div>
                                                    <div className="col-span-1">
                                                        <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Thrsh</label>
                                                        <input
                                                            type="number"
                                                            placeholder="Alert"
                                                            value={variant.lowStockThreshold || 2}
                                                            onChange={(e) => {
                                                                const newVariants = [...formData.variants];
                                                                newVariants[idx].lowStockThreshold = e.target.value;
                                                                setFormData({ ...formData, variants: newVariants });
                                                            }}
                                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 outline-none"
                                                        />
                                                    </div>
                                                    <div className="col-span-1 flex justify-end">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newVariants = formData.variants.filter((_, i) => i !== idx);
                                                                setFormData({ ...formData, variants: newVariants });
                                                            }}
                                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
 
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.isNew}
                                            onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                                            className="rounded"
                                        />
                                        <span className="text-sm text-gray-700">Mark as New</span>
                                    </label>

                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.isBestseller}
                                            onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                                            className="rounded"
                                        />
                                        <span className="text-sm text-gray-700">Mark as Bestseller</span>
                                    </label>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg transition-colors"
                                    >
                                        {editingProduct ? 'Update Product' : 'Add Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
