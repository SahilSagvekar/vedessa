import Layout from '@/components/layout/Layout';

const Terms = () => {
  return (
    <Layout>
      <div className="bg-kama-olive text-kama-cream py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-display">Terms & Conditions</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-4">Last updated: December 2024</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Introduction</h2>
          <p className="text-foreground mb-4">
            Welcome to Vedessa Ayurveda. By accessing or using our website and services, you agree to be bound by these Terms and Conditions.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Products</h2>
          <p className="text-foreground mb-4">
            All products sold on our website are authentic Ayurvedic beauty and wellness products. Product descriptions, images, and prices are subject to change without notice.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Orders and Payment</h2>
          <p className="text-foreground mb-4">
            By placing an order, you agree to provide accurate and complete information. Payment is processed securely through Razorpay. All prices are in Indian Rupees (INR) and include applicable taxes.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Shipping and Delivery</h2>
          <p className="text-foreground mb-4">
            We ship across India. Delivery typically takes 5-7 business days. Free shipping is available on orders above ₹1,000.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Returns and Refunds</h2>
          <p className="text-foreground mb-4">
            We accept returns within 7 days of delivery for unopened products. Refunds will be processed within 7-10 business days after receiving the returned product. Please refer to our Refund Policy for complete details.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. Contact Us</h2>
          <p className="text-foreground mb-4">
            For any questions regarding these terms, please contact us at:<br />
            Email: support@vedessa.com<br />
            Phone: +91-XXXXXXXXXX
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;