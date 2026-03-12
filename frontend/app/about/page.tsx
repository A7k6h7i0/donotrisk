import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-ink p-8 text-paper md:p-12">
        <h1 className="font-display text-4xl">About DoNotRisk</h1>
        <p className="mt-4 max-w-2xl text-paper/80">
          Empowering consumers with intelligent warranty management and risk analysis
        </p>
      </section>

      <section className="rounded-3xl bg-white p-8 md:p-12">
        <h2 className="font-display text-2xl text-ink">Our Mission</h2>
        <p className="mt-4 text-ink/80">
          At DoNotRisk, we believe that every consumer deserves to understand what their warranty covers before making a purchase. Our mission is to demystify warranty terms, expose hidden exclusions, and help people make informed decisions about their purchases.
        </p>
        <p className="mt-4 text-ink/80">
          We leverage cutting-edge AI technology to analyze warranty documents, detect potential risks, and provide clear, actionable insights. Whether you're buying electronics, appliances, vehicles, or any other product with a warranty, DoNotRisk helps you understand exactly what you're getting.
        </p>
      </section>

      <section className="rounded-3xl bg-white p-8 md:p-12">
        <h2 className="font-display text-2xl text-ink">What We Do</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-ink/10 p-6">
            <div className="text-4xl">🔍</div>
            <h3 className="mt-4 font-display text-lg text-ink">Warranty Scanning</h3>
            <p className="mt-2 text-sm text-ink/70">
              Simply upload or photograph your warranty card, and our AI will extract and analyze all the important information.
            </p>
          </div>
          <div className="rounded-2xl border border-ink/10 p-6">
            <div className="text-4xl">📊</div>
            <h3 className="mt-4 font-display text-lg text-ink">Risk Analysis</h3>
            <p className="mt-2 text-sm text-ink/70">
              Our system evaluates warranty terms against thousands of known exclusion patterns to identify potential risks.
            </p>
          </div>
          <div className="rounded-2xl border border-ink/10 p-6">
            <div className="text-4xl">🔔</div>
            <h3 className="mt-4 font-display text-lg text-ink">Expiry Tracking</h3>
            <p className="mt-2 text-sm text-ink/70">
              Never lose track of when your warranties expire. We send timely reminders so you never miss a claim window.
            </p>
          </div>
          <div className="rounded-2xl border border-ink/10 p-6">
            <div className="text-4xl">💡</div>
            <h3 className="mt-4 font-display text-lg text-ink">Smart Insights</h3>
            <p className="mt-2 text-sm text-ink/70">
              Get personalized insights about your warranties, including coverage optimization tips and claim strategies.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-8 md:p-12">
        <h2 className="font-display text-2xl text-ink">Why Choose DoNotRisk?</h2>
        <ul className="mt-6 space-y-4">
          <li className="flex items-start text-ink/80">
            <span className="mr-3 text-xl text-ink">✓</span>
            <div>
              <strong className="text-ink">AI-Powered Analysis:</strong> Our advanced AI processes warranty documents in seconds, extracting key terms and identifying exclusions that most people would miss.
            </div>
          </li>
          <li className="flex items-start text-ink/80">
            <span className="mr-3 text-xl text-ink">✓</span>
            <div>
              <strong className="text-ink">Comprehensive Coverage:</strong> We support warranties for electronics, vehicles, home appliances, and more.
            </div>
          </li>
          <li className="flex items-start text-ink/80">
            <span className="mr-3 text-xl text-ink">✓</span>
            <div>
              <strong className="text-ink">Risk Scores:</strong> Our unique risk scoring system helps you understand the true value of a warranty before you buy.
            </div>
          </li>
          <li className="flex items-start text-ink/80">
            <span className="mr-3 text-xl text-ink">✓</span>
            <div>
              <strong className="text-ink">Claim Support:</strong> Get guidance on how to file claims and what documentation you need.
            </div>
          </li>
        </ul>
      </section>

      <section className="rounded-3xl bg-ink p-8 text-center text-paper md:p-12">
        <h2 className="font-display text-2xl">Ready to Get Started?</h2>
        <p className="mt-4 text-paper/80">Start scanning your warranties today and take control of your purchases.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/scanner" className="rounded-full bg-paper px-6 py-2 text-ink">
            Scan Now
          </Link>
          <Link href="/features" className="rounded-full border border-paper/30 px-6 py-2 text-paper">
            Learn More
          </Link>
        </div>
      </section>
    </div>
  );
}
