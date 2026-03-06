"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost, apiUpload } from "@/lib/api";

const defaultForm = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  productName: "",
  brand: "",
  modelNumber: "",
  serialNumber: "",
  purchaseDate: "",
  invoiceNumber: "",
  purchaseStore: "",
  productCategory: "Television",
  proofType: "agent_confirmation",
  purchaseProofUrl: ""
};

const categories = ["Television", "Refrigerator", "Mobile", "Router", "Laptop", "Washing Machine"];

export default function AgentRegisterProductPage() {
  const [form, setForm] = useState(defaultForm);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return setStatus("Agent login required.");
    try {
      let purchaseProofUrl = form.purchaseProofUrl;
      if (proofFile) {
        const uploaded = await apiUpload("/agents/upload-proof", proofFile, token);
        purchaseProofUrl = uploaded.url || "";
      }
      const result = await apiPost<{ message: string; id: string; registeredProductId: string }>(
        "/agents/register-product",
        {
          ...form,
          purchaseProofUrl
        },
        token
      );
      setStatus(`${result.message} Product ID: ${result.registeredProductId}. Redirecting to Add Warranty...`);
      setForm(defaultForm);
      setTimeout(() => router.push(`/agent/add-warranty?productId=${encodeURIComponent(result.registeredProductId)}`), 900);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to register product.");
    }
  }

  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-6">
      <h1 className="font-display text-3xl">Register Product for User</h1>
      <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={onSubmit}>
        {Object.entries(form).map(([key, value]) => {
          if (key === "purchaseProofUrl") return null;
          if (key === "productCategory") {
            return (
              <select
                key={key}
                className="rounded-lg border border-ink/20 p-2"
                value={value}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            );
          }
          if (key === "proofType") {
            return (
              <select
                key={key}
                className="rounded-lg border border-ink/20 p-2"
                value={value}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
              >
                <option value="image">Image</option>
                <option value="store_location">Store Location</option>
                <option value="agent_confirmation">Agent Confirmation</option>
              </select>
            );
          }
          return (
            <input
              key={key}
              className="rounded-lg border border-ink/20 p-2"
              placeholder={key}
              type={key === "purchaseDate" ? "date" : "text"}
              value={value}
              onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
            />
          );
        })}
        <input className="rounded-lg border border-ink/20 p-2 md:col-span-2" type="file" onChange={(e) => setProofFile(e.target.files?.[0] || null)} />
        <button className="rounded-lg bg-ink px-4 py-2 text-paper md:col-span-2">Register Product</button>
      </form>
      {status ? <p className="mt-3 text-sm">{status}</p> : null}
    </section>
  );
}
