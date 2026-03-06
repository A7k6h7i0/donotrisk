"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

type CustomerRow = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  totalProducts: number;
  lastPurchaseDate: string;
  categories: string[];
};

export default function AgentCustomersPage() {
  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setMessage("Agent login required.");
    apiGet<CustomerRow[]>("/agents/customers", token)
      .then(setRows)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Failed to fetch customers."));
  }, []);

  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-6">
      <h1 className="font-display text-3xl">Customers</h1>
      {message ? <p className="mt-3 text-sm">{message}</p> : null}
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10">
              <th className="px-2 py-2">Name</th>
              <th className="px-2 py-2">Phone</th>
              <th className="px-2 py-2">Email</th>
              <th className="px-2 py-2">Products</th>
              <th className="px-2 py-2">Categories</th>
              <th className="px-2 py-2">Last Purchase</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.customerEmail}-${row.customerPhone}`} className="border-b border-ink/5">
                <td className="px-2 py-2">{row.customerName}</td>
                <td className="px-2 py-2">{row.customerPhone}</td>
                <td className="px-2 py-2">{row.customerEmail}</td>
                <td className="px-2 py-2">{row.totalProducts}</td>
                <td className="px-2 py-2">{row.categories.join(", ")}</td>
                <td className="px-2 py-2">{row.lastPurchaseDate ? new Date(row.lastPurchaseDate).toLocaleDateString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!rows.length && !message ? <p className="mt-3 text-sm text-ink/70">No customer records found.</p> : null}
    </section>
  );
}
