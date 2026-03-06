import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/categories.js";
import productRoutes from "./routes/products.js";
import scanRoutes from "./routes/scans.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/users.js";
import agentRoutes from "./routes/agents.js";
import warrantyRoutes from "./routes/warranty.js";
import reviewRoutes from "./routes/reviews.js";
import returnRoutes from "./routes/returns.js";
import aiRoutes from "./routes/ai.js";
import { env } from "./config/env.js";

export const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, "../uploads");

// Render sits behind a proxy and sends X-Forwarded-* headers.
// express-rate-limit needs this enabled to identify client IPs safely.
if (env.nodeEnv === "production") {
  app.set("trust proxy", 1);
}

app.use(helmet());

const allowedOrigins = env.corsOrigin
  .split(",")
  .map((x) => x.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser and same-origin server calls.
      if (!origin) return callback(null, true);

      const normalized = origin.trim().replace(/\/+$/, "");
      if (allowedOrigins.includes(normalized)) return callback(null, true);

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(uploadsDir));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/scans", scanRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/warranty", warrantyRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/ai", aiRoutes);
app.use("/ai", aiRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
});
