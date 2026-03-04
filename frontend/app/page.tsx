import { apiGet } from "@/lib/api";
import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { HeroMotion } from "@/components/HeroMotion";
import { HomeActions } from "@/components/HomeActions";

export default async function HomePage() {
  let products: Product[] = [];
  try {
    products = await apiGet<Product[]>("/products");
  } catch {
    products = [];
  }

  return (
    <section className="space-y-8">
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
