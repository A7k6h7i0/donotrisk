"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { apiPost, apiUpload } from "@/lib/api";
import UploadCard from "@/components/UploadCard";
import WarrantyResult, { ExtractedWarranty } from "@/components/WarrantyResult";

type ExtractedResult = {
  extracted: ExtractedWarranty;
  matched_product: {
    id: string;
    name: string;
    brand: string;
    model_number: string;
    risk_score: number;
    risk_band: string;
  } | null;
  validation?: {
    is_valid: boolean;
    warnings: string[];
  };
};

export default function ScannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<ExtractedResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sourceType, setSourceType] = useState<"upload" | "url">("upload");

  function clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
  }

  async function extractFromFile() {
    if (!file) return setMessage("Please select a warranty file first.");
    setResult(null);
    setSourceType("upload");
    const token = localStorage.getItem("token");
    if (!token) return setMessage("Please login to use scanner.");

    setLoading(true);
    setMessage("");
    try {
      const data = await apiUpload("/scans/extract", file, token);
      setResult(data);
      setMessage("Warranty extraction complete from upload.");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "";
      if (msg.includes("(401)")) {
        clearAuth();
        setMessage("Session expired. Login again to scan.");
      } else {
        setMessage(msg || "Extraction failed. Upload a clearer image/PDF.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function extractFromUrl() {
    const cleaned = url.trim();
    if (!cleaned) return setMessage("Please enter a valid image/PDF URL.");

    setResult(null);
    setSourceType("url");
    const token = localStorage.getItem("token");
    if (!token) return setMessage("Please login to use scanner.");

    setLoading(true);
    setMessage("");
    try {
      const data = await apiPost<ExtractedResult>("/scans/extract-url", { url: cleaned }, token);
      setResult(data);
      setMessage("Warranty extraction complete from URL.");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "";
      if (msg.includes("(401)")) {
        clearAuth();
        setMessage("Session expired. Login again to scan.");
      } else {
        setMessage(msg || "URL extraction failed. Use a direct public JPG/PNG/PDF link.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!result?.extracted) return;

    const token = localStorage.getItem("token");
    if (!token) return setMessage("Please login to save warranty.");

    setSaving(true);
    setMessage("");

    try {
      const purchaseDate = result.extracted.purchase_date || new Date().toISOString().slice(0, 10);
      const months = Number((result.extracted.warranty_duration || "12").match(/\d+/)?.[0] || 12);
      const expiry = new Date(purchaseDate);
      expiry.setMonth(expiry.getMonth() + months);

      await apiPost(
        "/scans/save",
        {
          product_id: result.matched_product?.id || null,
          serial_number: result.extracted.serial_number || "",
          purchase_date: purchaseDate,
          expiry_date: expiry.toISOString().slice(0, 10),
          raw_extracted_text: result.extracted.raw_text || "",
          source_type: sourceType,
          extracted_data: result.extracted
        },
        token
      );

      setMessage("Warranty saved to dashboard.");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "";
      if (msg.includes("(401)")) {
        clearAuth();
        setMessage("Unauthorized. Login again.");
      } else {
        setMessage(msg || "Failed to save warranty.");
      }
    } finally {
      setSaving(false);
    }
  }

  const showLoginLink = useMemo(
    () => message.toLowerCase().includes("login") || message.toLowerCase().includes("unauthorized"),
    [message]
  );

  return (
    <section className="space-y-5">
      <h1 className="font-display text-3xl">Warranty Scanner</h1>

      <UploadCard
        title="Upload Warranty Card / Invoice"
        description="Supports JPG, PNG, and PDF. QR and barcode decoding is handled automatically during extraction."
      >
        <input
          type="file"
          className="w-full"
          accept=".png,.jpg,.jpeg,.pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          className="mt-4 rounded-lg bg-ink px-4 py-2 text-paper disabled:opacity-50"
          onClick={extractFromFile}
          disabled={loading}
        >
          {loading ? "Extracting..." : "Extract Warranty"}
        </button>
      </UploadCard>

      <UploadCard
        title="Scan From Image/PDF URL"
        description="Paste a direct public URL to warranty card image or invoice PDF."
      >
        <input
          className="w-full rounded-lg border border-ink/20 p-2"
          placeholder="https://example.com/warranty-card.jpg"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          className="mt-3 rounded-lg bg-ink px-4 py-2 text-paper disabled:opacity-50"
          onClick={extractFromUrl}
          disabled={loading}
        >
          {loading ? "Extracting..." : "Extract From URL"}
        </button>
      </UploadCard>

      {result ? (
        <WarrantyResult
          extracted={result.extracted}
          matchedProduct={result.matched_product}
          validation={result.validation || null}
          onSave={save}
          saving={saving}
        />
      ) : null}

      {message ? (
        <p className="text-sm">
          {message} {showLoginLink ? <Link href="/login" className="underline">Go to Login</Link> : null}
        </p>
      ) : null}
    </section>
  );
}
