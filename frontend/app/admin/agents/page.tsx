"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPatch } from "@/lib/api";

type AgentAdminRow = {
  id: string;
  name: string;
  agentId: string;
  email: string;
  phone: string;
  location: string;
  specialization: string;
  isVerified: boolean;
  averageRating: number;
  totalCustomers: number;
  totalRegistrations: number;
};

export default function AdminAgentsPage() {
  const [rows, setRows] = useState<AgentAdminRow[]>([]);
  const [message, setMessage] = useState("");

  async function load() {
    const token = localStorage.getItem("token");
    if (!token) return setMessage("Admin login required.");
    try {
      const data = await apiGet<AgentAdminRow[]>("/admin/agents", token);
      setRows(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load agents.");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleVerify(id: string, isVerified: boolean) {
    const token = localStorage.getItem("token");
    if (!token) return;
    await apiPatch(`/admin/agents/${id}/verify`, { isVerified }, token);
    load();
  }

  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-6">
      <h1 className="font-display text-3xl">Manage Agents</h1>
      {message ? <p className="mt-2 text-sm">{message}</p> : null}
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10">
              <th className="px-2 py-2">Agent</th>
              <th className="px-2 py-2">Location</th>
              <th className="px-2 py-2">Stats</th>
              <th className="px-2 py-2">Verify</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-ink/5">
                <td className="px-2 py-2">
                  <p className="font-semibold">{row.name}</p>
                  <p className="text-xs text-ink/70">{row.agentId}</p>
                  <p className="text-xs text-ink/70">{row.email}</p>
                </td>
                <td className="px-2 py-2">
                  {row.location}
                  <p className="text-xs text-ink/70">{row.specialization}</p>
                </td>
                <td className="px-2 py-2">
                  Rating {row.averageRating} | Cust {row.totalCustomers} | Reg {row.totalRegistrations}
                </td>
                <td className="px-2 py-2">
                  <button className="rounded-lg border border-ink/30 px-3 py-1" onClick={() => toggleVerify(row.id, !row.isVerified)}>
                    {row.isVerified ? "Unverify" : "Verify"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
