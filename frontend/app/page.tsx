import { apiGet } from "@/lib/api";
import { Product } from "@/types";
import { HomePageSections } from "@/components/HomePageSections";

export default async function HomePage() {
  let products: Product[] = [];
  try {
    products = await apiGet<Product[]>("/products");
  } catch {
    products = [];
  }

  return <HomePageSections products={products} />;
}
