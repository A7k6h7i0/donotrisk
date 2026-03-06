"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

type AdminProduct = {
  id: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  brand: string;
  modelNumber: string;
  category: string;
  purchaseDate: string;
  invoiceNumber: string;
  agentName: string;
  agentId: string;
  linkedUserEmail: string;
};

export default function AdminProductsPage() {
  const [rows, setRows] = useState<AdminProduct[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setMessage("Admin login required.");
    apiGet<AdminProduct[]>("/admin/registered-products", token)
      .then(setRows)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Failed to load products."));
  }, []);

  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-6">
      <h1 className="font-display text-3xl">Manage Registered Products</h1>
      {message ? <p className="mt-2 text-sm">{message}</p> : null}
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10">
              <th className="px-2 py-2">Product</th>
              <th className="px-2 py-2">Customer</th>
              <th className="px-2 py-2">Agent</th>
              <th className="px-2 py-2">Purchase</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-ink/5">
                <td className="px-2 py-2">
                  {row.productName} ({row.brand})
                  <p className="text-xs text-ink/70">
                    {row.modelNumber} | {row.category}
                  </p>
                </td>
                <td className="px-2 py-2">
                  {row.customerName}
                  <p className="text-xs text-ink/70">{row.customerEmail}</p>
                </td>
                <td className="px-2 py-2">
                  {row.agentName}
                  <p className="text-xs text-ink/70">{row.agentId}</p>
                </td>
                <td className="px-2 py-2">
                  {row.purchaseDate ? new Date(row.purchaseDate).toLocaleDateString() : "-"}
                  <p className="text-xs text-ink/70">Invoice: {row.invoiceNumber || "-"}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
