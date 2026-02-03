import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, TrendingUp, Clock, Plus, Pencil, Trash2, Loader2, Users, Check, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/components/contexts/AuthContext';
import productsService from '@/services/productsService';
import ordersService from '@/services/ordersService';
import vendorService from '@/services/vendorService';
import VendorManagement from '@/components/admin/VendorManagement';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  collection: string;
  isNew: boolean;
  isBestseller: boolean;
  stock: number;
  rating: number;
  reviews: number;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  collection: string;
  isNew: boolean;
  isBestseller: boolean;
  stock: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [productList, setProductList] = useState<Product[]>([]);
  const [vendorList, setVendorList] = useState<any[]>([]);
  const [orderList, setOrderList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'vendors'>('products');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Stats
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'skincare',
    collection: 'bringaras',
    isNew: false,
    isBestseller: false,
    stock: '100',
  });

  const stats = [
    { label: 'Total Products', value: productList.length, icon: Package },
    { label: 'Total Orders', value: totalOrders, icon: ShoppingCart },
    { label: 'Revenue', value: `₹${totalRevenue.toFixed(0)}`, icon: TrendingUp },
    { label: 'Pending Orders', value: 0, icon: Clock },
  ];

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/dashboard');
      toast({
        title: 'Access Denied',
        description: 'You do not have admin privileges.',
        variant: 'destructive',
      });
    }
  }, [isAdmin, authLoading, navigate, toast]);

  // Fetch products
  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
      fetchStats();
      fetchVendors();
      fetchOrders();
    }
  }, [isAdmin]);

  const fetchVendors = async () => {
    try {
      const response = await vendorService.getAllVendors();
      setVendorList(response.data.vendors);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsService.getProducts({});
      setProductList(response.data.products);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const ordersResponse = await ordersService.getAllOrders({});
      setTotalOrders(ordersResponse.data.pagination.total);

      const revenue = ordersResponse.data.orders.reduce(
        (sum: number, order: any) => sum + (parseFloat(order.totalAmount) || 0),
        0
      );
      setTotalRevenue(revenue);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersResponse = await ordersService.getAllOrders({});
      setOrderList(ordersResponse.data.orders);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await ordersService.updateOrderStatus(orderId, newStatus);
      toast({
        title: 'Status Updated',
        description: `Order status changed to ${newStatus}`,
      });
      fetchOrders(); // Refresh list
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: 'skincare',
      collection: 'bringaras',
      isNew: false,
      isBestseller: false,
      stock: '100',
    });
    setIsEditMode(false);
    setEditProductId(null);
    setEditingProduct(null);
    setImageFile(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image || '', // Ensure image is always a string
      category: product.category,
      collection: product.collection,
      isNew: product.isNew,
      isBestseller: product.isBestseller,
      stock: product.stock.toString(),
    });
    setIsEditMode(true);
    setEditProductId(product.id);
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Product name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Valid price is required',
        variant: 'destructive',
      });
      return;
    }


    // if (!formData.image?.trim() && !imageFile) {
    //   toast({
    //     title: 'Validation Error',
    //     description: 'Image is required',
    //     variant: 'destructive',
    //   });
    //   return;
    // }

    setSubmitting(true);


    try {
      const productData = new FormData();

      // Append all fields except image
      Object.keys(formData).forEach(key => {
        if (key !== 'image') {
          productData.append(key, (formData as any)[key]);
        }
      });

      // Handle image separately - only append if we have a file or valid URL
      if (imageFile) {
        productData.append('image', imageFile);
      } else if (formData.image && formData.image.trim() !== '') {
        // Only send image URL if it's different from the original (for edit mode)
        // or if we're creating a new product
        if (!isEditMode || !editingProduct || formData.image !== (editingProduct.image || '')) {
          productData.append('image', formData.image);
        }
      }
      // If neither imageFile nor new image URL, don't append image field at all
      // This preserves the existing image when editing

      // Add default values for rating and reviews if creating
      if (!isEditMode) {
        productData.append('rating', '4.5');
        productData.append('reviews', '0');
      }

      if (isEditMode && editProductId) {
        // Update product
        await productsService.updateProduct(editProductId, productData);
        toast({
          title: 'Product Updated',
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        // Create product
        await productsService.createProduct(productData);
        toast({
          title: 'Product Added',
          description: `${formData.name} has been added successfully.`,
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchProducts(); // Refresh list
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Failed to ${isEditMode ? 'update' : 'add'} product`,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await productsService.deleteProduct(id);
      toast({
        title: 'Product Deleted',
        description: `${name} has been deleted successfully.`,
      });
      fetchProducts(); // Refresh list
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      skincare: 'Skincare',
      haircare: 'Haircare',
      bath_body: 'Bath & Body',
      gifting: 'Gifting',
    };
    return labels[category] || category;
  };

  const handleApproveVendor = async (id: string, approve: boolean) => {
    try {
      await vendorService.approveVendor(id, { approve });
      toast({
        title: approve ? 'Vendor Approved' : 'Vendor Rejected',
        description: `Vendor status has been updated successfully.`,
      });
      fetchVendors();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update vendor status',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || !isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-kama-olive text-kama-cream py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-display mb-2">Admin Dashboard</h1>
          <p className="text-kama-cream/80">Manage your store</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <stat.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-2xl font-semibold text-foreground">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${activeTab === 'products'
              ? 'text-foreground border-b-2 border-foreground'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${activeTab === 'orders'
              ? 'text-foreground border-b-2 border-foreground'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${activeTab === 'vendors'
              ? 'text-foreground border-b-2 border-foreground'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            Vendors
          </button>
        </div>

        {/* Products Management */}
        {activeTab === 'products' && (
          <div className="bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Products Management</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={openAddDialog}
                    className="bg-kama-olive hover:bg-kama-olive-light text-kama-cream"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {isEditMode ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter product name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter product description"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price (₹) *</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <Label htmlFor="stock">Stock *</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                          placeholder="100"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="image">Product Image</Label>
                      <div className="mt-2 space-y-3">
                        {formData.image && !imageFile && (
                          <div className="relative w-24 h-24 rounded-md overflow-hidden border">
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                        {imageFile && (
                          <div className="relative w-24 h-24 rounded-md overflow-hidden border">
                            <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <Input
                          id="imageFile"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                          className="cursor-pointer"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground uppercase">OR Paste URL</span>
                          <Input
                            id="image"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="skincare">Skincare</SelectItem>
                            <SelectItem value="haircare">Haircare</SelectItem>
                            <SelectItem value="bath_body">Bath & Body</SelectItem>
                            <SelectItem value="gifting">Gifting</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="collection">Collection *</Label>
                        <Select
                          value={formData.collection}
                          onValueChange={(value) => setFormData({ ...formData, collection: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select collection" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bringaras">Bringaras</SelectItem>
                            <SelectItem value="eladhi">Eladhi</SelectItem>
                            <SelectItem value="ashwaras">Ashwaras</SelectItem>
                            <SelectItem value="kumkumadi">Kumkumadi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isNew"
                          checked={formData.isNew}
                          onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                          className="rounded"
                        />
                        <Label htmlFor="isNew" className="cursor-pointer">Mark as New</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isBestseller"
                          checked={formData.isBestseller}
                          onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                          className="rounded"
                        />
                        <Label htmlFor="isBestseller" className="cursor-pointer">Mark as Bestseller</Label>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-1 bg-kama-olive hover:bg-kama-olive-light text-kama-cream"
                      >
                        {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isEditMode ? 'Update Product' : 'Add Product'}
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
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : productList.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No products yet. Add your first product!</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {productList.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ₹{product.price.toFixed(2)} • Stock: {product.stock}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {getCategoryLabel(product.category)}
                        </Badge>
                        {product.isNew && (
                          <Badge className="bg-kama-orange text-accent-foreground text-xs">
                            New
                          </Badge>
                        )}
                        {product.isBestseller && (
                          <Badge className="bg-green-600 text-white text-xs">
                            Bestseller
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditDialog(product)}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-card border border-border rounded-lg">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Order Management</h2>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : orderList.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No orders found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="p-4 font-medium text-sm">Order #</th>
                      <th className="p-4 font-medium text-sm">Customer</th>
                      <th className="p-4 font-medium text-sm">Date</th>
                      <th className="p-4 font-medium text-sm">Total</th>
                      <th className="p-4 font-medium text-sm">Status</th>
                      <th className="p-4 font-medium text-sm text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orderList.map((order) => (
                      <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium text-sm text-foreground">
                          {order.orderNumber || order.order_number}
                        </td>
                        <td className="p-4 text-sm">
                          <div className="text-foreground">{order.user?.fullName || order.shippingAddress?.fullName || 'N/A'}</div>
                          <div className="text-xs text-muted-foreground">{order.user?.email || order.shippingAddress?.email}</div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {new Date(order.createdAt || order.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-sm font-semibold text-foreground">
                          ₹{(parseFloat(order.totalAmount) || parseFloat(order.total) || 0).toFixed(2)}
                        </td>
                        <td className="p-4">
                          <Badge className={`
                            ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                              order.status === 'CANCELLED' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                                order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                                  'bg-amber-100 text-amber-700 hover:bg-amber-100'}
                            border-none
                          `}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <Select
                            onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                            defaultValue={order.status}
                          >
                            <SelectTrigger className="w-32 ml-auto h-8 text-xs">
                              <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PENDING">Pending</SelectItem>
                              <SelectItem value="PROCESSING">Processing</SelectItem>
                              <SelectItem value="SHIPPED">Shipped</SelectItem>
                              <SelectItem value="DELIVERED">Delivered</SelectItem>
                              <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Vendors Tab */}
        {activeTab === 'vendors' && (
          <VendorManagement />
        )}
      </div>
    </Layout>
  );
};


export default Admin;