import express from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { WarrantyRecord } from "../models/WarrantyRecord.js";
import { RegisteredProduct } from "../models/RegisteredProduct.js";
import { AgentProfile } from "../models/AgentProfile.js";
import { recalculateAgentMetrics } from "../services/agentMetrics.js";

const router = express.Router();

const addWarrantySchema = z.object({
  productId: z.string().min(1),
  totalWarranty: z.string().trim().min(2),
  components: z
    .array(z.object({ component: z.string().trim().min(1), duration: z.string().trim().min(1) }))
    .min(1),
  notes: z.string().optional().default(""),
  expiryDate: z.string().trim().min(4)
});

router.post("/add", requireAuth, async (req, res) => {
  if (!["agent", "admin"].includes(req.user.role)) {
    return res.status(403).json({ message: "Only agent or admin can add warranty records." });
  }

  const parsed = addWarrantySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.message });

  const { productId, totalWarranty, components, notes, expiryDate } = parsed.data;
  const product = await RegisteredProduct.findOne({
    $or: [{ _id: productId }, { registered_product_id: productId }]
  }).lean();
  if (!product) return res.status(404).json({ message: "Registered product not found" });

  let agentProfileId = product.agent_id;
  if (req.user.role === "agent") {
    const agent = await AgentProfile.findOne({ user_id: req.user.id }).select("_id").lean();
    if (!agent) return res.status(404).json({ message: "Agent profile not found" });
    if (String(agent._id) !== String(product.agent_id)) {
      return res.status(403).json({ message: "You can only add warranty for your registered products." });
    }
    agentProfileId = agent._id;
  }

  const warranty = await WarrantyRecord.findOneAndUpdate(
    { product_id: product._id },
    {
      product_id: product._id,
      total_warranty: totalWarranty,
      components,
      notes,
      expiry_date: new Date(expiryDate),
      created_by_agent_id: agentProfileId,
      certificate_issued: true
    },
    { upsert: true, new: true }
  ).lean();

  await RegisteredProduct.findByIdAndUpdate(product._id, {
    warranty_completed: true,
    digital_certificate_url: `/api/warranty/${String(product._id)}`
  });
  await recalculateAgentMetrics(agentProfileId);

  return res.status(201).json({
    id: String(warranty._id),
    productId: String(warranty.product_id),
    totalWarranty: warranty.total_warranty,
    components: warranty.components
  });
});

router.get("/:productId", requireAuth, async (req, res) => {
  const product = await RegisteredProduct.findOne({
    $or: [{ _id: req.params.productId }, { registered_product_id: req.params.productId }]
  }).lean();
  if (!product) return res.status(404).json({ message: "Registered product not found" });

  if (req.user.role === "user" && String(product.user_id || "") !== req.user.id) {
    return res.status(403).json({ message: "You can only view warranties linked to your account." });
  }
  if (req.user.role === "agent") {
    const agent = await AgentProfile.findOne({ user_id: req.user.id }).select("_id").lean();
    if (!agent || String(product.agent_id) !== String(agent._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  const warranty = await WarrantyRecord.findOne({ product_id: product._id }).lean();
  if (!warranty) return res.status(404).json({ message: "Warranty not found" });

  return res.json({
    productId: String(warranty.product_id),
    totalWarranty: warranty.total_warranty,
    components: warranty.components,
    notes: warranty.notes,
    expiryDate: warranty.expiry_date,
    certificateIssued: warranty.certificate_issued
  });
});

export default router;
