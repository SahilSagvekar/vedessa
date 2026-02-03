import React from 'react';
import Layout from '@/components/layout/Layout';
import { RefreshCw, PackageCheck, AlertTriangle, Clock, CreditCard, Ship, MessageCircle } from 'lucide-react';

const Refund = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
        {/* Hero Section */}
        <div className="bg-kama-olive text-kama-cream py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-12 h-12" />
              <h1 className="text-4xl md:text-5xl font-display">Returns & Refunds</h1>
            </div>
            <p className="text-kama-cream/80 text-lg">
              Transparent policy for your peace of mind.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">

          {/* Section 1: Returns */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <PackageCheck className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">1. Return Eligibility</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                We take great pride in the quality of our Ayurvedic products. Due to the personal care nature of our items, we have a strictly defined return policy:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-kama-olive font-bold">•</span>
                  <span>Returns are accepted within <strong>7 days</strong> of delivery.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-kama-olive font-bold">•</span>
                  <span>Products must be <strong>unopened</strong>, unused, and in their original packaging with all seals intact.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500 font-bold">!</span>
                  <span className="text-red-700 font-medium">Items that have been opened or tested cannot be returned due to hygiene and health regulations.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2: Damaged/Wrong Items */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-kama-orange" />
              <h2 className="text-2xl font-display text-foreground">2. Damaged or Incorrect Products</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you receive a package that is damaged during transit or if we shipped the wrong item:
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>Please record an unboxing video of the package (recommended for faster processing).</li>
                <li>Contact us at <strong>vedessa0203@gmail.com</strong> within 24-48 hours of delivery.</li>
                <li>Attach clear photos of the damage and the shipping label.</li>
                <li>We will provide a free replacement or a full refund including shipping costs.</li>
              </ol>
            </div>
          </section>

          {/* Section 3: Process */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Ship className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">3. How to Initiate a Return</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Step 1: Email us with your Order ID and reason for return.<br />
                Step 2: Once approved, you will receive a <strong>Return Authorization</strong>.<br />
                Step 3: Our logistics partner (Ekart) may arrange a reverse pickup (where available) or you may be asked to ship it back.<br />
                Step 4: Once the item reaches our warehouse and passes quality check, the refund is initiated.
              </p>
            </div>
          </section>

          {/* Section 4: Refunds */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">4. Refund Timeline</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Processing
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Refunds are initiated within 48 hours of product approval.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Settlement
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    It may take 5-7 business days to reflect in your bank/card account via Razorpay.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Help */}
          <section className="mb-10">
            <div className="bg-gradient-to-br from-[#f9f5f0] to-[#f0e6d9] rounded-2xl p-8 border border-[#e0d0bc] text-center">
              <h2 className="text-2xl font-display text-[#5d4037] mb-2">Still Need Help?</h2>
              <p className="text-[#8d6e63] mb-6">Our support team is available Mon-Sat (10AM - 6PM)</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:vedessa0203@gmail.com"
                  className="px-8 py-3 bg-kama-olive hover:bg-kama-olive-light text-kama-cream rounded-full transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Email Support
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Refund;