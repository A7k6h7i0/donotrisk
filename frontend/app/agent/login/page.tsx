"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiPost } from "@/lib/api";

export default function AgentLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const data = await apiPost<{ token: string; user: { role: string; name: string; email: string } }>(
        "/agents/login",
        { email, password }
      );
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user_name", data.user.name || "");
      localStorage.setItem("user_email", data.user.email || "");
      router.push("/agent/dashboard");
    } catch {
      setError("Invalid agent credentials");
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-ink/10 bg-white p-6">
      <h1 className="font-display text-2xl">Agent Login</h1>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input className="w-full rounded-lg border border-ink/20 p-2" placeholder="Agent Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          className="w-full rounded-lg border border-ink/20 p-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="w-full rounded-lg bg-ink py-2 text-paper">Sign In as Agent</button>
      </form>
      <p className="mt-3 text-sm text-ink/70">
        New agent?{" "}
        <Link href="/agent/register" className="underline">
          Create agent account
        </Link>
      </p>
      <p className="mt-1 text-sm text-ink/70">
        User login:{" "}
        <Link href="/login" className="underline">
          Go to user login
        </Link>
      </p>
    </section>
  );
}
