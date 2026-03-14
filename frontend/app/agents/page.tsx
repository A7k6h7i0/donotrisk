"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet, buildAssetUrl } from "@/lib/api";

type AgentCard = {
  id: string;
  name: string;
  agentId: string;
  phone: string;
  location: string;
  specialization: string;
  averageRating: number;
  totalCustomers: number;
  totalRegistrations: number;
  isVerified: boolean;
  profilePhoto: string;
};

export default function BrowseAgentsPage() {
  const [agents, setAgents] = useState<AgentCard[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    apiGet<AgentCard[]>("/agents/browse")
      .then(setAgents)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Failed to load agents."));
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="font-display text-3xl">Browse Agents</h1>
      {message ? <p className="text-sm">{message}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {agents.map((agent) => (
          <article key={agent.id} className="rounded-2xl border border-ink/10 bg-white p-4">
            {agent.profilePhoto ? (
              <img
                src={buildAssetUrl(agent.profilePhoto)}
                alt={agent.name}
                className="mb-2 h-14 w-14 rounded-full object-cover"
                loading="lazy"
                decoding="async"
                width={56}
                height={56}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : null}
            <h2 className="font-semibold">{agent.name}</h2>
            <p className="text-sm text-ink/70">{agent.agentId}</p>
            <p className="text-sm">Phone: {agent.phone || "-"}</p>
            <p className="text-sm">
              {agent.location} | {agent.specialization}
            </p>
            <p className="text-sm">Rating: {agent.averageRating} | Customers: {agent.totalCustomers}</p>
            <p className="text-xs text-ink/60">{agent.isVerified ? "Verified Agent" : "Verification Pending"}</p>
            <Link href={`/agents/${agent.agentId}`} className="mt-2 inline-block rounded-lg border border-ink/30 px-3 py-1 text-sm">
              View Profile
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
