"use client";

import Link from "next/link";
import { Product } from "@/types";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const riskConfig = {
  low:    { bg: "from-emerald-500 to-teal-500",     badge: "bg-emerald-50 text-emerald-700 border-emerald-200",  dot: "bg-emerald-500" },
  medium: { bg: "from-amber-500 to-orange-400",     badge: "bg-amber-50 text-amber-700 border-amber-200",       dot: "bg-amber-500"   },
  high:   { bg: "from-red-500 to-rose-500",         badge: "bg-red-50 text-red-700 border-red-200",             dot: "bg-red-500"     },
};

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const description =
    product.description && product.description.trim().length > 0
      ? product.description
      : "Warranty description is being prepared for this product.";

  const displayIcon = product.image
    ? (
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          width={80}
          height={80}
        />
      )
    : (
        <div className="flex h-full w-full items-center justify-center text-3xl">
          {product.icon || product.initial || "📦"}
        </div>
      );

  const risk = product.risk_score <= 3 ? "low" : product.risk_score <= 6 ? "medium" : "high";
  const rc = riskConfig[risk];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100/80 shadow-card transition-all duration-500 hover:shadow-card-hover"
    >
      {/* Gradient top accent bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${rc.bg} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Gradient border effect on hover */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, transparent 60%)",
          boxShadow: "inset 0 0 0 1.5px rgba(124,58,237,0.15)",
        }}
      />

      <div className="relative p-6">
        <div className="flex gap-5">
          {/* Product Icon / Image */}
          <motion.div
            className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl overflow-hidden border border-gray-100 bg-gradient-to-br from-gray-50 to-surface-dark"
            whileHover={{ scale: 1.08, rotate: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {displayIcon}
          </motion.div>

          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary-600/70">
              {product.category_name || "Product"}
            </p>
            <h3 className="mt-1 font-display text-lg font-semibold text-ink truncate group-hover:text-primary-700 transition-colors duration-300">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-ink/50 truncate">
              {product.brand} · {product.model_number}
            </p>
          </div>
        </div>

        <p className="mt-4 line-clamp-2 text-sm text-ink/65 leading-relaxed">{description}</p>

        <div className="mt-5 flex items-center justify-between">
          {/* Risk score badge — gradient bg */}
          <motion.span
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${rc.badge}`}
            whileHover={{ scale: 1.04 }}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${rc.dot} animate-pulse`} />
            Risk: {product.risk_score}/10
          </motion.span>

          {/* View Details — animated arrow */}
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              href={`/products/${product.id}`}
              className="group/btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-glow-sm hover:shadow-glow-violet transition-all duration-300"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
            >
              View Details
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Decorative corner glow */}
      <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-gradient-to-tl from-primary-400/15 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl" />
    </motion.article>
  );
}


