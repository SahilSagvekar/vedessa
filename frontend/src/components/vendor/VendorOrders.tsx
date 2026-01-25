import { useState, useEffect } from 'react';
import { Loader2, Package, Eye, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import vendorService from '@/services/vendorService';

export default function VendorOrders() {
    const { toast } = useToast();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await vendorService.getOrders();
            setOrders(response.data.orders || []);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch orders',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFulfillOrder = async (orderId) => {
        if (!confirm('Mark this order as fulfilled?')) return;

        try {
            await vendorService.fulfillOrder(orderId, {
                notes: 'Order fulfilled by vendor'
            });
            toast({
                title: 'Success',
                description: 'Order marked as fulfilled',
            });
            fetchOrders();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fulfill order',
                variant: 'destructive',
            });
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            PENDING: 'bg-amber-100 text-amber-700',
            PROCESSING: 'bg-blue-100 text-blue-700',
            SHIPPED: 'bg-purple-100 text-purple-700',
            DELIVERED: 'bg-green-100 text-green-700',
            CANCELLED: 'bg-red-100 text-red-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
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
            {orders.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500">Orders containing your products will appear here</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{order.id.slice(0, 8).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.user?.fullName || order.user?.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.items?.length || 0} item(s)
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            ₹{parseFloat(order.totalAmount || 0).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="text-green-600 hover:text-green-800"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {order.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => handleFulfillOrder(order.id)}
                                                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
                                                    >
                                                        Fulfill
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-serif text-gray-900">
                                    Order #{selectedOrder.id.slice(0, 8).toUpperCase()}
                                </h2>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Customer Info */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-1 text-sm">
                                        <p><span className="font-medium">Name:</span> {selectedOrder.user?.fullName}</p>
                                        <p><span className="font-medium">Email:</span> {selectedOrder.user?.email}</p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Your Products in this Order</h3>
                                    <div className="space-y-3">
                                        {selectedOrder.items?.map((item) => (
                                            <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                                                <img
                                                    src={item.product?.image || '/placeholder.svg'}
                                                    alt={item.productName}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{item.productName}</h4>
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        ₹{parseFloat(item.price).toFixed(2)} × {item.quantity} = ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                {selectedOrder.shippingAddress && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                                        <div className="bg-gray-50 rounded-lg p-4 text-sm">
                                            <p>{selectedOrder.shippingAddress.name}</p>
                                            <p>{selectedOrder.shippingAddress.address}</p>
                                            <p>
                                                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                                            </p>
                                            <p className="mt-2">Phone: {selectedOrder.shippingAddress.phone}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Close
                                    </button>
                                    {selectedOrder.status === 'PENDING' && (
                                        <button
                                            onClick={() => {
                                                handleFulfillOrder(selectedOrder.id);
                                                setSelectedOrder(null);
                                            }}
                                            className="flex-1 px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg transition-colors"
                                        >
                                            Mark as Fulfilled
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
