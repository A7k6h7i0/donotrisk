"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";

type AssistantResponse = {
  reply: string;
};

export default function AssistantPage() {
  const [question, setQuestion] = useState("");
  const [productId, setProductId] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading) return;
    const text = question.trim();
    if (!text) return;

    const token = localStorage.getItem("token");
    if (!token) return setStatus("Login required.");
    setStatus("Thinking...");
    setIsLoading(true);

    try {
      const result = await apiPost<AssistantResponse>("/ai/assistant", { message: text, productId }, token);
      setAnswer(result.reply);
      setStatus("");
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Failed to get AI response.";
      setStatus(detail);
    } finally {
      setIsLoading(false);
    }
  }

  function clearResult() {
    setQuestion("");
    setAnswer("");
    setStatus("");
  }

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">DoNotRisk AI Assistant</h1>
        <button
          type="button"
          onClick={clearResult}
          className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm"
          disabled={isLoading && !answer}
        >
          Clear
        </button>
      </div>

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
          placeholder="Ask about warranty, return process, documents, support contacts..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isLoading}
        />
        <button className="mt-3 rounded-lg bg-ink px-4 py-2 text-paper disabled:opacity-60" disabled={isLoading || !question.trim()}>
          Send
        </button>
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
