import { apiGet } from "@/lib/api";
import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";

export default async function CategoryProductsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let products: Product[] = [];
  try {
    products = await apiGet<Product[]>(`/categories/${id}/products`);
  } catch {
    products = [];
  }
  return (
    <section>
      <h1 className="font-display text-3xl">Products</h1>
      <p className="mt-1 text-ink/65">Category ID: {id}</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {!products.length ? (
        <p className="mt-4 text-sm text-ink/65">
          No products found in this category yet.
        </p>
      ) : null}
    </section>
  );
}
