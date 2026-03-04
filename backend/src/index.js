import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectMongo } from "./db/mongoose.js";
import bcrypt from "bcryptjs";
import { User } from "./models/User.js";
import { Category } from "./models/Category.js";
import { Product } from "./models/Product.js";
import { WarrantyDetail } from "./models/WarrantyDetail.js";
import { ProsCons } from "./models/ProsCons.js";

async function bootstrapIfEmpty() {
  const count = await User.countDocuments();
  if (count > 0) return;

  const adminHash = await bcrypt.hash("Admin@12345", 12);
  const userHash = await bcrypt.hash("User@12345", 12);
  await User.create({ name: "Admin", email: "admin@donotrisk.com", password_hash: adminHash, role: "admin" });
  await User.create({ name: "Demo User", email: "user@donotrisk.com", password_hash: userHash, role: "user" });

  const electronics = await Category.create({ name: "Electronics" });
  const router = await Category.create({ name: "WiFi Routers", parent_id: electronics._id });
  const product = await Product.create({
    name: "Airtel Xstream Router",
    brand: "Airtel",
    model_number: "AXR-2025",
    category_id: router._id,
    description: "Dual-band WiFi router with mesh support and warranty tracking support.",
    release_date: new Date("2025-01-01"),
    servicing_frequency_per_year: 2,
    warranty_complexity: 6,
    failure_rate: 15,
    claim_success_probability: 80,
    risk_score: 35,
    risk_band: "Low"
  });
  await WarrantyDetail.create({
    product_id: product._id,
    duration_months: 24,
    coverage_type: "manufacturer warranty",
    start_conditions: "Starts from invoice purchase date.",
    registration_requirements: "Register within 30 days.",
    claim_process: "Raise support ticket with invoice and serial number.",
    validity_conditions: "No unauthorized repair; valid invoice required.",
    void_conditions: "Physical damage, water damage, or broken seals."
  });
  await ProsCons.create({
    product_id: product._id,
    pros: "Good network support and standard warranty.",
    cons: "Requires invoice and condition compliance."
  });
}

async function start() {
  await connectMongo();
  await bootstrapIfEmpty();
  app.listen(env.port, () => {
    console.log(`Backend running on port ${env.port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
