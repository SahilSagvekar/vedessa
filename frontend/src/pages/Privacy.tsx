import Layout from '@/components/layout/Layout';

const Privacy = () => {
  return (
    <Layout>
      <div className="bg-kama-olive text-kama-cream py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-display">Privacy Policy</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground mb-4">Last updated: December 2024</p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-foreground mb-4">
            We collect information you provide directly to us, including name, email address, phone number, shipping address, and payment information when you make a purchase.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-foreground mb-4">
            We use your information to process orders, communicate with you about your purchases, improve our services, and send promotional emails (with your consent).
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Information Sharing</h2>
          <p className="text-foreground mb-4">
            We do not sell or share your personal information with third parties except as necessary to process your orders (e.g., payment processors like Razorpay, shipping partners).
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Data Security</h2>
          <p className="text-foreground mb-4">
            We implement appropriate security measures to protect your personal information. Payment information is encrypted and processed securely through Razorpay.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Your Rights</h2>
          <p className="text-foreground mb-4">
            You have the right to access, correct, or delete your personal information. Contact us at privacy@vedessa.com for data-related requests.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. Contact Us</h2>
          <p className="text-foreground mb-4">
            For privacy-related questions, email us at privacy@vedessa.com
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;