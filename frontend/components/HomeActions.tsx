"use client";

import { useRouter } from "next/navigation";

export function HomeActions() {
  const router = useRouter();

  return (
    <div className="mt-6 flex gap-3">
      <button
        className="rounded-full bg-paper px-5 py-2 text-ink"
        onClick={() => router.push("/scanner")}
      >
        Scan Warranty
      </button>
      <button
        className="rounded-full border border-paper/30 px-5 py-2 text-paper"
        onClick={() => router.push("/categories")}
      >
        Browse Categories
      </button>
    </div>
  );
}
