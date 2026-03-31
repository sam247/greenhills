import Layout from "@/components/layout/Layout";

const Privacy = () => (
  <Layout>
    <section className="bg-primary text-primary-foreground py-16">
      <div className="container">
        <h1 className="text-3xl md:text-4xl font-heading font-800">Privacy Policy</h1>
      </div>
    </section>
    <section className="py-16">
      <div className="container max-w-3xl prose prose-sm">
        <h2 className="font-heading font-700 text-xl mb-4">Introduction</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Greenhills Electric is committed to protecting your personal data. This privacy policy explains how we collect, 
          use and safeguard your information when you use our website and services.
        </p>

        <h2 className="font-heading font-700 text-xl mb-4">Information We Collect</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">We may collect the following information:</p>
        <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-1">
          <li>Name and contact details (phone, email, address)</li>
          <li>Information about your property and electrical requirements</li>
          <li>Payment and billing information</li>
          <li>Website usage data through cookies</li>
        </ul>

        <h2 className="font-heading font-700 text-xl mb-4">How We Use Your Information</h2>
        <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-1">
          <li>To provide quotes and carry out electrical work</li>
          <li>To communicate about your project</li>
          <li>To process payments and invoices</li>
          <li>To improve our services</li>
        </ul>

        <h2 className="font-heading font-700 text-xl mb-4">Your Rights</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          You have the right to access, correct or delete your personal data. Contact us at 
          info@greenhillselectric.co.uk to exercise these rights.
        </p>

        <h2 className="font-heading font-700 text-xl mb-4">Cookies</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Our website uses cookies to improve your experience. You can manage cookie preferences through your browser settings.
        </p>

        <h2 className="font-heading font-700 text-xl mb-4">Contact</h2>
        <p className="text-muted-foreground leading-relaxed">
          For any privacy-related queries, please email info@greenhillselectric.co.uk.
        </p>
      </div>
    </section>
  </Layout>
);

export default Privacy;
