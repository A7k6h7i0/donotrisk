import axios from "axios";
import { env } from "../config/env.js";

export async function askGemini({ role, question, context, systemInstruction }) {
  if (!env.geminiApiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const defaultSystemPrompt =
    "You are DoNotRisk AI assistant for warranty intelligence. " +
    "Give actionable, short, practical guidance for users and agents. " +
    "If warranty evidence is missing, suggest exact next steps.";

  const userPrompt = `Role: ${role}\nQuestion: ${question}\nContext:\n${context || "No extra context."}`;

  const modelName = env.geminiModel.startsWith("models/")
    ? env.geminiModel
    : `models/${env.geminiModel}`;
  const url = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent`;

  let response;
  try {
    response = await axios.post(
      `${url}?key=${env.geminiApiKey}`,
      {
        systemInstruction: {
          role: "system",
          parts: [{ text: (systemInstruction || defaultSystemPrompt).trim() }]
        },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.2,
          // Avoid clipped replies (finishReason: MAX_TOKENS) for normal assistant answers.
          maxOutputTokens: 2048
        }
      },
      {
        timeout: 30000
      }
    );
  } catch (error) {
    const status = error?.response?.status;
    const providerMessage = error?.response?.data?.error?.message;
    if (status && providerMessage) {
      throw new Error(`Gemini ${status}: ${providerMessage}`);
    }
    throw error;
  }

  const text = response.data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n").trim();
  if (!text) throw new Error("AI response empty");
  return text;
}
