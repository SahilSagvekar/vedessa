import { useState, useEffect } from 'react';
import { Loader2, Plus, Edit2, Trash2, Search } from 'lucide-react';
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
        image: '',
        categoryId: '',
        collectionId: '',
        isNew: false,
        isBestseller: false
    });

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
            image: '',
            categoryId: '',
            collectionId: '',
            isNew: false,
            isBestseller: false
        });
        setShowAddModal(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            stock: product.stock.toString(),
            image: product.image || '',
            categoryId: product.categoryId || '',
            collectionId: product.collectionId || '',
            isNew: product.isNew || false,
            isBestseller: product.isBestseller || false
        });
        setShowAddModal(true);
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

        try {
            if (editingProduct) {
                await vendorService.updateProduct(editingProduct.id, formData);
                toast({
                    title: 'Success',
                    description: 'Product updated successfully',
                });
            } else {
                await vendorService.createProduct(formData);
                toast({
                    title: 'Success',
                    description: 'Product created successfully',
                });
            }
            setShowAddModal(false);
            fetchProducts();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to save product',
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

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
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
                                            required
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
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Image URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                        placeholder="https://example.com/image.jpg"
                                    />
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
