import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { env } from "../config/env.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { User } from "../models/User.js";
import { AgentProfile } from "../models/AgentProfile.js";
import { RegisteredProduct } from "../models/RegisteredProduct.js";
import { WarrantyRecord } from "../models/WarrantyRecord.js";
import { recalculateAgentMetrics } from "../services/agentMetrics.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const imageUpload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    }
  }),
  limits: { fileSize: env.maxUploadMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.mimetype));
  }
});
const proofUpload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    }
  }),
  limits: { fileSize: env.maxUploadMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"].includes(file.mimetype));
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true
});

const agentRegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(6),
  location: z.string().min(2),
  specialization: z.string().min(2)
});

const agentLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const registerProductSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(6),
  customerEmail: z.string().email(),
  productName: z.string().min(2),
  brand: z.string().min(2),
  modelNumber: z.string().min(1),
  serialNumber: z.string().min(1),
  purchaseDate: z.string().min(4),
  invoiceNumber: z.string().min(1),
  purchaseStore: z.string().min(2),
  productCategory: z.string().min(2),
  proofType: z.enum(["image", "store_location", "agent_confirmation"]).default("agent_confirmation"),
  purchaseProofUrl: z.string().optional().default("")
});

async function generateAgentId(name) {
  const normalized = name.toLowerCase().replace(/[^a-z]/g, "");
  const prefix = normalized.slice(0, 2).padEnd(2, "x");
  const base = `dnr_${prefix}_agent`;

  const existing = await AgentProfile.find({ agent_id: new RegExp(`^${base}(_\\d{2})?$`) })
    .select("agent_id")
    .lean();
  if (!existing.length) return base;

  const used = new Set(existing.map((item) => item.agent_id));
  let index = 1;
  while (index <= 99) {
    const suffix = String(index).padStart(2, "0");
    const candidate = `${base}_${suffix}`;
    if (!used.has(candidate)) return candidate;
    index += 1;
  }
  throw new Error("Could not generate unique agent id");
}

async function getAgentByUserId(userId) {
  return AgentProfile.findOne({ user_id: userId });
}

async function generateRegisteredProductId() {
  const latest = await RegisteredProduct.findOne()
    .sort({ created_at: -1 })
    .select("registered_product_id")
    .lean();
  const lastPart = latest?.registered_product_id?.match(/(\d+)$/)?.[1];
  const next = lastPart ? Number(lastPart) + 1 : 1;
  return `dnr_prd_${String(next).padStart(6, "0")}`;
}

router.post("/register", authLimiter, imageUpload.single("profilePhoto"), async (req, res) => {
  const parsed = agentRegisterSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.message });

  const { name, email, password, phone, location, specialization } = parsed.data;
  const profilePhotoUrl = req.file ? `/uploads/${req.file.filename}` : "";
  const exists = await User.findOne({ email }).select("_id");
  if (exists) return res.status(409).json({ message: "Email already registered" });

  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password_hash: hash, role: "agent" });
  const agentId = await generateAgentId(name);
  const profile = await AgentProfile.create({
    user_id: user._id,
    name,
    agent_id: agentId,
    email,
    phone,
    location,
    specialization,
    profile_photo: profilePhotoUrl
  });

  return res.status(201).json({
    id: String(profile._id),
    userId: String(user._id),
    name: profile.name,
    agentId: profile.agent_id,
    email: profile.email,
    role: user.role
  });
});

router.post("/login", authLimiter, async (req, res) => {
  const parsed = agentLoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.message });

  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user || user.role !== "agent") return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const profile = await AgentProfile.findOne({ user_id: user._id }).lean();
  if (!profile) return res.status(404).json({ message: "Agent profile not found" });

  const token = jwt.sign({ id: String(user._id), email: user.email, role: user.role, name: user.name }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
  return res.json({
    token,
    user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
    agent: {
      id: String(profile._id),
      agentId: profile.agent_id,
      location: profile.location,
      specialization: profile.specialization
    }
  });
});

router.get("/browse", async (_req, res) => {
  const agents = await AgentProfile.find()
    .sort({ average_rating: -1, total_registrations: -1 })
    .select("name agent_id phone location specialization average_rating total_customers total_registrations profile_photo is_verified")
    .lean();
  return res.json(
    agents.map((item) => ({
      id: String(item._id),
      name: item.name,
      agentId: item.agent_id,
      phone: item.phone,
      location: item.location,
      specialization: item.specialization,
      averageRating: item.average_rating,
      totalCustomers: item.total_customers,
      totalRegistrations: item.total_registrations,
      profilePhoto: item.profile_photo,
      isVerified: item.is_verified
    }))
  );
});

router.get("/leaderboard", async (_req, res) => {
  const agents = await AgentProfile.find()
    .sort({ average_rating: -1, total_registrations: -1, total_customers: -1 })
    .limit(20)
    .select("name agent_id average_rating total_registrations total_customers location specialization")
    .lean();
  return res.json(
    agents.map((item, index) => ({
      rank: index + 1,
      name: item.name,
      agentId: item.agent_id,
      averageRating: item.average_rating,
      totalRegistrations: item.total_registrations,
      totalCustomers: item.total_customers,
      location: item.location,
      specialization: item.specialization
    }))
  );
});

