"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function HomeActions() {
  const router = useRouter();

  return (
    <div className="mt-8 flex flex-wrap gap-4">
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => router.push("/scanner")}
        className="group relative inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-semibold text-ink shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </span>
        Scan Warranty
        <motion.span
          className="opacity-0 -translate-x-2"
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ delay: 0.3 }}
        >
          →
        </motion.span>
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => router.push("/categories")}
        className="group relative inline-flex items-center gap-3 rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
      >
        Browse Categories
        <motion.span
          className="opacity-0 -translate-x-2"
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ delay: 0.3 }}
        >
          →
        </motion.span>
      </motion.button>
    </div>
  );
}
