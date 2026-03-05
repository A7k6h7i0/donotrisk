import dotenv from "dotenv";

dotenv.config();

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
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB || 10)
};
