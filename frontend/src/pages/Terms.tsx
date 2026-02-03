import React from 'react';
import Layout from '@/components/layout/Layout';
import { ScrollText, Shield, Package, CreditCard, RefreshCw, AlertCircle } from 'lucide-react';

export default function Terms() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
        {/* Hero Section */}
        <div className="bg-kama-olive text-kama-cream py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <ScrollText className="w-12 h-12" />
              <h1 className="text-4xl md:text-5xl font-display">Terms & Conditions</h1>
            </div>
            <p className="text-kama-cream/80 text-lg">
              Last Updated: February 3, 2026
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Introduction */}
          <section className="mb-12">
            <p className="text-foreground leading-relaxed mb-4">
              Welcome to Vedessa. By accessing and using our website, you agree to comply with and be bound by the following terms and conditions. These terms apply to all visitors, users, and others who access or use the Service.
            </p>
            <p className="text-foreground leading-relaxed">
              Vedessa is an Ayurvedic wellness brand based in India. Use of this website is governed by the laws of India.
            </p>
          </section>

          {/* Section 1: General Terms */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">1. General Terms</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">1.1 Acceptance of Terms</h3>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing this website, you accept these terms and conditions in full. If you disagree with these terms, you must not use this website.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">1.2 Modifications</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the website constitutes acceptance of the modified terms.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Products & Ayurveda Disclaimer */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">2. Products & Pricing</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">2.1 Ayurvedic Disclaimer</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our products are based on Ayurvedic principles. While we use natural ingredients, results may vary from person to person. Our products are not intended to replace professional medical advice or treatment. Always perform a patch test before full use.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">2.2 Pricing & Taxes</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All prices are in INR (Indian Rupees) and are inclusive of GST (Goods and Services Tax) as per Indian Government regulations.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Orders & Payment */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">3. Orders & Payment</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">3.1 Payments</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Payments are processed through <strong>Razorpay</strong>. By placing an order, you agree to their terms of service. We do not store sensitive payment data on our servers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">3.2 Order Fulfillment</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person or per order.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Shipping via Ekart */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">4. Shipping & Delivery</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Logistics are handled by our partner <strong>Ekart (Ecom Express)</strong>. Deliveries typically take 5-7 business days depending on your location in India. You can track your order live on our website using your AWB number.
              </p>
            </div>
          </section>

          {/* Section 5: Governing Law */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">5. Governing Law</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any legal action or proceeding related to your access to, or use of, the Site shall be instituted in a state or federal court in Vadodara, Gujarat.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-10">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-border">
              <h2 className="text-2xl font-display text-foreground mb-4">Grievance Redressal</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In accordance with Consumer Protection (E-Commerce) Rules, 2020, the name and contact details of the Grievance Officer are provided below:
              </p>
              <div className="space-y-1 text-foreground font-medium">
                <p>Vedessa Ayurveda</p>
                <p>Email: vedessa0203@gmail.com</p>
                <p>Location: Gujarat, India</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}