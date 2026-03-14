"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet, buildAssetUrl } from "@/lib/api";

type AgentDashboardResponse = {
  agent: {
    name: string;
    agentId: string;
    phone: string;
    location: string;
    specialization: string;
    profilePhoto: string;
    averageRating: number;
    totalCustomers: number;
    totalRegistrations: number;
    verified: boolean;
  };
  dashboard: {
    totalCustomersServed: number;
    totalWarrantiesRegistered: number;
    averageRating: number;
    recentRegistrations: Array<{
      id: string;
      customerName: string;
      customerEmail: string;
      productName: string;
      brand: string;
      purchaseDate: string;
      category: string;
    }>;
  };
};

export default function AgentDashboardPage() {
  const [data, setData] = useState<AgentDashboardResponse | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "agent") {
      setMessage("Agent login required.");
      return;
    }
    apiGet<AgentDashboardResponse>("/agents/profile", token)
      .then(setData)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Failed to load agent dashboard."));
  }, []);

  if (!data) {
    return (
      <section className="rounded-2xl border border-ink/10 bg-white p-6">
        <h1 className="font-display text-3xl">Agent Dashboard</h1>
        <p className="mt-3 text-sm">{message || "Loading..."}</p>
      </section>
    );
  }

  const { agent, dashboard } = data;
  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-ink/10 bg-white p-5">
        {agent.profilePhoto ? (
          <img
            src={buildAssetUrl(agent.profilePhoto)}
            alt={agent.name}
            className="mb-2 h-16 w-16 rounded-full object-cover"
            loading="lazy"
            decoding="async"
            width={64}
            height={64}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : null}
        <h1 className="font-display text-3xl">{agent.name}</h1>
        <p className="text-sm text-ink/70">
          {agent.agentId} | {agent.location} | {agent.specialization}
        </p>
        <p className="text-sm">Phone: {agent.phone || "-"}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-ink/10 bg-white p-4">
          <p className="text-sm text-ink/60">Customers Served</p>
          <p className="text-3xl font-bold">{dashboard.totalCustomersServed}</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-4">
          <p className="text-sm text-ink/60">Warranties Registered</p>
          <p className="text-3xl font-bold">{dashboard.totalWarrantiesRegistered}</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-4">
          <p className="text-sm text-ink/60">Average Rating</p>
          <p className="text-3xl font-bold">{dashboard.averageRating}</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-4">
          <p className="text-sm text-ink/60">Verification</p>
          <p className="text-xl font-semibold">{agent.verified ? "Verified" : "Pending"}</p>
        </div>
      </div>
      <div className="rounded-2xl border border-ink/10 bg-white p-5">
        <h2 className="font-display text-xl">Recent Registrations</h2>
        <div className="mt-3 space-y-3">
          {dashboard.recentRegistrations.map((item) => (
            <div key={item.id} className="rounded-xl bg-ink/5 p-3 text-sm">
              <p className="font-semibold">
                {item.productName} ({item.brand})
              </p>
              <p>
                Customer: {item.customerName} | {item.customerEmail}
              </p>
              <p>
                Category: {item.category} | Date: {item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : "-"}
              </p>
            </div>
          ))}
          {!dashboard.recentRegistrations.length ? <p className="text-sm text-ink/70">No recent registrations yet.</p> : null}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href="/agent/register-product" className="rounded-lg bg-ink px-4 py-2 text-sm text-paper">
          Register Product
        </Link>
        <Link href="/agent/add-warranty" className="rounded-lg border border-ink/30 px-4 py-2 text-sm">
          Add Warranty
        </Link>
        <Link href="/agent/customers" className="rounded-lg border border-ink/30 px-4 py-2 text-sm">
          View Customers
        </Link>
      </div>
    </section>
  );
}
