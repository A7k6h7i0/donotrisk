import Link from "next/link";

export default function ServicesPage() {
  const services = [
    {
      icon: "🔍",
      title: "Warranty Analysis",
      description: "Our AI-powered system analyzes your warranty documents to extract key terms, coverage details, and potential exclusions.",
      features: [
        "Automated text extraction",
        "Coverage identification",
        "Exclusion detection",
        "Term comparison"
      ]
    },
    {
      icon: "📊",
      title: "Risk Assessment",
      description: "Get comprehensive risk scores based on warranty terms, historical claim data, and industry standards.",
      features: [
        "Risk score calculation",
        "Comparative analysis",
        "Trend identification",
        "Recommendation engine"
      ]
    },
    {
      icon: "📅",
      title: "Warranty Tracking",
      description: "Stay on top of all your warranties with smart tracking, automated reminders, and expiry notifications.",
      features: [
        "Expiry date tracking",
        "Automated reminders",
        "Calendar integration",
        "Multi-device sync"
      ]
    },
    {
      icon: "💡",
      title: "Claim Insights",
      description: "Get expert guidance on filing claims, including required documentation, timelines, and best practices.",
      features: [
        "Claim process guidance",
        "Documentation checklist",
        "Success rate analysis",
        "Appeal strategies"
      ]
    }
  ];

  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-ink p-8 text-paper md:p-12">
        <h1 className="font-display text-4xl">Our Services</h1>
        <p className="mt-4 max-w-2xl text-paper/80">
          Comprehensive warranty management solutions powered by advanced AI technology
        </p>
      </section>

      <section>
        <div className="grid gap-8 md:grid-cols-2">
          {services.map((service, index) => (
            <div key={index} className="rounded-3xl bg-white p-8 border border-ink/10">
              <div className="text-5xl">{service.icon}</div>
              <h2 className="mt-4 font-display text-2xl text-ink">{service.title}</h2>
              <p className="mt-3 text-ink/70">{service.description}</p>
              <ul className="mt-6 space-y-2">
                {service.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center text-ink/80">
                    <span className="mr-2 text-ink">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-8 md:p-12">
        <h2 className="font-display text-2xl text-ink text-center">Additional Capabilities</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-ink/5 p-6 text-center">
            <div className="text-4xl">📱</div>
            <h3 className="mt-3 font-display text-lg text-ink">Mobile App</h3>
            <p className="mt-2 text-sm text-ink/70">Access your warranties anywhere with our mobile application</p>
          </div>
          <div className="rounded-2xl bg-ink/5 p-6 text-center">
            <div className="text-4xl">🔗</div>
            <h3 className="mt-3 font-display text-lg text-ink">API Access</h3>
            <p className="mt-2 text-sm text-ink/70">Integrate our warranty analysis into your own applications</p>
          </div>
          <div className="rounded-2xl bg-ink/5 p-6 text-center">
            <div className="text-4xl">👥</div>
            <h3 className="mt-3 font-display text-lg text-ink">Team Plans</h3>
            <p className="mt-2 text-sm text-ink/70">Collaborative warranty management for businesses</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-ink p-8 text-center text-paper md:p-12">
        <h2 className="font-display text-2xl">Get Started Today</h2>
        <p className="mt-4 text-paper/80">Experience the power of intelligent warranty management.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/scanner" className="rounded-full bg-paper px-6 py-2 text-ink">
            Try Free Scanner
          </Link>
          <Link href="/contact" className="rounded-full border border-paper/30 px-6 py-2 text-paper">
            Contact Sales
          </Link>
        </div>
      </section>
    </div>
  );
}
