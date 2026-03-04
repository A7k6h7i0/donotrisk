import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { calculateWarrantyRisk } from "../services/riskScore.js";
import { categorySchema, productSchema } from "../utils/validators.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { WarrantyDetail } from "../models/WarrantyDetail.js";
import { ProsCons } from "../models/ProsCons.js";
import { ScannedWarranty } from "../models/ScannedWarranty.js";
import { User } from "../models/User.js";

const router = express.Router();

router.use(requireAuth, requireRole("admin"));

router.post("/categories", async (req, res) => {
  try {
    const parsed = categorySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const { name, parent_id = null } = parsed.data;
    const result = await Category.create({ name, parent_id });
    return res.status(201).json({
      id: String(result._id),
      name: result.name,
      parent_id: result.parent_id ? String(result.parent_id) : null
    });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ message: "Category already exists under this parent." });
    return res.status(500).json({ message: "Failed to add category." });
  }
});

router.post("/products", async (req, res) => {
  try {
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const data = parsed.data;

    const category = await Category.findById(data.category_id).select("_id");
    if (!category) return res.status(400).json({ message: "Invalid category_id. Please use an existing category." });

    const risk = calculateWarrantyRisk({
      servicingFrequencyPerYear: data.servicing_frequency_per_year,
      warrantyComplexity: data.warranty_complexity,
      failureRate: data.failure_rate,
      claimSuccessProbability: data.claim_success_probability
    });

    const result = await Product.create({
      ...data,
      category_id: data.category_id,
      risk_score: risk.score,
      risk_band: risk.band
    });

    return res.status(201).json({
      id: String(result._id),
      name: result.name,
      brand: result.brand,
      model_number: result.model_number
    });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ message: "Product model number already exists." });
    return res.status(500).json({ message: "Failed to add product." });
  }
});

router.post("/warranties", async (req, res) => {
  try {
    const {
      product_id,
      duration_months,
      coverage_type,
      start_conditions,
      registration_requirements,
      claim_process,
      validity_conditions,
      void_conditions
    } = req.body;

    const result = await WarrantyDetail.findOneAndUpdate(
      { product_id },
      {
        product_id,
        duration_months,
        coverage_type,
        start_conditions,
        registration_requirements,
        claim_process,
        validity_conditions,
        void_conditions
      },
      { upsert: true, new: true }
    ).lean();

    return res.status(201).json({ id: String(result._id), product_id: String(result.product_id) });
  } catch {
    return res.status(500).json({ message: "Failed to upsert warranty details." });
  }
});

router.post("/pros-cons", async (req, res) => {
  try {
    const { product_id, pros, cons } = req.body;
    const result = await ProsCons.findOneAndUpdate({ product_id }, { product_id, pros, cons }, { upsert: true, new: true }).lean();
    return res.status(201).json({ id: String(result._id), product_id: String(result.product_id) });
  } catch {
    return res.status(500).json({ message: "Failed to upsert pros/cons." });
  }
});

router.get("/scans", async (_req, res) => {
  try {
    const scans = await ScannedWarranty.find().sort({ created_at: -1 }).lean();
    const userIds = [...new Set(scans.map((x) => String(x.user_id)))];
    const productIds = [...new Set(scans.filter((x) => x.product_id).map((x) => String(x.product_id)))];
    const users = await User.find({ _id: { $in: userIds } }).select("name email").lean();
    const products = await Product.find({ _id: { $in: productIds } }).select("name").lean();
    const userMap = new Map(users.map((u) => [String(u._id), u]));
    const productMap = new Map(products.map((p) => [String(p._id), p]));

    return res.json(
      scans.map((sw) => ({
        id: String(sw._id),
        user_id: String(sw.user_id),
        product_id: sw.product_id ? String(sw.product_id) : null,
        serial_number: sw.serial_number,
        purchase_date: sw.purchase_date,
        expiry_date: sw.expiry_date,
        raw_extracted_text: sw.raw_extracted_text,
        created_at: sw.created_at,
        user_name: userMap.get(String(sw.user_id))?.name || null,
        email: userMap.get(String(sw.user_id))?.email || null,
        product_name: sw.product_id ? productMap.get(String(sw.product_id))?.name || null : null
      }))
    );
  } catch {
    return res.status(500).json({ message: "Failed to fetch scans." });
  }
});

export default router;
