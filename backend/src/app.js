import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/categories.js";
import productRoutes from "./routes/products.js";
import scanRoutes from "./routes/scans.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/users.js";
import { env } from "./config/env.js";

export const app = express();

// Render sits behind a proxy and sends X-Forwarded-* headers.
// express-rate-limit needs this enabled to identify client IPs safely.
if (env.nodeEnv === "production") {
  app.set("trust proxy", 1);
}

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin.split(",").map((x) => x.trim()),
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/scans", scanRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
});
