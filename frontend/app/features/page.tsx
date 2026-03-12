import Link from "next/link";

export default function FeaturesPage() {
  const features = [
    {
      title: "AI Warranty Scanner",
      description: "Our advanced AI technology can read and analyze warranty documents in seconds. Simply upload an image or take a photo of your warranty card, and our system will extract all the important information.",
      icon: "📷",
      benefits: [
        "Supports multiple image formats",
        "Fast processing time",
        "High accuracy rate",
        "Extracts key terms automatically"
      ]
    },
    {
      title: "Risk Score System",
      description: "Our unique risk scoring system evaluates warranties based on multiple factors including coverage length, exclusion patterns, and historical claim data to help you understand the true value of a warranty.",
      icon: "📊",
      benefits: [
        "Objective risk assessment",
        "Comparative scoring",
        "Visual risk indicators",
        "Customizable thresholds"
      ]
    },
    {
      title: "Warranty Expiry Alerts",
      description: "Never miss a warranty expiration again. Our smart tracking system monitors all your warranties and sends timely reminders before they expire, giving you time to file claims if needed.",
      icon: "🔔",
      benefits: [
        "Customizable reminders",
        "Multiple notification channels",
        "Calendar integration",
        "Family account sharing"
      ]
    },
    {
      title: "Product Category Insights",
      description: "Get detailed insights about warranties across different product categories. Compare warranty terms, understand common exclusions, and make better purchasing decisions.",
      icon: "📈",
      benefits: [
        "Category-specific analysis",
        "Market comparisons",
        "Trend identification",
        "Expert recommendations"
      ]
    },
    {
      title: "Claim Support",
      description: "Our AI assistant guides you through the claims process, helping you understand what documentation you need and how to maximize your chances of a successful claim.",
      icon: "💼",
      benefits: [
        "Step-by-step guidance",
        "Document checklist",
        "Timeline tracking",
        "Appeal strategies"
      ]
    },
    {
      title: "Warranty Database",
      description: "Access our comprehensive database of warranty terms, common exclusions, and coverage patterns for thousands of products across multiple categories.",
      icon: "🗄️",
      benefits: [
        "Extensive product coverage",
        "Historical data",
        "Manufacturer information",
        "Update notifications"
      ]
    }
  ];

  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-ink p-8 text-paper md:p-12">
        <h1 className="font-display text-4xl">Platform Features</h1>
        <p className="mt-4 max-w-2xl text-paper/80">
          Powerful tools designed to help you understand, track, and maximize your warranties
        </p>
      </section>

      <section className="rounded-3xl bg-white p-8 md:p-12">
        <h2 className="font-display text-2xl text-ink">Core Features</h2>
        <div className="mt-8 space-y-8">
          {features.map((feature, index) => (
            <div key={index} className={`flex flex-col gap-6 md:flex-row ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-ink/5 text-5xl">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-display text-xl text-ink">{feature.title}</h3>
                <p className="mt-2 text-ink/70">{feature.description}</p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {feature.benefits.map((benefit, bIndex) => (
                    <li key={bIndex} className="flex items-center text-sm text-ink/80">
                      <span className="mr-2 text-green-600">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-8 md:p-12">
        <h2 className="font-display text-2xl text-ink text-center">Coming Soon</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-ink/10 p-6 text-center opacity-75">
            <div className="text-4xl">🎯</div>
            <h3 className="mt-3 font-display text-lg text-ink">Warranty Marketplace</h3>
            <p className="mt-2 text-sm text-ink/70">Buy and sell warranties</p>
          </div>
          <div className="rounded-2xl border border-ink/10 p-6 text-center opacity-75">
            <div className="text-4xl">🤝</div>
            <h3 className="mt-3 font-display text-lg text-ink">Extended Warranties</h3>
            <p className="mt-2 text-sm text-ink/70">Compare extended warranty options</p>
          </div>
          <div className="rounded-2xl border border-ink/10 p-6 text-center opacity-75">
            <div className="text-4xl">📱</div>
            <h3 className="mt-3 font-display text-lg text-ink">Mobile App</h3>
            <p className="mt-2 text-sm text-ink/70">iOS and Android applications</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-ink p-8 text-center text-paper md:p-12">
        <h2 className="font-display text-2xl">Ready to Explore?</h2>
        <p className="mt-4 text-paper/80">Start using our features today and take control of your warranties.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/scanner" className="rounded-full bg-paper px-6 py-2 text-ink">
            Try Scanner
          </Link>
          <Link href="/categories" className="rounded-full border border-paper/30 px-6 py-2 text-paper">
            Browse Categories
          </Link>
        </div>
      </section>
    </div>
  );
}
