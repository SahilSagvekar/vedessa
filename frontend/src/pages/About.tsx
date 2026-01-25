import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Leaf, Heart, Award, Users, Target, Sparkles } from 'lucide-react';

export default function About() {
    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-green-50 to-amber-50 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">
                            Our Story
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            At Vedessa, we believe in the timeless wisdom of Ayurveda. Our journey began
                            with a simple mission: to bring authentic, pure, and effective Ayurvedic
                            products to modern skincare and wellness routines.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <img
                                src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800"
                                alt="Ayurvedic ingredients"
                                className="rounded-2xl shadow-lg"
                            />
                        </div>
                        <div>
                            <h2 className="text-3xl font-serif text-gray-900 mb-6">Our Mission</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                To harness the ancient science of Ayurveda and make it accessible to everyone.
                                We carefully select each ingredient, ensuring purity and potency, to create
                                products that truly nourish your skin and soul.
                            </p>
                            <h2 className="text-3xl font-serif text-gray-900 mb-6">Our Vision</h2>
                            <p className="text-gray-600 leading-relaxed">
                                To become the most trusted name in Ayurvedic beauty and wellness, inspiring
                                people worldwide to embrace natural, holistic self-care routines that honor
                                both tradition and modern needs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-serif text-gray-900 text-center mb-12">Our Values</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Leaf,
                                title: '100% Natural',
                                description: 'All our products are made with pure, natural ingredients sourced from trusted suppliers.'
                            },
                            {
                                icon: Heart,
                                title: 'Cruelty-Free',
                                description: 'We never test on animals. Our products are ethical and compassionate.'
                            },
                            {
                                icon: Award,
                                title: 'Authentically Ayurvedic',
                                description: 'Every formulation follows traditional Ayurvedic principles and practices.'
                            },
                            {
                                icon: Users,
                                title: 'Community First',
                                description: 'We support local farmers and communities who grow our ingredients.'
                            },
                            {
                                icon: Target,
                                title: 'Results-Driven',
                                description: 'Ancient wisdom meets modern science for products that truly work.'
                            },
                            {
                                icon: Sparkles,
                                title: 'Sustainable',
                                description: 'Eco-friendly packaging and sustainable practices throughout our supply chain.'
                            }
                        ].map((value, index) => (
                            <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <value.icon className="w-12 h-12 text-green-700 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-serif text-gray-900 text-center mb-4">Meet Our Team</h2>
                    <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
                        A passionate group of Ayurveda enthusiasts, beauty experts, and wellness advocates
                        dedicated to bringing you the best of nature.
                    </p>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { name: 'Dr. Priya Sharma', role: 'Founder & Ayurveda Expert', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
                            { name: 'Rahul Verma', role: 'Head of Product', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
                            { name: 'Anita Desai', role: 'Quality Assurance', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400' },
                            { name: 'Vikram Singh', role: 'Operations', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' }
                        ].map((member, index) => (
                            <div key={index} className="text-center">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                                />
                                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                                <p className="text-gray-500 text-sm">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-green-700">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-serif text-white mb-4">
                        Start Your Ayurvedic Journey
                    </h2>
                    <p className="text-green-100 mb-8 max-w-xl mx-auto">
                        Explore our collection of authentic Ayurvedic products and transform your
                        skincare routine naturally.
                    </p>
                    <Link
                        to="/products"
                        className="inline-block bg-white text-green-700 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
                    >
                        Shop Now
                    </Link>
                </div>
            </section>
        </Layout>
    );
}
