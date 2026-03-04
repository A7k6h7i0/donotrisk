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
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {categories.map((c) => (
          <Link
            href={`/categories/${c.id}`}
            key={c.id}
            className="rounded-2xl border border-ink/10 bg-white p-4 transition hover:-translate-y-0.5"
          >
            <p className="font-semibold">{c.name}</p>
            <p className="text-sm text-ink/60">{c.parent_name ? `Subcategory of ${c.parent_name}` : "Primary category"}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
