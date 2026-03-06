import express from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { ReturnRecord } from "../models/ReturnRecord.js";
import { AgentProfile } from "../models/AgentProfile.js";
import { RegisteredProduct } from "../models/RegisteredProduct.js";

const router = express.Router();

const addReturnSchema = z.object({
  productId: z.string().min(1),
  productType: z.string().min(2),
  company: z.string().min(2),
  returnDate: z.string().min(4),
  location: z.string().min(2),
  employeeName: z.string().optional().default(""),
  returnMethod: z.string().min(2),
  notes: z.string().optional().default(""),
  receiptAvailable: z.boolean().default(false),
  proofType: z.enum(["image", "store_location", "agent_confirmation"]),
  proofUrl: z.string().optional().default("")
});

router.post("/add", requireAuth, requireRole("agent"), async (req, res) => {
  const parsed = addReturnSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.message });

  const agent = await AgentProfile.findOne({ user_id: req.user.id }).select("_id").lean();
  if (!agent) return res.status(404).json({ message: "Agent profile not found" });
  const product = await RegisteredProduct.findById(parsed.data.productId).select("_id agent_id").lean();
  if (!product) return res.status(404).json({ message: "Registered product not found" });
  if (String(product.agent_id) !== String(agent._id)) {
    return res.status(403).json({ message: "You can only add returns for your registered products." });
  }

  const record = await ReturnRecord.create({
    product_id: parsed.data.productId,
    product_type: parsed.data.productType,
    company: parsed.data.company,
    return_date: new Date(parsed.data.returnDate),
    location: parsed.data.location,
    employee_name: parsed.data.employeeName,
    return_method: parsed.data.returnMethod,
    notes: parsed.data.notes,
    receipt_available: parsed.data.receiptAvailable,
    proof_type: parsed.data.proofType,
    proof_url: parsed.data.proofUrl,
    agent_id: agent._id
  });

  return res.status(201).json({
    id: String(record._id),
    productId: String(record.product_id),
    status: record.status
  });
});

router.get("/:productId", requireAuth, async (req, res) => {
  const product = await RegisteredProduct.findById(req.params.productId).select("_id user_id agent_id").lean();
  if (!product) return res.status(404).json({ message: "Registered product not found" });
  if (req.user.role === "user" && String(product.user_id || "") !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }
  if (req.user.role === "agent") {
    const agent = await AgentProfile.findOne({ user_id: req.user.id }).select("_id").lean();
    if (!agent || String(product.agent_id) !== String(agent._id)) return res.status(403).json({ message: "Forbidden" });
  }

  const records = await ReturnRecord.find({ product_id: req.params.productId }).sort({ created_at: -1 }).lean();
  return res.json(
    records.map((item) => ({
      id: String(item._id),
      company: item.company,
      productType: item.product_type,
      returnDate: item.return_date,
      location: item.location,
      employeeName: item.employee_name,
      returnMethod: item.return_method,
      status: item.status,
      receiptAvailable: item.receipt_available,
      notes: item.notes,
      proofType: item.proof_type,
      proofUrl: item.proof_url
    }))
  );
});

export default router;
