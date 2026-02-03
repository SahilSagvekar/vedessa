import React from 'react';
import Layout from '@/components/layout/Layout';
import { Shield, Eye, Lock, RefreshCw, UserCheck, MessageSquare } from 'lucide-react';

const Privacy = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
        {/* Hero Section */}
        <div className="bg-kama-olive text-kama-cream py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-12 h-12" />
              <h1 className="text-4xl md:text-5xl font-display">Privacy Policy</h1>
            </div>
            <p className="text-kama-cream/80 text-lg">
              Effective Date: February 3, 2026
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <section className="mb-12">
            <p className="text-foreground leading-relaxed mb-4">
              At Vedessa, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy describes how we collect, use, and safeguard the data you provide while using our website.
            </p>
            <p className="text-foreground leading-relaxed">
              By accessing Vedessa, you agree to the practices described in this policy. We comply with Information Technology Act, 2000 and other applicable Indian laws regarding data protection.
            </p>
          </section>

          {/* Section 1: Data Collection */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">1. Information We Collect</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">1.1 Personal Information</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We collect information that identifies you, such as your name, email address, phone number, shipping address, and billing information when you create an account or place an order.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">1.2 Transaction Data</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Records of products you've purchased, order history, and payment status. Please note: we do not store your full card details; these are handled securely by Razorpay.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">1.3 Technical Data</h3>
                <p className="text-muted-foreground leading-relaxed">
                  IP address, browser type, device information, and cookies to improve your browsing experience and site performance.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Usage */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">2. How We Use Your Data</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-kama-olive font-bold">•</span>
                  <span>To process and deliver your orders efficiently.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-kama-olive font-bold">•</span>
                  <span>To provide shipment tracking updates via email/SMS.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-kama-olive font-bold">•</span>
                  <span>To communicate with you regarding support or collaboration requests.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-kama-olive font-bold">•</span>
                  <span>To personalize your shopping experience and show relevant Ayurvedic product recommendations.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-kama-olive font-bold">•</span>
                  <span>To comply with legal obligations and prevent fraudulent transactions.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Security */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">3. Data Security & Payments</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <p className="text-muted-foreground leading-relaxed mb-4">
                We implement industry-standard 256-bit SSL encryption to protect your data during transmission.
              </p>
              <div className="bg-muted p-4 rounded-lg border-l-4 border-kama-olive">
                <p className="text-sm font-medium text-foreground">Payment Safety:</p>
                <p className="text-sm text-muted-foreground">
                  Our payment gateway (Razorpay) is PCI-DSS compliant. Vedessa does not store your Credit/Debit card numbers or CVV on its servers.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Sharing */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">4. Third-Party Sharing</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <p className="text-muted-foreground leading-relaxed">
                We do not sell your data. We only share information with:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>• <strong>Logistics Partners:</strong> Ekart/Ecom Express for delivering your packages.</li>
                <li>• <strong>Payment Processors:</strong> Razorpay for handling transactions.</li>
                <li>• <strong>Cloud Services:</strong> Secure servers for database management.</li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-10">
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-8 border border-green-300">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-kama-olive" />
                <h2 className="text-2xl font-display text-foreground">Data Privacy Contact</h2>
              </div>
              <p className="text-foreground leading-relaxed mb-4">
                If you wish to access, correct, or delete your personal data, or have concerns about your privacy, please contact our Grievance Officer:
              </p>
              <div className="space-y-1 text-foreground font-medium">
                <p>Email: vedessa0203@gmail.com</p>
                <p>Address: Vadodara, Gujarat, India</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;