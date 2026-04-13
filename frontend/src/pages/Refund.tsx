import Layout from '@/components/layout/Layout';
import { RefreshCw, PackageCheck, AlertTriangle, Clock, CreditCard, Truck, MessageCircle } from 'lucide-react';

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
                We take great pride in the quality of our Ayurvedic products. Due to the personal care nature of our items, we have a clearly defined return policy:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-kama-olive font-bold">•</span>
                  <span>Returns are accepted within <strong>15 days</strong> of delivery.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-kama-olive font-bold">•</span>
                  <span>Products must be <strong>unopened</strong>, unused, and in their original packaging with all seals intact.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-kama-olive font-bold">•</span>
                  <span>Items that have been opened or tested cannot be returned due to hygiene and safety reasons (unless defective).</span>
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
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                If you receive a damaged package or the wrong item, please follow these steps:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-semibold text-kama-olive">1.</span>
                  <span>Contact us at <strong>vedessa0203@gmail.com</strong> within 48 hours of delivery.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-kama-olive">2.</span>
                  <span>Attach clear photos of the damage and the shipping label.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-kama-olive">3.</span>
                  <span>We will provide a free replacement or a full refund including shipping costs.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Process */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-6 h-6 text-kama-olive" />
              <h2 className="text-2xl font-display text-foreground">3. How to Initiate a Return</h2>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-semibold text-kama-olive">1.</span>
                  <span>Email us at <strong>vedessa0203@gmail.com</strong> with your Order ID and reason for return.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-kama-olive">2.</span>
                  <span>Once approved, you will receive a <strong>Return Authorization</strong>.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-kama-olive">3.</span>
                  <span>Our courier partner may arrange a reverse pickup (where available) or you may be asked to ship it back.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-kama-olive">4.</span>
                  <span>Once the item reaches our warehouse and passes quality check, the refund is initiated.</span>
                </li>
              </ul>
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
                    It may take 5-7 business days to reflect in your bank/card account.
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Refunds are credited to the original payment method used during checkout.
              </p>
            </div>
          </section>

          {/* Help */}
          <section className="mb-10">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-border text-center">
              <h2 className="text-2xl font-display text-foreground mb-2">Still Need Help?</h2>
              <p className="text-muted-foreground mb-6">Our support team is here to assist you.</p>
              <a
                href="mailto:vedessa0203@gmail.com"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-kama-olive hover:bg-kama-olive-light text-kama-cream rounded-full transition-all"
              >
                <MessageCircle className="w-4 h-4" /> Email Support
              </a>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Refund;