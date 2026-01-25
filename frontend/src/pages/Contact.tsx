import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Contact() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast({
            title: 'Message Sent!',
            description: 'Thank you for contacting us. We will get back to you soon.',
        });

        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });
        setLoading(false);
    };

    return (
        <Layout>
            {/* Hero */}
            <section className="bg-gradient-to-br from-green-50 to-amber-50 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Have questions about our products or need help with an order?
                        We're here to help you on your Ayurvedic journey.
                    </p>
                </div>
            </section>

            {/* Contact Info & Form */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Contact Info */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <MapPin className="w-6 h-6 text-green-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Our Office</h3>
                                        <p className="text-gray-600 text-sm">
                                            123 Ayurveda Lane<br />
                                            Mumbai, Maharashtra 400001<br />
                                            India
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <Phone className="w-6 h-6 text-green-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                                        <p className="text-gray-600 text-sm">
                                            +91 98765 43210<br />
                                            +91 22 1234 5678
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <Mail className="w-6 h-6 text-green-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                                        <p className="text-gray-600 text-sm">
                                            support@vedessa.com<br />
                                            orders@vedessa.com
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <Clock className="w-6 h-6 text-green-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                                        <p className="text-gray-600 text-sm">
                                            Monday - Friday: 9 AM - 7 PM<br />
                                            Saturday: 10 AM - 5 PM<br />
                                            Sunday: Closed
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white p-8 rounded-xl shadow-sm">
                                <h2 className="text-2xl font-serif text-gray-900 mb-6">Send us a Message</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                                placeholder="Your name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Subject *
                                            </label>
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                            >
                                                <option value="">Select a subject</option>
                                                <option value="product-inquiry">Product Inquiry</option>
                                                <option value="order-status">Order Status</option>
                                                <option value="returns">Returns & Refunds</option>
                                                <option value="feedback">Feedback</option>
                                                <option value="partnership">Partnership</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                                            placeholder="How can we help you?"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full md:w-auto px-8 py-3 bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map */}
            <section className="h-96 bg-gray-200">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709657!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1640000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Vedessa Location"
                />
            </section>
        </Layout>
    );
}
