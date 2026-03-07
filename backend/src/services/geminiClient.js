import axios from "axios";
import { env } from "../config/env.js";

function extractSourceLinks(candidate) {
  const chunks = candidate?.groundingMetadata?.groundingChunks || [];
  const links = [];
  for (const chunk of chunks) {
    const uri = chunk?.web?.uri;
    const title = chunk?.web?.title || uri;
    if (uri && !links.find((item) => item.uri === uri)) {
      links.push({ title, uri });
    }
  }
  return links.slice(0, 5);
}

async function callGemini({ url, payload }) {
  const response = await axios.post(url, payload, { timeout: 30000 });
  const candidate = response.data?.candidates?.[0] || null;
  const text = candidate?.content?.parts?.map((p) => p.text).join("\n").trim();
  if (!text) throw new Error("AI response empty");

  const sources = extractSourceLinks(candidate);
  if (sources.length === 0) return text;

  const sourcesBlock = [
    "",
    "Sources:",
    ...sources.map((item, index) => `${index + 1}. ${item.title} - ${item.uri}`)
  ].join("\n");

  const endMarker = "End of response.";
  if (text.trim().endsWith(endMarker)) {
    const withoutEnd = text.trim().slice(0, -endMarker.length).trimEnd();
    return `${withoutEnd}${sourcesBlock}\n${endMarker}`;
  }

  return `${text}${sourcesBlock}`;
}

export async function askGemini({ role, question, context, systemInstruction, enableWebSearch = false }) {
  if (!env.geminiApiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const defaultSystemPrompt =
    "You are DoNotRisk AI assistant for warranty intelligence. " +
    "Give actionable, short, practical guidance for users and agents. " +
    "If warranty evidence is missing, suggest exact next steps.";

  const userPrompt = `Role: ${role}\nQuestion: ${question}\nContext:\n${context || "No extra context."}`;

  // Enforce Gemini 2.5 Flash for assistant consistency.
  const modelName = "models/gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent`;

  const basePayload = {
    systemInstruction: {
      role: "system",
      parts: [{ text: (systemInstruction || defaultSystemPrompt).trim() }]
    },
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: {
      temperature: 0.2,
      // Keep enough room for structured, step-by-step responses.
      maxOutputTokens: 8192
    }
  };

  try {
    if (enableWebSearch) {
      try {
        return await callGemini({
          url: `${url}?key=${env.geminiApiKey}`,
          payload: {
            ...basePayload,
            tools: [{ google_search: {} }]
          }
        });
      } catch (webError) {
        // If grounding is unavailable for the account/region, continue with normal generation.
        const status = webError?.response?.status;
        const providerMessage = webError?.response?.data?.error?.message;
        if (!(status && providerMessage)) {
          throw webError;
        }
      }
    }

    return await callGemini({
      url: `${url}?key=${env.geminiApiKey}`,
      payload: basePayload
    });
  } catch (error) {
    const status = error?.response?.status;
    const providerMessage = error?.response?.data?.error?.message;
    if (status && providerMessage) {
      throw new Error(`Gemini ${status}: ${providerMessage}`);
    }
    throw error;
  }

}
