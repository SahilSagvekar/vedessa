import React from 'react';
import Layout from '@/components/layout/Layout';
import { ScrollText, Shield, Package, CreditCard, RefreshCw, AlertCircle } from 'lucide-react';

export default function Terms() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <ScrollText className="w-12 h-12" />
              <h1 className="text-4xl md:text-5xl font-serif">Terms & Conditions</h1>
            </div>
            <p className="text-green-100 text-lg">
              Last Updated: February 3, 2026
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Introduction */}
          <section className="mb-12">
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to Vedessa. By accessing and using our website, you agree to comply with and be bound by the following terms and conditions. Please read these terms carefully before using our services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you do not agree with any part of these terms, please do not use our website or purchase our products.
            </p>
          </section>

          {/* Section 1: General Terms */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-serif text-gray-800">1. General Terms</h2>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">1.1 Acceptance of Terms</h3>
                <p className="text-gray-700 leading-relaxed">
                  By accessing this website, you accept these terms and conditions in full. If you disagree with these terms, you must not use this website.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">1.2 Modifications</h3>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on the website. Your continued use of the website constitutes acceptance of the modified terms.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">1.3 Eligibility</h3>
                <p className="text-gray-700 leading-relaxed">
                  You must be at least 18 years old to make purchases on our website. By placing an order, you confirm that you are of legal age.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Products & Pricing */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-serif text-gray-800">2. Products & Pricing</h2>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">2.1 Product Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions, images, or other content are accurate, complete, or error-free.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">2.2 Pricing</h3>
                <p className="text-gray-700 leading-relaxed">
                  All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless otherwise stated. We reserve the right to change prices at any time without prior notice.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">2.3 Availability</h3>
                <p className="text-gray-700 leading-relaxed">
                  All products are subject to availability. We reserve the right to discontinue any product at any time. In case of unavailability after order placement, we will notify you and process a full refund.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">2.4 Ayurvedic Products Disclaimer</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our Ayurvedic products are meant to support wellness and are not intended to diagnose, treat, cure, or prevent any disease. Please consult with a qualified healthcare practitioner before using any products, especially if you are pregnant, nursing, or have a medical condition.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Orders & Payment */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-serif text-gray-800">3. Orders & Payment</h2>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">3.1 Order Acceptance</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your order constitutes an offer to purchase products. We reserve the right to accept or reject any order at our discretion. Order confirmation does not guarantee acceptance.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">3.2 Payment Methods</h3>
                <p className="text-gray-700 leading-relaxed">
                  We accept various payment methods including credit/debit cards, UPI, net banking, and Cash on Delivery (COD) where available. All payments are processed securely through our payment gateway partners.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">3.3 Payment Security</h3>
                <p className="text-gray-700 leading-relaxed">
                  We use industry-standard encryption to protect your payment information. We do not store complete credit card details on our servers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">3.4 Order Cancellation</h3>
                <p className="text-gray-700 leading-relaxed">
                  You may cancel your order within 24 hours of placement if it has not been shipped. Once shipped, cancellation is not possible, but you may return the product as per our return policy.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Shipping & Delivery */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-serif text-gray-800">4. Shipping & Delivery</h2>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">4.1 Shipping Areas</h3>
                <p className="text-gray-700 leading-relaxed">
                  We currently ship within India. International shipping is not available at this time.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">4.2 Delivery Time</h3>
                <p className="text-gray-700 leading-relaxed">
                  Estimated delivery times are 5-7 business days for most locations. Actual delivery times may vary based on location and other factors beyond our control.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">4.3 Shipping Charges</h3>
                <p className="text-gray-700 leading-relaxed">
                  Shipping charges are calculated based on order value, weight, and delivery location. Free shipping may be offered on orders above a certain value.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">4.4 Delivery Issues</h3>
                <p className="text-gray-700 leading-relaxed">
                  We are not responsible for delays caused by incorrect addresses, unavailability of recipient, or circumstances beyond our control. Please ensure accurate delivery information.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Returns & Refunds */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-serif text-gray-800">5. Returns & Refunds</h2>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">5.1 Return Policy</h3>
                <p className="text-gray-700 leading-relaxed">
                  We accept returns within 7 days of delivery for unopened products in original packaging. Opened or used products cannot be returned due to health and safety regulations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">5.2 Return Process</h3>
                <p className="text-gray-700 leading-relaxed">
                  To initiate a return, contact our customer support with your order number and reason for return. We will provide return instructions and a return authorization if applicable.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">5.3 Refund Processing</h3>
                <p className="text-gray-700 leading-relaxed">
                  Refunds will be processed within 7-10 business days after receiving and inspecting the returned product. Refunds will be issued to the original payment method.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">5.4 Non-Returnable Items</h3>
                <p className="text-gray-700 leading-relaxed">
                  Certain items including opened products, personalized items, and products marked as non-returnable are not eligible for return.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: User Accounts */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-serif text-gray-800">6. User Accounts</h2>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">6.1 Account Security</h3>
                <p className="text-gray-700 leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorized use of your account.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">6.2 Account Termination</h3>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7: Intellectual Property */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-serif text-gray-800">7. Intellectual Property</h2>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">7.1 Copyright</h3>
                <p className="text-gray-700 leading-relaxed">
                  All content on this website, including text, images, logos, and designs, is the property of Vedessa and protected by copyright laws. Unauthorized use is prohibited.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">7.2 Trademarks</h3>
                <p className="text-gray-700 leading-relaxed">
                  "Vedessa" and our logo are trademarks. You may not use our trademarks without prior written permission.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8: Limitation of Liability */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-serif text-gray-800">8. Limitation of Liability</h2>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
              <p className="text-gray-700 leading-relaxed">
                To the maximum extent permitted by law, Vedessa shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or website. Our total liability shall not exceed the amount paid for the product in question.
              </p>
            </div>
          </section>

          {/* Section 9: Privacy */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-serif text-gray-800">9. Privacy & Data Protection</h2>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Your use of our website is also governed by our Privacy Policy. We collect and process personal information in accordance with applicable data protection laws. Please review our Privacy Policy to understand how we handle your data.
              </p>
            </div>
          </section>

          {/* Section 10: Governing Law */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <ScrollText className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-serif text-gray-800">10. Governing Law</h2>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
              <p className="text-gray-700 leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-10">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-8">
              <h2 className="text-2xl font-serif text-gray-800 mb-4">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> vedessa0203@gmail.com</p>
                <p><strong>Website:</strong> www.vedessa.in</p>
              </div>
            </div>
          </section>

          {/* Acceptance */}
          <section className="border-t border-gray-200 pt-8">
            <p className="text-gray-600 text-sm leading-relaxed">
              By using our website and making a purchase, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}