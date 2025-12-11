import Layout from '@/components/layout/Layout';

const Refund = () => {
  return (
    <Layout>
      <div className="bg-kama-olive text-kama-cream py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-display">Refund & Return Policy</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-4">Last updated: December 2024</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Return Eligibility</h2>
          <p className="text-foreground mb-4">
            Products can be returned within 7 days of delivery if they are unopened, unused, and in original packaging. Opened or used products cannot be returned due to hygiene reasons.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Return Process</h2>
          <p className="text-foreground mb-4">
            To initiate a return:
          </p>
          <ul className="list-disc pl-6 text-foreground mb-4 space-y-2">
            <li>Contact us at returns@vedessa.com within 7 days of delivery</li>
            <li>Provide your order number and reason for return</li>
            <li>We will provide return shipping instructions</li>
            <li>Pack the product securely in original packaging</li>
            <li>Ship the product to our returns address</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Refund Processing</h2>
          <p className="text-foreground mb-4">
            Once we receive and inspect the returned product:
          </p>
          <ul className="list-disc pl-6 text-foreground mb-4 space-y-2">
            <li>Refund will be initiated within 2-3 business days</li>
            <li>Refund will be credited to original payment method</li>
            <li>Allow 7-10 business days for refund to reflect in your account</li>
            <li>Shipping charges are non-refundable</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Damaged or Defective Products</h2>
          <p className="text-foreground mb-4">
            If you receive a damaged or defective product, contact us immediately at support@vedessa.com with photos. We will arrange replacement or full refund including shipping charges.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Contact Us</h2>
          <p className="text-foreground mb-4">
            For return/refund queries:<br />
            Email: returns@vedessa.com<br />
            Phone: +91-XXXXXXXXXX
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Refund;