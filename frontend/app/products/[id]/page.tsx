import { apiGet } from "@/lib/api";
import { RiskMeter } from "@/components/RiskMeter";

type ProductDetails = {
  id: number;
  name: string;
  brand: string;
  model_number: string;
  category_name: string;
  description: string;
  release_date: string;
  risk_score: number;
  risk_band: string;
  warranty_details: {
    duration_months: number;
    coverage_type: string;
    start_conditions: string;
    registration_requirements: string;
    claim_process: string;
    validity_conditions: string;
    void_conditions: string;
  } | null;
  pros_cons: {
    pros: string;
    cons: string;
  } | null;
};

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await apiGet<ProductDetails>(`/products/${id}`);
  const description =
    product.description && product.description.trim().length > 0
      ? product.description
      : "Warranty description will be updated soon for this product.";

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-ink/10 bg-white p-6">
        <p className="text-sm text-ink/60">{product.category_name}</p>
        <h1 className="font-display text-3xl">{product.name}</h1>
        <p className="text-sm text-ink/70">
          {product.brand} | {product.model_number}
        </p>
        <p className="mt-3 text-ink/80">{description}</p>
      </div>

      <RiskMeter score={product.risk_score} band={product.risk_band} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-ink/10 bg-white p-5">
          <h2 className="font-display text-xl">Warranty Details</h2>
          <p className="mt-2 text-sm">
            <strong>Duration:</strong> {product.warranty_details?.duration_months || 0} months
          </p>
          <p className="text-sm">
            <strong>Coverage:</strong> {product.warranty_details?.coverage_type || "-"}
          </p>
          <p className="mt-2 text-sm">
            <strong>Start:</strong> {product.warranty_details?.start_conditions || "-"}
          </p>
          <p className="mt-2 text-sm">
            <strong>Registration:</strong> {product.warranty_details?.registration_requirements || "-"}
          </p>
          <p className="mt-2 text-sm">
            <strong>Claim Process:</strong> {product.warranty_details?.claim_process || "-"}
          </p>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-white p-5">
          <h2 className="font-display text-xl">Validity and Void Conditions</h2>
          <p className="mt-2 text-sm">
            <strong>Valid if:</strong> {product.warranty_details?.validity_conditions || "-"}
          </p>
          <p className="mt-2 text-sm">
            <strong>Void if:</strong> {product.warranty_details?.void_conditions || "-"}
          </p>
          <h3 className="mt-4 font-semibold">Pros</h3>
          <p className="text-sm">{product.pros_cons?.pros || "-"}</p>
          <h3 className="mt-3 font-semibold">Cons</h3>
          <p className="text-sm">{product.pros_cons?.cons || "-"}</p>
        </div>
      </div>
    </section>
  );
}
