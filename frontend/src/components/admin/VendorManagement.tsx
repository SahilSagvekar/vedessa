import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Eye, Search, Users, Package, Clock } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const VendorManagement = () => {
    const [vendors, setVendors] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [filter, setFilter] = useState('all'); // all, pending, approved
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        fetchVendors();
        fetchStats();
    }, [filter, page, searchQuery]);

    const fetchVendors = async () => {
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
            });

            if (filter !== 'all') {
                params.append('status', filter);
            }

            if (searchQuery) {
                params.append('search', searchQuery);
            }

            const response = await fetch(`${API_URL}/admin/vendors?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                setVendors(data.data);
                setPagination(data.pagination);
            } else {
                toast.error(data.message || 'Failed to fetch vendors');
            }
        } catch (error) {
            console.error('Fetch vendors error:', error);
            toast.error('Failed to fetch vendors');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/vendors/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Fetch stats error:', error);
        }
    };

    const viewVendorDetails = async (vendorId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/vendors/${vendorId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                setSelectedVendor(data.data);
                setShowDetailsDialog(true);
            } else {
                toast.error(data.message || 'Failed to fetch vendor details');
            }
        } catch (error) {
            console.error('Fetch vendor details error:', error);
            toast.error('Failed to fetch vendor details');
        }
    };

    const approveVendor = async (vendorId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/vendors/${vendorId}/approve`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Vendor approved successfully!');
                fetchVendors();
                fetchStats();
                setShowDetailsDialog(false);
            } else {
                toast.error(data.message || 'Failed to approve vendor');
            }
        } catch (error) {
            console.error('Approve vendor error:', error);
            toast.error('Failed to approve vendor');
        }
    };

    const rejectVendor = async (vendorId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/vendors/${vendorId}/reject`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Vendor rejected successfully');
                fetchVendors();
                fetchStats();
                setShowDetailsDialog(false);
            } else {
                toast.error(data.message || 'Failed to reject vendor');
            }
        } catch (error) {
            console.error('Reject vendor error:', error);
            toast.error('Failed to reject vendor');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Statistics Cards */}
            {stats && (
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Approved</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.approved}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalProducts}</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <CardTitle>Vendor Management</CardTitle>
                    <CardDescription>Manage vendor applications and approvals</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search vendors..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={filter === 'all' ? 'default' : 'outline'}
                                onClick={() => setFilter('all')}
                            >
                                All
                            </Button>
                            <Button
                                variant={filter === 'pending' ? 'default' : 'outline'}
                                onClick={() => setFilter('pending')}
                            >
                                Pending
                            </Button>
                            <Button
                                variant={filter === 'approved' ? 'default' : 'outline'}
                                onClick={() => setFilter('approved')}
                            >
                                Approved
                            </Button>
                        </div>
                    </div>

                    {/* Vendors Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>GST Number</TableHead>
                                    <TableHead>Products</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Registered</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vendors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                                            No vendors found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    vendors.map((vendor) => (
                                        <TableRow key={vendor.id}>
                                            <TableCell className="font-medium">
                                                <div>
                                                    <div>{vendor.companyName || 'N/A'}</div>
                                                    <div className="text-sm text-muted-foreground">{vendor.fullName}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <div>{vendor.email}</div>
                                                    <div className="text-muted-foreground">{vendor.phone || 'N/A'}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{vendor.gstNumber || 'N/A'}</TableCell>
                                            <TableCell>{vendor._count?.products || 0}</TableCell>
                                            <TableCell>
                                                <Badge variant={vendor.isApproved ? 'success' : 'warning'}>
                                                    {vendor.isApproved ? 'Approved' : 'Pending'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{formatDate(vendor.createdAt)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => viewVendorDetails(vendor.id)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-muted-foreground">
                                Showing {((page - 1) * pagination.limit) + 1} to {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} vendors
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                                    disabled={page === pagination.pages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Vendor Details Dialog */}
            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Vendor Details</DialogTitle>
                        <DialogDescription>
                            Review vendor information and approve or reject the application
                        </DialogDescription>
                    </DialogHeader>

                    {selectedVendor && (
                        <div className="space-y-4">
                            {/* Status Badge */}
                            <div>
                                <Badge variant={selectedVendor.isApproved ? 'success' : 'warning'} className="text-sm">
                                    {selectedVendor.isApproved ? 'Approved' : 'Pending Approval'}
                                </Badge>
                            </div>

                            {/* Business Information */}
                            <div className="space-y-2">
                                <h3 className="font-semibold text-lg">Business Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Company Name:</span>
                                        <p className="font-medium">{selectedVendor.companyName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">GST Number:</span>
                                        <p className="font-medium">{selectedVendor.gstNumber || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-2">
                                <h3 className="font-semibold text-lg">Contact Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Full Name:</span>
                                        <p className="font-medium">{selectedVendor.fullName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Email:</span>
                                        <p className="font-medium">{selectedVendor.email}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Phone:</span>
                                        <p className="font-medium">{selectedVendor.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <h3 className="font-semibold text-lg">Address</h3>
                                <div className="text-sm">
                                    <p>{selectedVendor.address || 'N/A'}</p>
                                    <p>{selectedVendor.city}, {selectedVendor.state} - {selectedVendor.pincode}</p>
                                </div>
                            </div>

                            {/* Bank Details */}
                            {selectedVendor.bankDetails && (
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">Bank Details</h3>
                                    <div className="text-sm bg-muted p-3 rounded-md">
                                        <pre className="whitespace-pre-wrap">{selectedVendor.bankDetails}</pre>
                                    </div>
                                </div>
                            )}

                            {/* Products */}
                            <div className="space-y-2">
                                <h3 className="font-semibold text-lg">Products ({selectedVendor._count?.products || 0})</h3>
                                {selectedVendor.products && selectedVendor.products.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedVendor.products.map((product) => (
                                            <div key={product.id} className="flex justify-between items-center p-2 bg-muted rounded text-sm">
                                                <span>{product.name}</span>
                                                <span className="text-muted-foreground">₹{product.price} | Stock: {product.stock}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No products yet</p>
                                )}
                            </div>

                            {/* Registration Date */}
                            <div className="text-sm text-muted-foreground">
                                Registered on {formatDate(selectedVendor.createdAt)}
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        {selectedVendor && !selectedVendor.isApproved && (
                            <>
                                <Button
                                    variant="destructive"
                                    onClick={() => rejectVendor(selectedVendor.id)}
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                </Button>
                                <Button
                                    onClick={() => approveVendor(selectedVendor.id)}
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                </Button>
                            </>
                        )}
                        {selectedVendor && selectedVendor.isApproved && (
                            <Button
                                variant="destructive"
                                onClick={() => rejectVendor(selectedVendor.id)}
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                Revoke Approval
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default VendorManagement;
