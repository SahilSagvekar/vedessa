import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ChevronLeft, Package, Truck, CheckCircle, Clock, XCircle, Loader2, MapPin, ExternalLink } from 'lucide-react';
import { useAuth } from '@/components/contexts/AuthContext';
import ordersService from '@/services/ordersService';

interface OrderItem {
    id: string;
    product_id: string;
    product_name: string;
    product_image: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    order_number: string;
    status: string;
    total_amount: number;
    subtotal: number;
    tax: number;
    shipping_cost: number;
    discount_amount?: number;
    shipping_address: {
        name: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
    };
    payment_status: string;
    payment_method: string;
    awb_number?: string;
    tracking_url?: string;
    estimated_delivery?: string;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
}

const statusSteps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
const statusIcons = {
    PENDING: Clock,
    PROCESSING: Package,
    SHIPPED: Truck,
    DELIVERED: CheckCircle,
    CANCELLED: XCircle
};

export default function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/auth');
            return;
        }

        const fetchOrder = async () => {
            try {
                setLoading(true);
                const response = await ordersService.getOrder(id);
                setOrder(response.data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch order details');
            } finally {
                setLoading(false);
            }
        };

        if (id && isAuthenticated) {
            fetchOrder();
        }
    }, [id, isAuthenticated, authLoading, navigate]);

    const getStatusIndex = (status: string) => {
        return statusSteps.indexOf(status);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (authLoading || loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-green-700" />
                </div>
            </Layout>
        );
    }

    if (error || !order) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-serif text-gray-900 mb-4">Order Not Found</h1>
                    <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist.'}</p>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                </div>
            </Layout>
        );
    }

    const StatusIcon = statusIcons[order.status as keyof typeof statusIcons] || Clock;
    const currentStatusIndex = getStatusIndex(order.status);

    return (
        <Layout>
            <div className="bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="bg-white border-b">
                    <div className="container mx-auto px-4 py-6">
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Link>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-serif text-gray-900">
                                    Order #{order.order_number || order.id.slice(0, 8).toUpperCase()}
                                </h1>
                                <p className="text-gray-500 text-sm">
                                    Placed on {formatDate(order.created_at)}
                                </p>
                            </div>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                                        'bg-amber-100 text-amber-700'
                                }`}>
                                <StatusIcon className="w-4 h-4" />
                                {order.status}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Status Timeline */}
                            {order.status !== 'CANCELLED' && (
                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <h2 className="font-semibold text-gray-900 mb-6">Order Status</h2>
                                    <div className="flex items-center justify-between">
                                        {statusSteps.map((step, index) => {
                                            const Icon = statusIcons[step as keyof typeof statusIcons];
                                            const isCompleted = index <= currentStatusIndex;
                                            const isCurrent = index === currentStatusIndex;

                                            return (
                                                <div key={step} className="flex flex-col items-center flex-1">
                                                    <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 ${isCompleted ? 'bg-green-600 border-green-600' :
                                                        'bg-white border-gray-300'
                                                        }`}>
                                                        <Icon className={`w-5 h-5 ${isCompleted ? 'text-white' : 'text-gray-400'}`} />
                                                        {isCurrent && (
                                                            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                                                        )}
                                                    </div>
                                                    <span className={`mt-2 text-xs font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        {step}
                                                    </span>
                                                    {index < statusSteps.length - 1 && (
                                                        <div className={`absolute h-0.5 w-full ${index < currentStatusIndex ? 'bg-green-600' : 'bg-gray-200'
                                                            }`} style={{ left: '50%', top: '20px', width: 'calc(100% - 40px)', zIndex: -1 }} />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Order Items */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="font-semibold text-gray-900 mb-6">Order Items</h2>
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                                            <img
                                                src={item.product_image || '/placeholder.svg'}
                                                alt={item.product_name}
                                                className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                                                }}
                                            />
                                            <div className="flex-1">
                                                <Link
                                                    to={`/products/${item.product_id}`}
                                                    className="font-medium text-gray-900 hover:text-green-700"
                                                >
                                                    {item.product_name}
                                                </Link>
                                                <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                                                <p className="font-semibold text-gray-900 mt-1">
                                                    ₹{(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Order Summary */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="text-gray-900">₹{order.subtotal?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="text-gray-900">₹{order.tax?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="text-gray-900">
                                            {order.shipping_cost === 0 ? 'Free' : `₹${order.shipping_cost?.toFixed(2)}`}
                                        </span>
                                    </div>
                                    {order.discount_amount && order.discount_amount > 0 && (
                                        <div className="flex justify-between text-green-600 font-medium">
                                            <span>Discount</span>
                                            <span>-₹{order.discount_amount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between pt-3 border-t font-semibold text-base">
                                        <span>Total</span>
                                        <span>₹{order.total_amount?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="font-semibold text-gray-900 mb-4">Payment</h2>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Method</span>
                                        <span className="text-gray-900">{order.payment_method || 'Razorpay'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status</span>
                                        <span className={`font-medium ${order.payment_status === 'PAID' ? 'text-green-600' : 'text-amber-600'
                                            }`}>
                                            {order.payment_status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            {order.shipping_address && (
                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Shipping Address
                                    </h2>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p className="font-medium text-gray-900">{order.shipping_address.name}</p>
                                        <p>{order.shipping_address.address}</p>
                                        <p>
                                            {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                                        </p>
                                        <p className="pt-2">Phone: {order.shipping_address.phone}</p>
                                    </div>
                                </div>
                            )}

                            {/* Tracking Info */}
                            {order.awb_number && (
                                <div className="bg-kama-olive/5 border border-kama-olive/20 rounded-xl p-6 shadow-sm">
                                    <h2 className="font-semibold text-kama-olive mb-4 flex items-center gap-2">
                                        <Truck className="w-4 h-4" />
                                        Ekart Tracking
                                    </h2>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">AWB Number</span>
                                            <span className="font-mono font-bold text-gray-900">{order.awb_number}</span>
                                        </div>
                                        {order.estimated_delivery && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Est. Delivery</span>
                                                <span className="font-medium text-gray-900">
                                                    {new Date(order.estimated_delivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                        )}
                                        <Link
                                            to={`/track-order?awb=${order.awb_number}`}
                                            className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-kama-olive text-kama-cream rounded-lg text-sm font-medium hover:bg-kama-olive-light transition-colors"
                                        >
                                            Track Shipment
                                            <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="space-y-3">
                                <Link
                                    to="/contact"
                                    className="block w-full text-center py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Need Help?
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
