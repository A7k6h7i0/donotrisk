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
import { AgentProfile } from "../models/AgentProfile.js";
import { AgentReview } from "../models/AgentReview.js";
import { RegisteredProduct } from "../models/RegisteredProduct.js";
import { triggerCheck } from "../services/scheduler.js";

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

router.get("/agents", async (_req, res) => {
  const rows = await AgentProfile.find()
    .sort({ created_at: -1 })
    .select("name agent_id email phone location specialization is_verified average_rating total_customers total_registrations created_at")
    .lean();
  return res.json(
    rows.map((item) => ({
      id: String(item._id),
      name: item.name,
      agentId: item.agent_id,
      email: item.email,
      phone: item.phone,
      location: item.location,
      specialization: item.specialization,
      isVerified: item.is_verified,
      averageRating: item.average_rating,
      totalCustomers: item.total_customers,
      totalRegistrations: item.total_registrations,
      createdAt: item.created_at
    }))
  );
});

router.patch("/agents/:id/verify", async (req, res) => {
  const result = await AgentProfile.findByIdAndUpdate(req.params.id, { is_verified: Boolean(req.body?.isVerified) }, { new: true }).lean();
  if (!result) return res.status(404).json({ message: "Agent not found" });
  return res.json({ id: String(result._id), isVerified: result.is_verified });
});

router.get("/reviews", async (_req, res) => {
  const rows = await AgentReview.find()
    .sort({ created_at: -1 })
    .populate("agent_id", "name agent_id")
    .populate("user_id", "name")
    .lean();
  return res.json(
    rows.map((item) => ({
      id: String(item._id),
      agentName: item.agent_id?.name || null,
      agentId: item.agent_id?.agent_id || null,
      userName: item.user_id?.name || null,
      rating: item.rating,
      review: item.review,
      serviceSpeed: item.service_speed,
      agentBehavior: item.agent_behavior,
      documentationQuality: item.documentation_quality,
      moderated: item.is_moderated,
      createdAt: item.created_at
    }))
  );
});

router.get("/registered-products", async (_req, res) => {
  const rows = await RegisteredProduct.find()
    .sort({ created_at: -1 })
    .populate("agent_id", "name agent_id")
    .populate("user_id", "name email")
    .lean();
  return res.json(
    rows.map((item) => ({
      id: String(item._id),
      customerName: item.customer_name,
      customerEmail: item.customer_email,
      productName: item.product_name,
      brand: item.brand,
      modelNumber: item.model_number,
      category: item.product_category,
      purchaseDate: item.purchase_date,
      invoiceNumber: item.invoice_number,
      agentName: item.agent_id?.name || null,
      agentId: item.agent_id?.agent_id || null,
      linkedUserName: item.user_id?.name || null,
      linkedUserEmail: item.user_id?.email || null,
      createdAt: item.created_at
    }))
  );
});

// Manually trigger warranty expiry check
router.post("/trigger-warranty-check", async (req, res) => {
  try {
    const result = await triggerCheck();
    return res.json({ 
      success: true, 
      message: "Warranty check completed",
      details: result
    });
  } catch (error) {
    console.error("Error triggering warranty check:", error);
    return res.status(500).json({ message: "Failed to run warranty check" });
  }
});

export default router;
