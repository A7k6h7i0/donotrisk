"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { apiPost } from "@/lib/api";

const fieldLabels: Record<string, string> = {
  agentId: "Agent ID",
  rating: "Overall Rating",
  review: "Review",
  serviceSpeed: "Service Speed Rating",
  agentBehavior: "Agent Behavior Rating",
  documentationQuality: "Documentation Quality Rating"
};

export default function SubmitReviewPage() {
  const search = useSearchParams();
  const initialAgentId = search.get("agentId") || "";
  const [form, setForm] = useState({
    agentId: initialAgentId,
    rating: "5",
    review: "",
    serviceSpeed: "5",
    agentBehavior: "5",
    documentationQuality: "5"
  });
  const [status, setStatus] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return setStatus("Login required.");
    // Parse as integers to ensure proper type
    const rating = parseInt(form.rating, 10);
    const serviceSpeed = parseInt(form.serviceSpeed, 10);
    const agentBehavior = parseInt(form.agentBehavior, 10);
    const documentationQuality = parseInt(form.documentationQuality, 10);
    if ([rating, serviceSpeed, agentBehavior, documentationQuality].some((v) => isNaN(v) || v < 1 || v > 5)) {
      return setStatus("All rating fields must be selected with values 1-5.");
    }
    try {
      await apiPost(
        "/reviews/add",
        {
          ...form,
          rating,
          serviceSpeed,
          agentBehavior,
          documentationQuality
        },
        token
      );
      setStatus("Review submitted successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to submit review.");
    }
  }

  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-ink/10 bg-white p-6">
      <h1 className="font-display text-3xl">Submit Agent Review</h1>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        {Object.entries(form).map(([key, value]) => (
          <label key={key} className="block text-sm font-medium text-ink/80">
            <span className="mb-1 block">{fieldLabels[key] || key}</span>
            {key === "review" ? (
              <textarea
                className="w-full rounded-lg border border-ink/20 p-2"
                value={value}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            ) : key === "rating" || key === "serviceSpeed" || key === "agentBehavior" || key === "documentationQuality" ? (
              <select
                className="w-full rounded-lg border border-ink/20 p-2"
                value={value}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={String(n)}>
                    {n}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="w-full rounded-lg border border-ink/20 p-2"
                value={value}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            )}
          </label>
        ))}
        <button className="rounded-lg bg-ink px-4 py-2 text-paper">Submit Review</button>
      </form>
      {status ? <p className="mt-3 text-sm">{status}</p> : null}
    </section>
  );
}
