import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { env } from "../config/env.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function extractFromWarrantyFile(filePath, originalName, mimeType) {
  const base = String(env.ocrServiceUrl || "").replace(/\/+$/, "");
  const fileBuffer = fs.readFileSync(filePath);
  let lastError;
  const maxAttempts = env.nodeEnv === "production" ? 3 : 1;

  // Warm up OCR container on platforms with cold starts (best effort).
  if (env.nodeEnv === "production") {
    try {
      await axios.get(`${base}/health`, { timeout: 20000 });
    } catch {}
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      // Rebuild multipart payload each attempt.
      const form = new FormData();
      form.append("file", fileBuffer, {
        filename: originalName || "warranty_upload",
        contentType: mimeType || "application/octet-stream",
        knownLength: fileBuffer.length
      });

      const contentLength = await new Promise((resolve, reject) => {
        form.getLength((err, length) => {
          if (err) return reject(err);
          return resolve(length);
        });
      });

      const response = await axios.post(`${base}/extract`, form, {
        headers: {
          ...form.getHeaders(),
          "Content-Length": String(contentLength)
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 300000
      });
      return response.data;
    } catch (error) {
      lastError = error;
      const status = Number(error?.response?.status || 0);
      const retriable =
        status === 502 ||
        status === 503 ||
        status === 504 ||
        /ECONNRESET|ECONNREFUSED|ETIMEDOUT|socket hang up/i.test(String(error?.message || ""));

      if (!retriable || attempt === maxAttempts) {
        throw error;
      }

      await sleep(1500 * attempt);
    }
  }

  throw lastError;
}
