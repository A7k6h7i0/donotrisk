import Link from "next/link";
import { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const description =
    product.description && product.description.trim().length > 0
      ? product.description
      : "Warranty description is being prepared for this product.";

  // Get display icon - prefer custom image, then icon, then initial
  const displayIcon = product.image 
    ? <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
    : (
        <div className="flex h-full w-full items-center justify-center text-3xl">
          {product.icon || product.initial || "📦"}
        </div>
      );

  return (
    <article className="rounded-2xl border border-ink/10 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex gap-4">
        {/* Product Icon/Image */}
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-ink/5">
          {displayIcon}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wide text-ink/55">{product.category_name || "Product"}</p>
          <h3 className="mt-1 font-display text-lg truncate">{product.name}</h3>
          <p className="mt-1 text-sm text-ink/75 truncate">
            {product.brand} | {product.model_number}
          </p>
        </div>
      </div>
      
      <p className="mt-3 line-clamp-2 text-sm text-ink/70">{description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="rounded-full bg-ink/10 px-3 py-1 text-xs">Risk {product.risk_score}</span>
        <Link href={`/products/${product.id}`} className="rounded-full bg-ink px-4 py-2 text-sm text-paper">
          View Warranty
        </Link>
      </div>
    </article>
  );
}
