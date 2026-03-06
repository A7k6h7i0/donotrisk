"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

export default function AdminPage() {
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    model_number: "",
    category_id: "",
    description: "",
    release_date: "",
    servicing_frequency_per_year: "2",
    warranty_complexity: "5",
    failure_rate: "10",
    claim_success_probability: "80"
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setIsAdmin(!!token && role === "admin");
    apiGet<Array<{ id: string; name: string }>>("/categories").then(setCategories).catch(() => setCategories([]));
  }, []);

  async function addCategory() {
    const token = localStorage.getItem("token");
    if (!token || localStorage.getItem("role") !== "admin") return setStatus("Admin login required.");
    try {
      await apiPost("/admin/categories", { name: category }, token);
      setStatus("Category added.");
      setCategory("");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "";
      setStatus(msg.includes("(401)") ? "Session expired. Login again." : msg || "Failed to add category.");
    }
  }

  async function addProduct() {
    const token = localStorage.getItem("token");
    if (!token || localStorage.getItem("role") !== "admin") return setStatus("Admin login required.");
    try {
      await apiPost(
        "/admin/products",
        {
          ...product,
          category_id: product.category_id,
          servicing_frequency_per_year: Number(product.servicing_frequency_per_year),
          warranty_complexity: Number(product.warranty_complexity),
          failure_rate: Number(product.failure_rate),
          claim_success_probability: Number(product.claim_success_probability)
        },
        token
      );
      setStatus("Product added.");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "";
      setStatus(msg.includes("(401)") ? "Session expired. Login again." : msg || "Failed to add product.");
    }
  }

  if (!isAdmin) {
    return (
      <section className="rounded-2xl border border-ink/10 bg-white p-6">
        <h1 className="font-display text-3xl">Admin Dashboard</h1>
        <p className="mt-3 text-sm">Only admin users can access this page.</p>
        <Link className="mt-2 inline-block underline" href="/login">
          Login as Admin
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <h1 className="font-display text-3xl">Admin Dashboard</h1>
      <div className="flex flex-wrap gap-2">
        <Link className="rounded-lg border border-ink/30 px-3 py-2 text-sm" href="/admin/agents">
          Manage Agents
        </Link>
        <Link className="rounded-lg border border-ink/30 px-3 py-2 text-sm" href="/admin/reviews">
          Manage Reviews
        </Link>
        <Link className="rounded-lg border border-ink/30 px-3 py-2 text-sm" href="/admin/products">
          Manage Registered Products
        </Link>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-5">
        <h2 className="font-display text-xl">Add Category</h2>
        <div className="mt-3 flex gap-2">
          <input
            className="w-full rounded-lg border border-ink/20 p-2"
            placeholder="Category name"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <button className="rounded-lg bg-ink px-4 text-paper" onClick={addCategory}>
            Add
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-5">
        <h2 className="font-display text-xl">Add Product</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {Object.entries(product).map(([key, value]) =>
            key === "category_id" ? (
              <select
                key={key}
                className="rounded-lg border border-ink/20 p-2"
                value={value}
                onChange={(e) => setProduct((prev) => ({ ...prev, category_id: e.target.value }))}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                key={key}
                className="rounded-lg border border-ink/20 p-2"
                placeholder={key}
                type={key === "release_date" ? "date" : key.includes("frequency") || key.includes("rate") || key.includes("complexity") ? "number" : "text"}
                value={value}
                onChange={(e) => setProduct((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            )
          )}
        </div>
        <button className="mt-3 rounded-lg bg-ink px-4 py-2 text-paper" onClick={addProduct}>
          Create Product
        </button>
      </div>

      {status ? <p className="text-sm">{status}</p> : null}
    </section>
  );
}
