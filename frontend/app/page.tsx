import { apiGet } from "@/lib/api";
import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { HeroMotion } from "@/components/HeroMotion";
import { HomeActions } from "@/components/HomeActions";
import { CapabilitySlider } from "@/components/CapabilitySlider";

export default async function HomePage() {
  let products: Product[] = [];
  try {
    products = await apiGet<Product[]>("/products");
  } catch {
    products = [];
  }

  return (
    <section className="space-y-16">
      <HeroMotion>
        <div className="rounded-3xl bg-ink p-8 text-paper">
          <p className="text-sm uppercase tracking-wider text-paper/70">Warranty Intelligence Platform</p>
          <h1 className="mt-2 max-w-2xl font-display text-4xl">Understand Warranty Risk Before It Costs You</h1>
          <p className="mt-3 max-w-2xl text-paper/80">
            Scan warranty cards, decode terms, evaluate exclusions, and track expiry timelines for products across electronics, vehicles, home appliances, and more.
          </p>
        <HomeActions />
        </div>
      </HeroMotion>

      {/* What is DoNotRisk Section */}
      <section className="rounded-3xl bg-white p-8 md:p-12">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="flex justify-center">
            <div className="flex h-48 w-48 items-center justify-center rounded-full bg-ink/5 text-6xl">
              🛡️
            </div>
          </div>
          <div>
            <h2 className="font-display text-3xl text-ink">What is DoNotRisk</h2>
            <p className="mt-4 text-ink/80">
              DoNotRisk is an intelligent warranty management platform that helps you understand, track, and maximize your product warranties. We use advanced AI to scan warranty documents, identify hidden exclusions, and provide risk scores to help you make informed purchasing decisions.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center text-ink/80">
                <span className="mr-3 text-xl">✓</span>
                Warranty risk detection
              </li>
              <li className="flex items-center text-ink/80">
                <span className="mr-3 text-xl">✓</span>
                AI warranty analysis
              </li>
              <li className="flex items-center text-ink/80">
                <span className="mr-3 text-xl">✓</span>
                Warranty expiry tracking
              </li>
              <li className="flex items-center text-ink/80">
                <span className="mr-3 text-xl">✓</span>
                Claim support insights
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section>
        <h2 className="font-display text-3xl text-center text-ink">How It Works</h2>
        <p className="mt-2 text-center text-ink/70">Four simple steps to warranty clarity</p>
        <div className="mt-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper mx-auto">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="mt-4 font-display text-lg text-ink">Scan Warranty</h3>
            <p className="mt-2 text-sm text-ink/70">Upload or photograph your warranty card using our scanner</p>
          </div>
          <div className="rounded-2xl bg-white p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper mx-auto">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="mt-4 font-display text-lg text-ink">AI Reads Terms</h3>
            <p className="mt-2 text-sm text-ink/70">Our AI analyzes the warranty terms and conditions</p>
          </div>
          <div className="rounded-2xl bg-white p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper mx-auto">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="mt-4 font-display text-lg text-ink">Exclusions Detected</h3>
            <p className="mt-2 text-sm text-ink/70">Hidden exclusions and risks are identified</p>
          </div>
          <div className="rounded-2xl bg-white p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper mx-auto">
              <span className="text-xl font-bold">4</span>
            </div>
            <h3 className="mt-4 font-display text-lg text-ink">Expiry Tracking</h3>
            <p className="mt-2 text-sm text-ink/70">Get reminders before your warranty expires</p>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section>
        <h2 className="font-display text-3xl text-center text-ink">Platform Features</h2>
        <p className="mt-2 text-center text-ink/70">Powerful tools to manage your warranties</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 border border-ink/10">
            <div className="text-4xl">📷</div>
            <h3 className="mt-4 font-display text-lg text-ink">AI Warranty Scanner</h3>
            <p className="mt-2 text-sm text-ink/70">Scan and analyze warranty documents in seconds with our advanced AI technology</p>
          </div>
          <div className="rounded-2xl bg-white p-6 border border-ink/10">
            <div className="text-4xl">📊</div>
            <h3 className="mt-4 font-display text-lg text-ink">Risk Score System</h3>
            <p className="mt-2 text-sm text-ink/70">Get comprehensive risk scores based on warranty terms, exclusions, and coverage</p>
          </div>
          <div className="rounded-2xl bg-white p-6 border border-ink/10">
            <div className="text-4xl">🔔</div>
            <h3 className="mt-4 font-display text-lg text-ink">Warranty Expiry Alerts</h3>
            <p className="mt-2 text-sm text-ink/70">Never miss a warranty expiration with smart tracking and timely reminders</p>
          </div>
          <div className="rounded-2xl bg-white p-6 border border-ink/10">
            <div className="text-4xl">📈</div>
            <h3 className="mt-4 font-display text-lg text-ink">Product Category Insights</h3>
            <p className="mt-2 text-sm text-ink/70">Access insights and analytics across different product categories</p>
          </div>
        </div>
      </section>

      {/* Capability Slider Section */}
      <section>
        <CapabilitySlider />
      </section>

      {/* Featured Products */}
      <div>
        <h2 className="font-display text-2xl">Featured Products</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {products.slice(0, 6).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
