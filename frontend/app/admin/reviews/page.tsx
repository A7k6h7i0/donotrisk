"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

type AdminReview = {
  id: string;
  agentName: string;
  agentId: string;
  userName: string;
  rating: number;
  review: string;
  serviceSpeed: number;
  agentBehavior: number;
  documentationQuality: number;
  createdAt: string;
};

export default function AdminReviewsPage() {
  const [rows, setRows] = useState<AdminReview[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setMessage("Admin login required.");
    apiGet<AdminReview[]>("/admin/reviews", token)
      .then(setRows)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Failed to load reviews."));
  }, []);

  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-6">
      <h1 className="font-display text-3xl">Manage Reviews</h1>
      {message ? <p className="mt-2 text-sm">{message}</p> : null}
      <div className="mt-4 space-y-2">
        {rows.map((row) => (
          <article key={row.id} className="rounded-xl bg-ink/5 p-3 text-sm">
            <p className="font-semibold">
              {row.agentName} ({row.agentId}) | {row.userName}
            </p>
            <p>Rating: {row.rating}/5</p>
            <p>{row.review || "No review text."}</p>
            <p className="text-xs text-ink/70">
              Speed {row.serviceSpeed}/5, Behavior {row.agentBehavior}/5, Docs {row.documentationQuality}/5
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
