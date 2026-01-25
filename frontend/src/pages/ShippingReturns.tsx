import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Truck, Package, Clock, RefreshCw, Shield, MapPin } from 'lucide-react';

export default function ShippingReturns() {
    return (
        <Layout>
            {/* Hero */}
            <section className="bg-gradient-to-br from-green-50 to-amber-50 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
                        Shipping & Returns
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Everything you need to know about how we deliver your orders
                        and our hassle-free return policy.
                    </p>
                </div>
            </section>

            {/* Shipping Info */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-serif text-gray-900 mb-8 flex items-center gap-3">
                            <Truck className="w-8 h-8 text-green-700" />
                            Shipping Information
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <Package className="w-6 h-6 text-green-600" />
                                    <h3 className="font-semibold text-gray-900">Standard Delivery</h3>
                                </div>
                                <ul className="space-y-2 text-gray-600">
                                    <li>• Delivery within 5-7 business days</li>
                                    <li>• Free shipping on orders above ₹1000</li>
                                    <li>• ₹99 flat rate for orders below ₹1000</li>
                                    <li>• Available across all pin codes in India</li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <Clock className="w-6 h-6 text-green-600" />
                                    <h3 className="font-semibold text-gray-900">Express Delivery</h3>
                                </div>
                                <ul className="space-y-2 text-gray-600">
                                    <li>• Delivery within 2-3 business days</li>
                                    <li>• Available for select pin codes</li>
                                    <li>• Additional charge of ₹149</li>
                                    <li>• Free express shipping above ₹2500</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-green-50 p-6 rounded-xl mb-12">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-green-700" />
                                Delivery Coverage
                            </h3>
                            <p className="text-gray-600 mb-4">
                                We currently deliver to all serviceable pin codes across India. Enter your
                                pin code at checkout to check delivery availability and estimated delivery time.
                            </p>
                            <p className="text-gray-600">
                                <strong>Metro Cities:</strong> Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad,
                                Pune, Ahmedabad — typically receive orders 1-2 days faster.
                            </p>
                        </div>

                        <div className="prose prose-gray max-w-none mb-12">
                            <h3 className="text-xl font-semibold">Order Processing</h3>
                            <ul>
                                <li>Orders are processed within 24-48 hours (excluding weekends and holidays)</li>
                                <li>You will receive an email confirmation once your order is placed</li>
                                <li>A second email with tracking details will be sent once shipped</li>
                                <li>Track your order via the link in your email or from your account dashboard</li>
                            </ul>

                            <h3 className="text-xl font-semibold mt-8">Shipping Partners</h3>
                            <p>
                                We partner with trusted courier services including Delhivery, Blue Dart, and
                                Ecom Express to ensure safe and timely delivery of your orders.
                            </p>
                        </div>

                        {/* Returns Section */}
                        <h2 className="text-3xl font-serif text-gray-900 mb-8 flex items-center gap-3 pt-8 border-t">
                            <RefreshCw className="w-8 h-8 text-green-700" />
                            Returns & Refunds
                        </h2>

                        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
                            <h3 className="font-semibold text-gray-900 mb-4">15-Day Return Policy</h3>
                            <p className="text-gray-600 mb-4">
                                We want you to be completely satisfied with your purchase. If you're not happy
                                with your order, you can return it within 15 days of delivery.
                            </p>

                            <h4 className="font-medium text-gray-900 mt-6 mb-3">Eligible for Return:</h4>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600">✓</span>
                                    Unopened products in original packaging
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600">✓</span>
                                    Products damaged during transit
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600">✓</span>
                                    Wrong product delivered
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600">✓</span>
                                    Manufacturing defects
                                </li>
                            </ul>

                            <h4 className="font-medium text-gray-900 mt-6 mb-3">Not Eligible for Return:</h4>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500">✗</span>
                                    Opened or used products (unless defective)
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500">✗</span>
                                    Products without original packaging
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500">✗</span>
                                    Free gifts or promotional items
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500">✗</span>
                                    Products on final sale
                                </li>
                            </ul>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                                <h3 className="font-semibold text-gray-900 mb-4">How to Return</h3>
                                <ol className="space-y-3 text-gray-600">
                                    <li>1. Log into your account and go to Orders</li>
                                    <li>2. Select the order and click "Request Return"</li>
                                    <li>3. Choose your reason and submit</li>
                                    <li>4. Pack the item securely</li>
                                    <li>5. Our courier partner will pick it up</li>
                                </ol>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                                <h3 className="font-semibold text-gray-900 mb-4">Refund Timeline</h3>
                                <ul className="space-y-3 text-gray-600">
                                    <li>• Return pickup: 2-3 business days</li>
                                    <li>• Quality check: 2-3 business days</li>
                                    <li>• Refund processing: 5-7 business days</li>
                                    <li>• Bank credit: Depends on your bank</li>
                                </ul>
                                <p className="mt-4 text-sm text-gray-500">
                                    Refunds are credited to the original payment method
                                </p>
                            </div>
                        </div>

                        {/* Guarantee */}
                        <div className="bg-green-700 text-white p-8 rounded-xl">
                            <div className="flex items-center gap-4 mb-4">
                                <Shield className="w-10 h-10" />
                                <h3 className="text-xl font-semibold">Our Quality Guarantee</h3>
                            </div>
                            <p className="text-green-100 mb-4">
                                Every product from Vedessa is backed by our quality guarantee. If you receive
                                a product that doesn't meet our high standards, we'll replace it or refund you —
                                no questions asked.
                            </p>
                            <Link
                                to="/contact"
                                className="inline-block bg-white text-green-700 px-6 py-2 rounded-full font-medium hover:bg-green-50 transition-colors"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
