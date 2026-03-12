import Link from "next/link";
import { apiGet } from "@/lib/api";
import { Category } from "@/types";

export default async function CategoriesPage() {
  let categories: Category[] = [];
  try {
    categories = await apiGet<Category[]>("/categories");
  } catch {
    categories = [];
  }

  return (
    <section>
      <h1 className="font-display text-3xl">Product Categories</h1>
      <p className="mt-2 text-ink/70">Browse products by category</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link
            href={`/categories/${c.id}`}
            key={c.id}
            className="rounded-2xl border border-ink/10 bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-ink/5 text-3xl">
                {c.icon || "📦"}
              </div>
              <div>
                <p className="font-semibold text-lg">{c.name}</p>
                <p className="text-sm text-ink/60">{c.parent_name ? `Subcategory of ${c.parent_name}` : "Primary category"}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
