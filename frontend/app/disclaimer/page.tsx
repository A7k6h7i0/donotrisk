export const metadata = {
  title: "Disclaimer - DoNotRisk",
  description: "DoNotRisk Disclaimer - Important information about our service"
};

export default function DisclaimerPage() {
  return (
    <section className="max-w-4xl mx-auto">
      <h1 className="font-display text-3xl mb-6">Disclaimer</h1>
      <p className="text-sm text-ink/60 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="prose prose-ink max-w-none space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">1. General Information Only</h2>
          <p className="text-ink/80">
            DoNotRisk provides general information and AI-powered analysis about warranties for informational purposes only. The information provided on this platform does not constitute legal, financial, or professional advice of any kind.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">2. AI Analysis Accuracy</h2>
          <div className="space-y-4 text-ink/80">
            <p>Our AI-powered warranty analysis:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Is based on machine learning algorithms and may contain errors</li>
              <li>Should NOT be the sole basis for any warranty-related decisions</li>
              <li>May not capture all nuances in warranty documents</li>
              <li>Cannot replace professional legal or financial advice</li>
              <li>Is dependent on the quality of uploaded documents</li>
              <li>May misinterpret non-standard warranty language</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">3. Warranty Verification</h2>
          <p className="text-ink/80 mb-4">
            <strong>Always verify warranty information with official sources:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 text-ink/80 ml-4">
            <li>Official manufacturer warranty documents</li>
            <li>Manufacturer's website or customer support</li>
            <li>Authorized dealer or retailer</li>
            <li>Written warranty cards or certificates</li>
            <li>Original purchase invoices and receipts</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">4. No Guarantees</h2>
          <div className="space-y-4 text-ink/80">
            <p>DoNotRisk does not guarantee:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>The accuracy, completeness, or timeliness of any analysis</li>
              <li>That a product is actually covered under warranty</li>
              <li>The success of any warranty claim</li>
              <li>That all warranty terms will be identified</li>
              <li>Uninterrupted or error-free service</li>
              <li>The availability of the service at all times</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">5. Risk Assessment Limitations</h2>
          <p className="text-ink/80 mb-4">
            Our risk scoring system is based on general patterns and historical data:
          </p>
          <ul className="list-disc list-inside space-y-2 text-ink/80 ml-4">
            <li>Risk levels are estimates and not guarantees</li>
            <li>Individual product experiences may vary significantly</li>
            <li>Risk factors change over time</li>
            <li>Historical failure rates may not predict future performance</li>
            <li>Risk assessment is not a substitute for professional evaluation</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">6. Third-Party Information</h2>
          <p className="text-ink/80">
            Our platform may contain links to third-party websites or reference information from external sources. We do not endorse, guarantee, or assume responsibility for the accuracy or reliability of any information provided by third parties. Your interactions with third-party sites are governed by their own terms and policies.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">7. Financial Responsibility</h2>
          <p className="text-ink/80 mb-4">
            <strong>You are solely responsible for:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 text-ink/80 ml-4">
            <li>Any financial decisions made based on our analysis</li>
            <li>Verifying warranty information before making purchases</li>
            <li>Understanding the terms of your warranty coverage</li>
            <li>Filing warranty claims according to manufacturer procedures</li>
            <li>Any costs incurred from relying on our information</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">8. Service Availability</h2>
          <p className="text-ink/80">
            While we strive to maintain uninterrupted service, DoNotRisk is provided "as is" and "as available" without warranties of any kind, whether express or implied. We do not guarantee that the service will meet your requirements or be available at all times.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">9. Limitation of Liability</h2>
          <p className="text-ink/80 mb-4">
            To the maximum extent permitted by law, DoNotRisk shall not be liable for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-ink/80 ml-4">
            <li>Any indirect, incidental, or consequential damages</li>
            <li>Loss of profits, data, or business opportunities</li>
            <li>Decisions made based on our analysis or information</li>
            <li>Any inaccuracies in warranty documentation analysis</li>
            <li>Service interruptions or technical problems</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">10. User Responsibility</h2>
          <p className="text-ink/80 mb-4">
            <strong>By using DoNotRisk, you acknowledge that:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 text-ink/80 ml-4">
            <li>You have read and understood this disclaimer</li>
            <li>You use the service at your own risk</li>
            <li>You will verify all warranty information with official sources</li>
            <li>You will not rely solely on our analysis for important decisions</li>
            <li>You accept the limitations of AI-powered analysis</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">11. Updates to Disclaimer</h2>
          <p className="text-ink/80">
            This disclaimer may be updated at any time without prior notice. The updated version will be posted on this page with a new "Last updated" date. Your continued use of DoNotRisk constitutes acceptance of this disclaimer.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-ink/10">
          <h2 className="font-display text-xl mb-4">12. Contact</h2>
          <p className="text-ink/80">
            If you have questions about this disclaimer, please contact us through our Contact page.
          </p>
        </div>

        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
          <h2 className="font-display text-xl mb-4 text-amber-800">⚠️ Important Notice</h2>
          <p className="text-amber-900">
            This platform is intended as a helpful tool only. Always consult official warranty documentation and professional advisors before making any warranty-related decisions. DoNotRisk is not responsible for any disputes arising from warranty claims or coverage determinations.
          </p>
        </div>
      </div>
    </section>
  );
}
