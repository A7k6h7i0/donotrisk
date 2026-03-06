"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";

export default function AssistantPage() {
  const [question, setQuestion] = useState("");
  const [productId, setProductId] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("");

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return setStatus("Login required.");
    setStatus("Thinking...");
    try {
      const result = await apiPost<{ reply: string }>("/ai/assistant", { message: question, productId }, token);
      setAnswer(result.reply);
      setStatus("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to get AI response.");
    }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <h1 className="font-display text-3xl">DoNotRisk AI Assistant</h1>
      <form className="rounded-2xl border border-ink/10 bg-white p-4" onSubmit={ask}>
        <input
          className="mb-2 w-full rounded-lg border border-ink/20 p-2"
          placeholder="Registered Product ID (optional)"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <textarea
          className="w-full rounded-lg border border-ink/20 p-2"
          rows={4}
          placeholder="Ask anything about warranty, claim strategy, fraud risk, or documentation..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button className="mt-3 rounded-lg bg-ink px-4 py-2 text-paper">Ask AI</button>
      </form>
      {status ? <p className="text-sm">{status}</p> : null}
      {answer ? (
        <article className="rounded-2xl border border-ink/10 bg-white p-4">
          <h2 className="font-display text-xl">AI Response</h2>
          <pre className="mt-2 whitespace-pre-wrap text-sm">{answer}</pre>
        </article>
      ) : null}
    </section>
  );
}
