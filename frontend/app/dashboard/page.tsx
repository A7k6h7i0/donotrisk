"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiGet } from "@/lib/api";

type Tracked = {
  id: string;
  product_name: string;
  brand: string;
  model_number: string;
  serial_number: string;
  purchase_date: string;
  expiry_date: string;
  risk_score: number | null;
  risk_band: string;
  source?: string;
  registered_product_id?: string;
  agent_name?: string;
  agent_id?: string;
  agent_phone?: string;
  total_warranty?: string;
};

export default function DashboardPage() {
  const [items, setItems] = useState<Tracked[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
      setMessage("Please login to view dashboard.");
      return;
    }
    if (role === "admin") {
      setMessage("This page is for users. Use Admin Dashboard.");
      return;
    }
    if (role === "agent") {
      setMessage("This page is for users. Use Agent Dashboard.");
      return;
    }
    apiGet<Tracked[]>("/users/me/warranties", token)
      .then(setItems)
      .catch((error) => {
        const msg = error instanceof Error ? error.message : "";
        if (msg.includes("(401)")) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("user_name");
          localStorage.removeItem("user_email");
          setMessage("Session expired or invalid. Please login again.");
          return;
        }
        setMessage(msg || "Failed to load warranties.");
      });
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const expiring30 = items.filter((x) => {
      if (!x.expiry_date) return false;
      const diff = (new Date(x.expiry_date).getTime() - now.getTime()) / (1000 * 3600 * 24);
      return diff >= 0 && diff <= 30;
    }).length;
    return { active: items.length, expiring30 };
  }, [items]);

  return (
    <section className="space-y-5">
      <h1 className="font-display text-3xl">User Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-4">
          <p className="text-sm text-ink/60">Active Warranties</p>
          <p className="text-3xl font-bold">{stats.active}</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-4">
          <p className="text-sm text-ink/60">Expiring in 30 days</p>
          <p className="text-3xl font-bold">{stats.expiring30}</p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-4">
          <p className="text-sm text-ink/60">Claim Guide</p>
          <p className="mt-1 text-sm">Keep invoice + serial proof + service history for faster claim approvals.</p>
        </div>
      </div>
      <div className="rounded-2xl border border-ink/10 bg-white p-5">
        <h2 className="font-display text-xl">Tracked Products</h2>
        <div className="mt-3 space-y-3">
          {items.map((x) => (
            <div key={x.id} className="rounded-xl bg-ink/5 p-3 text-sm">
              <p className="font-semibold">
                {x.product_name} ({x.brand})
              </p>
              <p>Model: {x.model_number} | Serial: {x.serial_number || "-"}</p>
              {x.registered_product_id ? <p>Registered Product ID: {x.registered_product_id}</p> : null}
              <p>
                Expiry: {x.expiry_date || "-"} | Risk: {x.risk_score} ({x.risk_band})
              </p>
              {x.source === "agent_registered" ? (
                <p>
                  Agent: {x.agent_name || "-"} ({x.agent_id || "-"}) | Phone: {x.agent_phone || "-"} | Warranty: {x.total_warranty || "-"}
                </p>
              ) : null}
              {x.source === "agent_registered" ? (
                <div className="mt-1 flex gap-3">
                  <Link href={`/warranty/${x.id}`} className="underline">
                    View Warranty
                  </Link>
                  {x.agent_id ? (
                    <Link href={`/reviews/submit?agentId=${x.agent_id}`} className="underline">
                      Rate Agent
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </div>
          ))}
          {!items.length ? (
            <p className="text-sm text-ink/65">
              {message || "No warranties tracked yet."}{" "}
              {(message.includes("login") || message.includes("Admin") || message.includes("Agent")) && (
                <Link href={message.includes("Admin") ? "/admin" : message.includes("Agent") ? "/agent/dashboard" : "/login"} className="underline">
                  Go now
                </Link>
              )}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
