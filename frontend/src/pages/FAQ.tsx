import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const faqData: FAQItem[] = [
    // Orders & Shipping
    {
        category: 'Orders & Shipping',
        question: 'How long does delivery take?',
        answer: 'Standard delivery takes 5-7 business days across India. Metro cities may receive orders within 3-5 business days. Express delivery options are available at checkout for faster delivery.'
    },
    {
        category: 'Orders & Shipping',
        question: 'Do you offer free shipping?',
        answer: 'Yes! We offer free standard shipping on all orders above ₹1000. For orders below ₹1000, a flat shipping fee of ₹99 is applied.'
    },
    {
        category: 'Orders & Shipping',
        question: 'Can I track my order?',
        answer: 'Absolutely! Once your order is shipped, you will receive an email and SMS with your tracking number. You can track your order status on our website or directly on the courier partner\'s website.'
    },
    {
        category: 'Orders & Shipping',
        question: 'Do you ship internationally?',
        answer: 'Currently, we ship only within India. We are working on expanding to international shipping soon. Please subscribe to our newsletter for updates.'
    },
    // Returns & Refunds
    {
        category: 'Returns & Refunds',
        question: 'What is your return policy?',
        answer: 'We accept returns within 15 days of delivery for unopened products in original packaging. Opened products can be returned only if defective or damaged during transit.'
    },
    {
        category: 'Returns & Refunds',
        question: 'How do I initiate a return?',
        answer: 'To initiate a return, log into your account, go to your orders, and click on "Return" for the specific item. You can also contact our customer support team at support@vedessa.com.'
    },
    {
        category: 'Returns & Refunds',
        question: 'When will I receive my refund?',
        answer: 'Once we receive and verify your returned product, refunds are processed within 5-7 business days. The amount will be credited to your original payment method.'
    },
    // Products
    {
        category: 'Products',
        question: 'Are your products 100% natural?',
        answer: 'Yes, all our products are made with 100% natural ingredients following traditional Ayurvedic formulations. We do not use any synthetic chemicals, parabens, or artificial fragrances.'
    },
    {
        category: 'Products',
        question: 'Are your products tested on animals?',
        answer: 'No, we are proudly cruelty-free. We never test our products or ingredients on animals. All our products are certified cruelty-free.'
    },
    {
        category: 'Products',
        question: 'What is the shelf life of your products?',
        answer: 'Most of our products have a shelf life of 24-36 months from the date of manufacture. The expiry date is clearly mentioned on each product packaging.'
    },
    {
        category: 'Products',
        question: 'Do you provide product samples?',
        answer: 'We include complimentary samples with orders above ₹2000. You can also purchase sample-sized products from our Sample Collection.'
    },
    // Payments
    {
        category: 'Payments',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit/debit cards, UPI, Net Banking, and popular wallets like Paytm and PhonePe. We also offer Cash on Delivery for orders up to ₹5000.'
    },
    {
        category: 'Payments',
        question: 'Is my payment information secure?',
        answer: 'Yes, all transactions are processed through Razorpay, a PCI-DSS compliant payment gateway. Your payment information is encrypted and never stored on our servers.'
    },
    // Account
    {
        category: 'Account',
        question: 'How do I create an account?',
        answer: 'Click on the user icon in the header and select "Sign Up". Enter your email address and create a password. You can also sign up during checkout.'
    },
    {
        category: 'Account',
        question: 'I forgot my password. How do I reset it?',
        answer: 'Click on "Forgot Password" on the login page and enter your email address. You will receive a password reset link via email within a few minutes.'
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', ...Array.from(new Set(faqData.map(faq => faq.category)))];

    const filteredFAQs = faqData.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <Layout>
            {/* Hero */}
            <section className="bg-gradient-to-br from-green-50 to-amber-50 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                        Find answers to common questions about our products, orders, shipping, and more.
                    </p>

                    {/* Search */}
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        />
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-2 mb-8 justify-center">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                                            ? 'bg-green-700 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* FAQ List */}
                        <div className="space-y-4">
                            {filteredFAQs.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No FAQs found matching your search.</p>
                                </div>
                            ) : (
                                filteredFAQs.map((faq, index) => (
                                    <div
                                        key={index}
                                        className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                                    >
                                        <button
                                            onClick={() => toggleFAQ(index)}
                                            className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <div>
                                                <span className="text-xs font-medium text-green-600 uppercase tracking-wider">
                                                    {faq.category}
                                                </span>
                                                <h3 className="text-lg font-medium text-gray-900 mt-1">
                                                    {faq.question}
                                                </h3>
                                            </div>
                                            {openIndex === index ? (
                                                <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                            )}
                                        </button>
                                        {openIndex === index && (
                                            <div className="px-6 pb-6">
                                                <p className="text-gray-600 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Still Need Help */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-serif text-gray-900 mb-4">
                        Still Have Questions?
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                        Can't find what you're looking for? Our customer support team is here to help.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-block bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-full font-medium transition-colors"
                    >
                        Contact Us
                    </Link>
                </div>
            </section>
        </Layout>
    );
}
