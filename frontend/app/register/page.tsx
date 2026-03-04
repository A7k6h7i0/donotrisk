"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiPost } from "@/lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await apiPost("/auth/register", { name, email, password });
      router.push("/login");
    } catch {
      setError("Registration failed");
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-ink/10 bg-white p-6">
      <h1 className="font-display text-2xl">Create Account</h1>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input className="w-full rounded-lg border border-ink/20 p-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full rounded-lg border border-ink/20 p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded-lg border border-ink/20 p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="w-full rounded-lg bg-ink py-2 text-paper">Create</button>
      </form>
      <p className="mt-3 text-sm text-ink/70">
        Already have account? <Link href="/login" className="underline">Sign in</Link>
      </p>
    </section>
  );
}