router.get("/:agentId/public", async (req, res) => {
  const profile = await AgentProfile.findOne({ agent_id: req.params.agentId })
    .select("name agent_id phone location specialization average_rating total_customers total_registrations profile_photo is_verified")
    .lean();
  if (!profile) return res.status(404).json({ message: "Agent not found" });

  const recentRegistrations = await RegisteredProduct.find({ agent_id: profile._id, warranty_completed: true })
    .sort({ created_at: -1 })
    .limit(5)
    .select("product_name brand product_category purchase_date")
    .lean();

  return res.json({
    id: String(profile._id),
    name: profile.name,
    agentId: profile.agent_id,
    phone: profile.phone,
    location: profile.location,
    specialization: profile.specialization,
    averageRating: profile.average_rating,
    totalCustomers: profile.total_customers,
    totalRegistrations: profile.total_registrations,
    profilePhoto: profile.profile_photo,
    isVerified: profile.is_verified,
    recentRegistrations: recentRegistrations.map((item) => ({
      productName: item.product_name,
      brand: item.brand,
      category: item.product_category,
      purchaseDate: item.purchase_date
    }))
  });
});

async function handleOwnProfile(req, res) {
  const profile = await getAgentByUserId(req.user.id);
  if (!profile) return res.status(404).json({ message: "Agent profile not found" });

  const recentRegistrations = await RegisteredProduct.find({ agent_id: profile._id, warranty_completed: true })
    .sort({ created_at: -1 })
    .limit(10)
    .select("registered_product_id customer_name customer_email product_name brand purchase_date product_category")
    .lean();
  const warrantyCount = await WarrantyRecord.countDocuments({ created_by_agent_id: profile._id });

  await recalculateAgentMetrics(profile._id);
  const refreshed = await AgentProfile.findById(profile._id).lean();

  return res.json({
    agent: {
      id: String(refreshed._id),
      name: refreshed.name,
      agentId: refreshed.agent_id,
      email: refreshed.email,
      phone: refreshed.phone,
      location: refreshed.location,
      specialization: refreshed.specialization,
      profilePhoto: refreshed.profile_photo,
      averageRating: refreshed.average_rating,
      totalCustomers: refreshed.total_customers,
      totalRegistrations: refreshed.total_registrations,
      verified: refreshed.is_verified
    },
    dashboard: {
      totalCustomersServed: refreshed.total_customers,
      totalWarrantiesRegistered: warrantyCount,
      averageRating: refreshed.average_rating,
      recentRegistrations: recentRegistrations.map((item) => ({
        id: String(item._id),
        registeredProductId: item.registered_product_id,
        customerName: item.customer_name,
        customerEmail: item.customer_email,
        productName: item.product_name,
        brand: item.brand,
        purchaseDate: item.purchase_date,
        category: item.product_category
      }))
    }
  });
}

router.get("/profile", requireAuth, requireRole("agent"), handleOwnProfile);
router.get("/profile/me", requireAuth, requireRole("agent"), handleOwnProfile);

async function handleOwnCustomers(req, res) {
  const profile = await getAgentByUserId(req.user.id);
  if (!profile) return res.status(404).json({ message: "Agent profile not found" });

  const products = await RegisteredProduct.find({ agent_id: profile._id })
    .sort({ created_at: -1 })
    .select("customer_name customer_phone customer_email product_name brand product_category purchase_date warranty_completed")
    .lean();

  const grouped = new Map();
  for (const row of products) {
    if (!row.warranty_completed) continue;
    const key = (row.customer_email || row.customer_phone || row.customer_name).toLowerCase();
    const current = grouped.get(key) || {
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      customerEmail: row.customer_email,
      totalProducts: 0,
      lastPurchaseDate: row.purchase_date,
      categories: new Set()
    };
    current.totalProducts += 1;
    current.categories.add(row.product_category);
    if (row.purchase_date && (!current.lastPurchaseDate || new Date(row.purchase_date) > new Date(current.lastPurchaseDate))) {
      current.lastPurchaseDate = row.purchase_date;
    }
    grouped.set(key, current);
  }

  return res.json(
    [...grouped.values()].map((item) => ({
      customerName: item.customerName,
      customerPhone: item.customerPhone,
      customerEmail: item.customerEmail,
      totalProducts: item.totalProducts,
      lastPurchaseDate: item.lastPurchaseDate,
      categories: [...item.categories]
    }))
  );
}

router.get("/customers", requireAuth, requireRole("agent"), handleOwnCustomers);
router.get("/customers/me", requireAuth, requireRole("agent"), handleOwnCustomers);

router.post("/register-product", requireAuth, requireRole("agent"), async (req, res) => {
  const parsed = registerProductSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
  const profile = await getAgentByUserId(req.user.id);
  if (!profile) return res.status(404).json({ message: "Agent profile not found" });

  const data = parsed.data;
  const linkedUser = await User.findOne({ email: data.customerEmail, role: "user" }).select("_id").lean();

  const created = await RegisteredProduct.create({
    registered_product_id: await generateRegisteredProductId(),
    customer_name: data.customerName,
    customer_phone: data.customerPhone,
    customer_email: data.customerEmail,
    product_name: data.productName,
    brand: data.brand,
    model_number: data.modelNumber,
    serial_number: data.serialNumber,
    purchase_date: new Date(data.purchaseDate),
    invoice_number: data.invoiceNumber,
    purchase_store: data.purchaseStore,
    product_category: data.productCategory,
    proof_type: data.proofType,
    purchase_proof_url: data.purchaseProofUrl,
    warranty_completed: false,
    agent_id: profile._id,
    user_id: linkedUser?._id || null
  });

  return res.status(201).json({
    id: String(created._id),
    registeredProductId: created.registered_product_id,
    customerName: created.customer_name,
    productName: created.product_name,
    userLinked: Boolean(linkedUser?._id),
    message: linkedUser?._id
      ? "Product registered. Complete warranty details to activate it for dashboards."
      : "Product registered. Complete warranty details and let customer claim after registration."
  });
});

router.post("/upload-proof", requireAuth, requireRole("agent"), proofUpload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "File is required" });
  return res.status(201).json({
    url: `/uploads/${req.file.filename}`,
    fileName: req.file.filename
  });
});

export default router;
