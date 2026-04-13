import Layout from '@/components/layout/Layout';
import { Shield, Eye, Lock, RefreshCw, UserCheck, MessageSquare, Clock, Cookie, Users } from 'lucide-react';

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
              Effective Date: April 13, 2026
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
              By accessing Vedessa, you agree to the practices described in this policy. We comply with the Information Technology Act, 2000 and other applicable Indian laws regarding data protection.
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
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell your data. We only share information with:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                {/* <li className="flex gap-2">
                  <span className="text-kama-olive font-bold">•</span>
                  <span><strong>Logistics Partners:</strong> Ekart/Ecom Express for delivering your packages.</span>
                </li> */}
                <li className="flex gap-2">
                  <span className="text-kama-olive font-bold">•</span>
                  <span><strong>Payment Processors:</strong> Razorpay for handling transactions.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-kama-olive font-bold">•</span>
                  <span><strong>Cloud Services:</strong> Secure servers for database management.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5: Cookies */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">5. Cookies Policy</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                We use cookies to enhance your browsing experience. Cookies are small text files stored on your device that help us:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-kama-olive font-bold">•</span>
                  <span>Remember your login session and preferences</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-kama-olive font-bold">•</span>
                  <span>Keep items in your shopping cart</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-kama-olive font-bold">•</span>
                  <span>Understand how you use our website to improve it</span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                You can disable cookies in your browser settings, but this may affect certain features of the website such as the shopping cart and checkout process.
              </p>
            </div>
          </section>

          {/* Section 6: Data Retention */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">6. Data Retention</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-kama-olive font-bold">•</span>
                  <span><strong>Account Data:</strong> Retained while your account is active. You may request deletion at any time.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-kama-olive font-bold">•</span>
                  <span><strong>Order & Transaction Data:</strong> Retained for 7 years as required under Indian tax and accounting laws.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-kama-olive font-bold">•</span>
                  <span><strong>Technical/Log Data:</strong> Automatically deleted after 90 days.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 7: Your Rights */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">7. Your Rights</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Under applicable Indian laws, you have the following rights regarding your personal data:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-kama-olive font-bold">•</span>
                  <span><strong>Right to Access:</strong> Request a copy of the personal data we hold about you.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-kama-olive font-bold">•</span>
                  <span><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete data.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-kama-olive font-bold">•</span>
                  <span><strong>Right to Deletion:</strong> Request deletion of your personal data, subject to legal retention requirements.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-kama-olive font-bold">•</span>
                  <span><strong>Right to Withdraw Consent:</strong> Withdraw consent for marketing communications at any time.</span>
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                To exercise any of these rights, please contact us at vedessa0203@gmail.com. We will respond to your request within 30 days.
              </p>
            </div>
          </section>

          {/* Section 8: Children's Privacy */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">8. Children's Privacy</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <p className="text-muted-foreground leading-relaxed">
                Our website is not intended for children under 18 years of age. We do not knowingly collect personal information from minors. If you are a parent or guardian and believe your child has provided us with personal data, please contact us immediately at vedessa0203@gmail.com and we will delete such information.
              </p>
            </div>
          </section>

          {/* Section 9: Policy Updates */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">9. Changes to This Policy</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Effective Date." We encourage you to review this policy periodically. Your continued use of the website after any changes constitutes acceptance of the updated policy.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-10">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-kama-olive" />
                <h2 className="text-2xl font-display text-foreground">Data Privacy Contact</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you wish to access, correct, or delete your personal data, or have concerns about your privacy, please contact our Grievance Officer:
              </p>
              <div className="space-y-2 text-foreground">
                <p><span className="font-semibold">Grievance Officer:</span> Customer Support Team</p>
                <p><span className="font-semibold">Email:</span> vedessa0203@gmail.com</p>
                <p><span className="font-semibold">Address:</span> Dahisar, Mumbai, Maharashtra 400068, India</p>
                <p className="text-muted-foreground text-sm mt-4">
                  We will acknowledge your request within 48 hours and aim to resolve it within 30 days of receipt.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;