import Layout from '@/components/layout/Layout';
import { ScrollText, Shield, Package, CreditCard, Truck, Scale, User, Copyright, RefreshCw, AlertCircle } from 'lucide-react';

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
              Last Updated: April 13, 2026
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

          {/* Section 2: User Account & Responsibilities */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">2. User Account & Responsibilities</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">2.1 Account Creation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To place orders, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">2.2 Accurate Information</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to provide accurate, current, and complete information during registration and checkout. Providing false information may result in order cancellation or account termination.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">2.3 Prohibited Activities</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You agree not to misuse the website, attempt unauthorized access, interfere with its operation, or use it for any unlawful purpose.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Products & Ayurveda Disclaimer */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">3. Products & Pricing</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">3.1 Ayurvedic Disclaimer</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our products are based on Ayurvedic principles. While we use natural ingredients, results may vary from person to person. Our products are not intended to diagnose, treat, cure, or prevent any disease, and should not replace professional medical advice or treatment. Always perform a patch test before full use.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">3.2 Pricing & Taxes</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All prices are in INR (Indian Rupees) and are inclusive of GST (Goods and Services Tax) as per Indian Government regulations. We reserve the right to change prices at any time without prior notice.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">3.3 Product Availability</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All products are subject to availability. We reserve the right to discontinue any product at any time. Product images are for illustration purposes and actual products may vary slightly.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Orders & Payment */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">4. Orders & Payment</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">4.1 Payments</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Payments are processed securely through <strong>Razorpay</strong>. By placing an order, you agree to their terms of service. We do not store sensitive payment data (card numbers, CVV, etc.) on our servers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">4.2 Order Confirmation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  An order confirmation email will be sent upon successful payment. This confirmation constitutes acceptance of your order. Please verify order details carefully.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">4.3 Order Cancellation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to refuse or cancel any order for reasons including but not limited to: product unavailability, pricing errors, suspected fraud, or quantity limits per customer.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Shipping & Delivery */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">5. Shipping & Delivery</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                 Deliveries typically take 5-7 business days depending on your location in India.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Delivery timelines are estimates and may vary due to factors beyond our control. We are not liable for delays caused by courier services, natural events, or incorrect address details provided by you.
              </p>
            </div>
          </section>

          {/* Section 6: Returns & Refunds */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">6. Returns & Refunds</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                We want you to be completely satisfied with your purchase. If you are not happy with your order, please refer to our <a href="/refund" className="text-kama-olive underline hover:no-underline">Refund Policy</a> and <a href="/shipping" className="text-kama-olive underline hover:no-underline">Shipping & Returns</a> pages for detailed information on eligibility, timelines, and procedures.
              </p>
            </div>
          </section>

          {/* Section 7: Intellectual Property */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Copyright className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">7. Intellectual Property</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">7.1 Ownership</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All content on this website — including but not limited to text, images, graphics, logos, product descriptions, and software — is the property of Vedessa and is protected by Indian and international copyright, trademark, and intellectual property laws.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">7.2 Restrictions</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any content from this website without our prior written permission.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8: Limitation of Liability */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">8. Limitation of Liability</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                To the fullest extent permitted by applicable law, Vedessa shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising out of or in connection with your use of this website or our products.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our total liability for any claim arising from your use of the website or products shall not exceed the amount you paid for the specific product giving rise to such claim.
              </p>
            </div>
          </section>

          {/* Section 9: Governing Law */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">9. Governing Law & Jurisdiction</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any dispute arising out of or relating to these Terms or your use of the website shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra, India.
              </p>
            </div>
          </section>

          {/* Grievance Redressal */}
          <section className="mb-10">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-border">
              <h2 className="text-2xl font-display text-foreground mb-4">Grievance Redressal</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In accordance with the Consumer Protection (E-Commerce) Rules, 2020, the contact details of the Grievance Officer are provided below:
              </p>
              <div className="space-y-2 text-foreground">
                <p><span className="font-semibold">Grievance Officer:</span> Customer Support Team</p>
                <p><span className="font-semibold">Email:</span> vedessa0203@gmail.com</p>
                <p><span className="font-semibold">Address:</span> Dahisar, Mumbai, Maharashtra 400068, India</p>
                <p className="text-muted-foreground text-sm mt-4">
                  We will acknowledge your complaint within 48 hours and aim to resolve it within 30 days of receipt.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}