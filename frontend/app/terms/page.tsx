export const metadata = {
  title: "Terms and Conditions - DoNotRisk",
  description: "DoNotRisk Terms and Conditions"
};

export default function TermsAndConditionsPage() {
  return (
    <section className="max-w-4xl mx-auto">
      <h1 className="font-display text-3xl mb-6">Terms and Conditions</h1>
      <p className="text-sm text-ink/60 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="prose prose-ink max-w-none space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">1. Acceptance of Terms</h2>
          <p className="text-ink/80">
            By accessing and using DoNotRisk ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this Service.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">2. Description of Service</h2>
          <p className="text-ink/80 mb-4">
            DoNotRisk is an AI-powered warranty intelligence platform that provides:
          </p>
          <ul className="list-disc list-inside space-y-2 text-ink/80 ml-4">
            <li>Warranty document scanning and OCR extraction</li>
            <li>AI-based warranty analysis and risk assessment</li>
            <li>Warranty tracking and expiry alerts</li>
            <li>Product information and warranty database access</li>
            <li>Customer support assistance for warranty-related queries</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">3. User Registration and Account</h2>
          <div className="space-y-4 text-ink/80">
            <p>To use our Service, you must:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Be at least 18 years of age or have parental/guardian consent</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Promptly update any changes to your information</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">4. User Obligations</h2>
          <p className="text-ink/80 mb-4">You agree not to:</p>
          <ul className="list-disc list-inside space-y-2 text-ink/80 ml-4">
            <li>Use the Service for any unlawful purpose</li>
            <li>Upload or transmit viruses, malware, or other harmful code</li>
            <li>Attempt to gain unauthorized access to the Service</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Reproduce, duplicate, copy, or resell any part of the Service</li>
            <li>Use the Service to upload false or misleading warranty information</li>
            <li>Harass, abuse, or harm another user</li>
            <li>Upload content that infringes intellectual property rights</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">5. Intellectual Property</h2>
          <div className="space-y-4 text-ink/80">
            <p>The Service and its original content, features, and functionality are owned by DoNotRisk and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
            <p>You retain ownership of any content you upload to the Service, but you grant us a license to use, store, and process that content to provide our services.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">6. Warranty Analysis Disclaimer</h2>
          <div className="space-y-4 text-ink/80">
            <p>Our AI-powered warranty analysis is provided for informational purposes only:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Analysis results are based on AI interpretation and may not be 100% accurate</li>
              <li>Always verify warranty information with official manufacturer documentation</li>
              <li>We do not guarantee the completeness or accuracy of analysis results</li>
              <li>Warranty terms are subject to change by manufacturers</li>
              <li>Final determination of warranty coverage rests with the manufacturer</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">7. Payment and Subscription</h2>
          <div className="space-y-4 text-ink/80">
            <p>Some features of our Service may require payment:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Subscription fees are billed in advance and are non-refundable</li>
              <li>Prices are subject to change with prior notice</li>
              <li>You can cancel your subscription at any time</li>
              <li>Access to premium features ends when subscription expires</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">8. Limitation of Liability</h2>
          <p className="text-ink/80 mb-4">
            In no event shall DoNotRisk, its officers, directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul className="list-disc list-inside space-y-2 text-ink/80 ml-4">
            <li>Your use or inability to use the Service</li>
            <li>Any unauthorized access to or use of our servers</li>
            <li>Any interruption or cessation of transmission to or from the Service</li>
            <li>Any errors or omissions in any content</li>
            <li>Warranty decisions made based on our analysis</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">9. Indemnification</h2>
          <p className="text-ink/80">
            You agree to indemnify, defend, and hold harmless DoNotRisk and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising out of or relating to your use of the Service or any violation of these Terms.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">10. Termination</h2>
          <p className="text-ink/80 mb-4">
            We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-ink/80 ml-4">
            <li>Breach of these Terms</li>
            <li>Violation of any law or regulation</li>
            <li>Non-payment of fees (if applicable)</li>
            <li>Inactivity for an extended period</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">11. Governing Law</h2>
          <p className="text-ink/80">
            These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which DoNotRisk operates, without regard to its conflict of law provisions.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">12. Changes to Terms</h2>
          <p className="text-ink/80">
            We reserve the right to modify these Terms at any time. We will provide notice of material changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Service after such changes constitutes acceptance of the new Terms.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">13. Contact Information</h2>
          <p className="text-ink/80">
            If you have any questions about these Terms, please contact us through our Contact page or email: terms@donotrisk.com
          </p>
        </div>
      </div>
    </section>
  );
}
