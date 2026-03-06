"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiPost } from "@/lib/api";

type ComponentItem = { component: string; duration: string };

export default function AgentAddWarrantyPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [productId, setProductId] = useState(params.get("productId") || "");
  const [totalWarranty, setTotalWarranty] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [components, setComponents] = useState<ComponentItem[]>([{ component: "Screen", duration: "1 Year" }]);
  const [status, setStatus] = useState("");

  function updateComponent(index: number, key: keyof ComponentItem, value: string) {
    setComponents((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!productId || !totalWarranty || !expiryDate) {
      setStatus("Registered Product ID, Total Warranty, and Expiry Date are mandatory.");
      return;
    }
    if (components.some((x) => !x.component.trim() || !x.duration.trim())) {
      setStatus("All warranty component rows must be fully filled.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) return setStatus("Agent login required.");
    try {
      await apiPost("/warranty/add", { productId, totalWarranty, components, expiryDate, notes }, token);
      setStatus("Warranty completed. Redirecting to dashboard...");
      setTimeout(() => router.push("/agent/dashboard"), 900);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to add warranty.");
    }
  }

  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-6">
      <h1 className="font-display text-3xl">Add Component Warranty</h1>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input
          className="w-full rounded-lg border border-ink/20 p-2"
          placeholder="Registered Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <input
          className="w-full rounded-lg border border-ink/20 p-2"
          placeholder="Total Warranty (example: 1 + 2 Years)"
          value={totalWarranty}
          onChange={(e) => setTotalWarranty(e.target.value)}
        />
        <input className="w-full rounded-lg border border-ink/20 p-2" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
        <textarea className="w-full rounded-lg border border-ink/20 p-2" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />

        <div className="space-y-2 rounded-xl bg-ink/5 p-3">
          {components.map((item, index) => (
            <div key={index} className="grid gap-2 md:grid-cols-2">
              <input
                className="rounded-lg border border-ink/20 p-2"
                placeholder="Component"
                value={item.component}
                onChange={(e) => updateComponent(index, "component", e.target.value)}
              />
              <input
                className="rounded-lg border border-ink/20 p-2"
                placeholder="Duration"
                value={item.duration}
                onChange={(e) => updateComponent(index, "duration", e.target.value)}
              />
            </div>
          ))}
          <button type="button" className="rounded-lg border border-ink/30 px-3 py-1 text-sm" onClick={() => setComponents((prev) => [...prev, { component: "", duration: "" }])}>
            Add Component
          </button>
        </div>

        <button className="rounded-lg bg-ink px-4 py-2 text-paper">Save Warranty</button>
      </form>
      {status ? <p className="mt-3 text-sm">{status}</p> : null}
    </section>
  );
}
