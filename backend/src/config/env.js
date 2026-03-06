import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "../../");

// Always load backend/.env even if process is started from repo root.
dotenv.config({ path: path.join(backendRoot, ".env") });

const required = ["MONGODB_URI", "JWT_SECRET"];
if ((process.env.NODE_ENV || "development") === "production") {
  required.push("OCR_SERVICE_URL");
}
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  ocrServiceUrl: process.env.OCR_SERVICE_URL || "http://localhost:8000",
  ocrMaxAttempts: Math.max(1, Number(process.env.OCR_MAX_ATTEMPTS || 3)),
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB || 10),
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash"
};
