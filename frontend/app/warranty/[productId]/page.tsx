"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiGet } from "@/lib/api";

type WarrantyData = {
  productId: string;
  totalWarranty: string;
  components: Array<{ component: string; duration: string }>;
  notes: string;
  expiryDate: string;
  certificateIssued: boolean;
};

export default function WarrantyDetailPage() {
  const params = useParams<{ productId: string }>();
  const productId = params?.productId || "";
  const [data, setData] = useState<WarrantyData | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!productId) return;
    const token = localStorage.getItem("token");
    if (!token) return setMessage("Login required.");
    apiGet<WarrantyData>(`/warranty/${productId}`, token)
      .then(setData)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Failed to fetch warranty."));
  }, [productId]);

  if (!data) {
    return (
      <section className="rounded-2xl border border-ink/10 bg-white p-6">
        <p className="text-sm">{message || "Loading..."}</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-6">
      <h1 className="font-display text-3xl">Warranty Details</h1>
      <p className="mt-2 text-sm">Total Warranty: {data.totalWarranty}</p>
      <p className="text-sm">Expiry: {data.expiryDate ? new Date(data.expiryDate).toLocaleDateString() : "-"}</p>
      <p className="text-sm">Digital Certificate: {data.certificateIssued ? "Issued" : "Pending"}</p>
      <div className="mt-4 space-y-2">
        {data.components.map((item, idx) => (
          <div key={`${item.component}-${idx}`} className="rounded-lg bg-ink/5 p-2 text-sm">
            {item.component}: {item.duration}
          </div>
        ))}
      </div>
      {data.notes ? <p className="mt-3 text-sm">{data.notes}</p> : null}
    </section>
  );
}
