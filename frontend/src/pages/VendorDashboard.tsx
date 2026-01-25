import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/components/contexts/AuthContext';
import { Loader2, Package, ShoppingBag, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import vendorService from '@/services/vendorService';
import VendorProducts from '@/components/vendor/VendorProducts';
import VendorOrders from '@/components/vendor/VendorOrders';
import VendorProfile from '@/components/vendor/VendorProfile';

export default function VendorDashboard() {
    const navigate = useNavigate();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/auth');
            return;
        }

        if (!authLoading && user?.role !== 'VENDOR') {
            navigate('/dashboard');
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const [analyticsRes, profileRes] = await Promise.all([
                    vendorService.getAnalytics(),
                    vendorService.getProfile()
                ]);
                setAnalytics(analyticsRes.data);
                setProfile(profileRes.data);
            } catch (error) {
                console.error('Error fetching vendor data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated && user?.role === 'VENDOR') {
            fetchData();
        }
    }, [isAuthenticated, user, authLoading, navigate]);

    if (authLoading || loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-green-700" />
                </div>
            </Layout>
        );
    }

    if (!profile?.isApproved) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-8 h-8 text-amber-600" />
                        </div>
                        <h1 className="text-2xl font-serif text-gray-900 mb-4">
                            Account Pending Approval
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Thank you for registering as a vendor! Your account is currently under review.
                            We'll notify you via email once your account is approved.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-6 text-left">
                            <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• Our team will review your vendor application</li>
                                <li>• We'll verify your business details and documents</li>
                                <li>• You'll receive an email notification within 2-3 business days</li>
                                <li>• Once approved, you can start adding products</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    const stats = [
        {
            title: 'Total Products',
            value: analytics?.productCount || 0,
            icon: Package,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            title: 'Total Orders',
            value: analytics?.orderCount || 0,
            icon: ShoppingBag,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            title: 'Total Revenue',
            value: `₹${analytics?.totalRevenue || '0.00'}`,
            icon: TrendingUp,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        {
            title: 'Low Stock Items',
            value: analytics?.lowStockProducts || 0,
            icon: AlertCircle,
            color: 'text-amber-600',
            bgColor: 'bg-amber-100'
        }
    ];

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'products', label: 'Products' },
        { id: 'orders', label: 'Orders' },
        { id: 'profile', label: 'Profile' }
    ];

    return (
        <Layout>
            <div className="bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="bg-white border-b">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-serif text-gray-900">Vendor Dashboard</h1>
                                <p className="text-gray-500">Welcome back, {profile?.companyName || profile?.fullName}</p>
                            </div>
                            {activeTab === 'products' && (
                                <button
                                    onClick={() => {/* This will be handled by VendorProducts component */ }}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg font-medium transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Product
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white border-b">
                    <div className="container mx-auto px-4">
                        <div className="flex space-x-8">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                            ? 'border-green-700 text-green-700'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 py-8">
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {stats.map((stat, index) => (
                                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                            </div>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                        <p className="text-sm text-gray-500">{stat.title}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <button
                                        onClick={() => setActiveTab('products')}
                                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left"
                                    >
                                        <Plus className="w-6 h-6 text-green-600 mb-2" />
                                        <h3 className="font-medium text-gray-900">Add New Product</h3>
                                        <p className="text-sm text-gray-500">List a new product for sale</p>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab('orders')}
                                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left"
                                    >
                                        <ShoppingBag className="w-6 h-6 text-green-600 mb-2" />
                                        <h3 className="font-medium text-gray-900">View Orders</h3>
                                        <p className="text-sm text-gray-500">Manage customer orders</p>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left"
                                    >
                                        <AlertCircle className="w-6 h-6 text-green-600 mb-2" />
                                        <h3 className="font-medium text-gray-900">Update Profile</h3>
                                        <p className="text-sm text-gray-500">Edit business information</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'products' && <VendorProducts />}
                    {activeTab === 'orders' && <VendorOrders />}
                    {activeTab === 'profile' && <VendorProfile profile={profile} />}
                </div>
            </div>
        </Layout>
    );
}
