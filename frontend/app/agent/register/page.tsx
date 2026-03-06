"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const initialForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  location: "",
  specialization: ""
};

export default function AgentRegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      if (profilePhoto) payload.append("profilePhoto", profilePhoto);

      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
      const response = await fetch(`${base}/agents/register`, {
        method: "POST",
        body: payload
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message || "Failed to register agent.");
      }
      const data = (await response.json()) as { agentId: string };
      setStatus(`Agent account created: ${data.agentId}. Redirecting to login...`);
      setTimeout(() => router.push("/agent/login"), 900);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to register agent.");
    }
  }

  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-ink/10 bg-white p-6">
      <h1 className="font-display text-2xl">Register Agent</h1>
      <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={onSubmit}>
        {Object.entries(form).map(([key, value]) => (
          <input
            key={key}
            className="rounded-lg border border-ink/20 p-2"
            placeholder={key.replace("_", " ")}
            type={key === "password" ? "password" : "text"}
            value={value}
            onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
          />
        ))}
        <input className="rounded-lg border border-ink/20 p-2 md:col-span-2" type="file" accept="image/*" onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)} />
        <button className="rounded-lg bg-ink px-4 py-2 text-paper md:col-span-2">Create Agent Account</button>
      </form>
      {status ? <p className="mt-3 text-sm">{status}</p> : null}
    </section>
  );
}
