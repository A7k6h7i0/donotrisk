"use client";

export type ExtractedWarranty = {
  brand?: string | null;
  product_name?: string | null;
  model_number?: string | null;
  serial_number?: string | null;
  production_date?: string | null;
  purchase_date?: string | null;
  warranty_duration?: string | null;
  quality?: string | null;
  scan_quality?: string | null;
  raw_text?: string | null;
  decoded_qr?: string[];
  decoded_barcodes?: string[];
};

type MatchedProduct = {
  id: string;
  name: string;
  brand: string;
  model_number: string;
  risk_score: number;
  risk_band: string;
} | null;

type Validation = {
  is_valid: boolean;
  warnings: string[];
} | null;

type WarrantyResultProps = {
  extracted: ExtractedWarranty;
  matchedProduct: MatchedProduct;
  validation?: Validation;
  onSave: () => void;
  saving?: boolean;
};

function show(value?: string | null) {
  return value && String(value).trim() ? value : "-";
}

export default function WarrantyResult({ extracted, matchedProduct, validation, onSave, saving = false }: WarrantyResultProps) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
      <h2 className="font-display text-xl">Extracted Warranty Data</h2>

      <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
        <p><strong>Brand:</strong> {show(extracted.brand)}</p>
        <p><strong>Product Name:</strong> {show(extracted.product_name)}</p>
        <p><strong>Model Number:</strong> {show(extracted.model_number)}</p>
        <p><strong>Serial Number:</strong> {show(extracted.serial_number)}</p>
        <p><strong>Production Date:</strong> {show(extracted.production_date)}</p>
        <p><strong>Purchase Date:</strong> {show(extracted.purchase_date)}</p>
        <p><strong>Warranty Duration:</strong> {show(extracted.warranty_duration)}</p>
        <p><strong>Quality:</strong> {show(extracted.quality)}</p>
        <p><strong>Scan Quality:</strong> {show(extracted.scan_quality)}</p>
      </div>

      {extracted.decoded_qr?.length ? (
        <div className="mt-4 rounded-lg bg-ink/5 p-3 text-sm">
          <p><strong>QR Codes:</strong> {extracted.decoded_qr.join(" | ")}</p>
        </div>
      ) : null}

      {extracted.decoded_barcodes?.length ? (
        <div className="mt-2 rounded-lg bg-ink/5 p-3 text-sm">
          <p><strong>Barcodes:</strong> {extracted.decoded_barcodes.join(" | ")}</p>
        </div>
      ) : null}

      {validation?.warnings?.length ? (
        <p className="mt-3 text-sm text-amber-700">Validation: {validation.warnings.join(", ")}</p>
      ) : null}

      {matchedProduct ? (
        <div className="mt-4 rounded-xl bg-ink/5 p-3 text-sm">
          Matched Product: {matchedProduct.name} ({matchedProduct.model_number}) | Risk {matchedProduct.risk_score} ({matchedProduct.risk_band})
        </div>
      ) : (
        <p className="mt-4 text-sm text-red-700">No product match found in database for this extraction.</p>
      )}

      <button
        className="mt-4 rounded-lg bg-moss px-4 py-2 text-white disabled:opacity-50"
        onClick={onSave}
        disabled={!matchedProduct || saving}
      >
        {saving ? "Saving..." : "Save to Dashboard"}
      </button>

      <div className="mt-4">
        <p className="mb-1 text-sm font-semibold">Raw OCR Text</p>
        <pre className="max-h-64 overflow-auto rounded-lg border border-ink/10 bg-paper p-3 text-xs whitespace-pre-wrap">
          {extracted.raw_text || "-"}
        </pre>
      </div>
    </div>
  );
}
