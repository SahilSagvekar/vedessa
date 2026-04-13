import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Truck, Package, RefreshCw, Shield, MapPin } from 'lucide-react';

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

                        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Package className="w-6 h-6 text-green-600" />
                                <h3 className="font-semibold text-gray-900">Delivery</h3>
                            </div>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex gap-2">
                                    <span className="text-green-600">•</span>
                                    <span>Delivery within 5-7 business days</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-green-600">•</span>
                                    <span>Available across all serviceable pin codes in India</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-green-600">•</span>
                                    <span>Shipping charges calculated at checkout</span>
                                </li>
                            </ul>
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

                        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-12">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Processing</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex gap-2">
                                    <span className="text-green-600">•</span>
                                    <span>Orders are processed within 24-48 hours (excluding weekends and holidays)</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-green-600">•</span>
                                    <span>You will receive an email confirmation once your order is placed</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-green-600">•</span>
                                    <span>A second email with tracking details will be sent once shipped</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-green-600">•</span>
                                    <span>Track your order via the link in your email or from your account dashboard</span>
                                </li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Shipping Partners</h3>
                            <p className="text-gray-600">
                                We partner with trusted courier services to ensure safe and timely delivery of your orders.
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
                                    <span>Unopened products in original packaging</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600">✓</span>
                                    <span>Products damaged during transit</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600">✓</span>
                                    <span>Wrong product delivered</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600">✓</span>
                                    <span>Manufacturing defects</span>
                                </li>
                            </ul>

                            <h4 className="font-medium text-gray-900 mt-6 mb-3">Not Eligible for Return:</h4>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500">✗</span>
                                    <span>Opened or used products (unless defective)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500">✗</span>
                                    <span>Products without original packaging</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500">✗</span>
                                    <span>Free gifts or promotional items</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500">✗</span>
                                    <span>Products on final sale</span>
                                </li>
                            </ul>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                                <h3 className="font-semibold text-gray-900 mb-4">How to Return</h3>
                                <ol className="space-y-3 text-gray-600">
                                    <li className="flex gap-2">
                                        <span className="font-semibold text-green-700">1.</span>
                                        <span>Log into your account and go to Orders</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-semibold text-green-700">2.</span>
                                        <span>Select the order and click "Request Return"</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-semibold text-green-700">3.</span>
                                        <span>Choose your reason and submit</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-semibold text-green-700">4.</span>
                                        <span>Pack the item securely</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-semibold text-green-700">5.</span>
                                        <span>Our courier partner will pick it up</span>
                                    </li>
                                </ol>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                                <h3 className="font-semibold text-gray-900 mb-4">Refund Timeline</h3>
                                <ul className="space-y-3 text-gray-600">
                                    <li className="flex gap-2">
                                        <span className="text-green-600">•</span>
                                        <span>Return pickup: 2-3 business days</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-green-600">•</span>
                                        <span>Quality check: 2-3 business days</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-green-600">•</span>
                                        <span>Refund processing: 5-7 business days</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-green-600">•</span>
                                        <span>Bank credit: Depends on your bank</span>
                                    </li>
                                </ul>
                                <p className="mt-4 text-sm text-gray-500">
                                    Refunds are credited to the original payment method.
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