export const metadata = {
  title: "Privacy Policy - DoNotRisk",
  description: "DoNotRisk Privacy Policy - How we protect your data"
};

export default function PrivacyPolicyPage() {
  return (
    <section className="max-w-4xl mx-auto">
      <h1 className="font-display text-3xl mb-6">Privacy Policy</h1>
      <p className="text-sm text-ink/60 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="prose prose-ink max-w-none space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">1. Introduction</h2>
          <p className="text-ink/80">
            DoNotRisk ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our warranty intelligence platform.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">2. Information We Collect</h2>
          <div className="space-y-4 text-ink/80">
            <h3 className="font-semibold">Personal Information</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Name and email address when you register</li>
              <li>Contact information you provide</li>
              <li>Warranty documents and product information you upload</li>
              <li>Product registration details</li>
            </ul>

            <h3 className="font-semibold mt-4">Automatically Collected Information</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Device information (browser type, operating system)</li>
              <li>Usage data and analytics</li>
              <li>IP address and location data</li>
              <li>Cookies and tracking technologies</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 text-ink/80 ml-4">
            <li>To provide and maintain our warranty analysis services</li>
            <li>To process and analyze warranty documents you upload</li>
            <li>To communicate with you about your warranties and account</li>
            <li>To improve our services and develop new features</li>
            <li>To comply with legal obligations</li>
            <li>To detect and prevent fraud and abuse</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">4. Data Protection & Security</h2>
          <p className="text-ink/80">
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These measures include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-ink/80 ml-4 mt-4">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security audits and assessments</li>
            <li>Access controls and authentication requirements</li>
            <li>Secure data storage with industry-standard protocols</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">5. Data Retention</h2>
          <p className="text-ink/80">
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy. Warranty data and analysis results are retained based on your account activity and legal requirements.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">6. Your Rights</h2>
          <p className="text-ink/80 mb-4">You have the following rights regarding your personal data:</p>
          <ul className="list-disc list-inside space-y-2 text-ink/80 ml-4">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
            <li><strong>Erasure:</strong> Request deletion of your personal data</li>
            <li><strong>Portability:</strong> Request your data in a portable format</li>
            <li><strong>Objection:</strong> Object to processing of your data</li>
            <li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">7. Third-Party Services</h2>
          <p className="text-ink/80">
            We may share your information with third-party service providers who assist us in operating our platform, conducting our business, or servicing you. These parties are contractually obligated to maintain the confidentiality of your information.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">8. Children's Privacy</h2>
          <p className="text-ink/80">
            Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">9. Changes to This Policy</h2>
          <p className="text-ink/80">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">10. Contact Us</h2>
          <p className="text-ink/80">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <ul className="list-disc list-inside space-y-2 text-ink/80 ml-4 mt-4">
            <li>Email: privacy@donotrisk.com</li>
            <li>Through our Contact page</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
