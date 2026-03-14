import { apiGet } from "@/lib/api";
import { Product } from "@/types";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Loading from "./loading";

// Lazy load the HomePageSections for better performance
const HomePageSections = dynamic(
  () => import("@/components/HomePageSections").then((mod) => mod.HomePageSections),
  {
    loading: () => <Loading />,
    ssr: true, // Enable SSR for SEO
  }
);

export default async function HomePage() {
  let products: Product[] = [];
  try {
    products = await apiGet<Product[]>("/products");
  } catch {
    products = [];
  }

  return (
    <Suspense fallback={<Loading />}>
      <HomePageSections products={products} />
    </Suspense>
  );
}
