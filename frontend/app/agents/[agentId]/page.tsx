"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiGet, buildAssetUrl } from "@/lib/api";

type AgentPublic = {
  name: string;
  agentId: string;
  phone: string;
  location: string;
  specialization: string;
  averageRating: number;
  totalCustomers: number;
  totalRegistrations: number;
  profilePhoto: string;
};

type ReviewPayload = {
  agent: { averageRating: number };
  reviews: Array<{
    id: string;
    userName: string;
    rating: number;
    review: string;
    serviceSpeed: number;
    agentBehavior: number;
    documentationQuality: number;
    createdAt: string;
  }>;
};

export default function AgentProfilePage() {
  const params = useParams<{ agentId: string }>();
  const [agent, setAgent] = useState<AgentPublic | null>(null);
  const [reviews, setReviews] = useState<ReviewPayload["reviews"]>([]);
  const [message, setMessage] = useState("");
  const agentId = params?.agentId || "";
  useEffect(() => {
    if (!agentId) return;
    Promise.all([apiGet<AgentPublic>(`/agents/${agentId}/public`), apiGet<ReviewPayload>(`/reviews/${agentId}`)])
      .then(([agentData, reviewData]) => {
        setAgent(agentData);
        setReviews(reviewData.reviews);
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Failed to load agent profile."));
  }, [agentId]);

  if (!agent) {
    return (
      <section className="rounded-2xl border border-ink/10 bg-white p-6">
        <p className="text-sm">{message || "Loading..."}</p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-ink/10 bg-white p-5">
        {agent.profilePhoto ? (
          <img
            src={buildAssetUrl(agent.profilePhoto)}
            alt={agent.name}
            className="mb-2 h-16 w-16 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}
        <h1 className="font-display text-3xl">{agent.name}</h1>
        <p className="text-sm text-ink/70">
          {agent.agentId} | {agent.location}
        </p>
        <p className="text-sm">Phone: {agent.phone || "-"}</p>
        <p className="text-sm">
          Specialization: {agent.specialization} | Rating: {agent.averageRating}
        </p>
        <p className="text-sm">Total Registrations: {agent.totalRegistrations}</p>
        <Link href={`/reviews/submit?agentId=${agent.agentId}`} className="mt-3 inline-block rounded-lg bg-ink px-4 py-2 text-sm text-paper">
          Submit Review
        </Link>
      </div>
      <div className="rounded-2xl border border-ink/10 bg-white p-5">
        <h2 className="font-display text-xl">Customer Reviews</h2>
        <div className="mt-3 space-y-2">
          {reviews.map((item) => (
            <article key={item.id} className="rounded-xl bg-ink/5 p-3 text-sm">
              <p className="font-semibold">
                {item.userName} | {"*".repeat(item.rating)}
              </p>
              <p>{item.review || "No text provided."}</p>
              <p className="text-xs text-ink/70">
                Speed {item.serviceSpeed}/5 | Behavior {item.agentBehavior}/5 | Docs {item.documentationQuality}/5
              </p>
            </article>
          ))}
          {!reviews.length ? <p className="text-sm text-ink/70">No reviews available yet.</p> : null}
        </div>
      </div>
    </section>
  );
}
