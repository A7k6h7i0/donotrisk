import express from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { AgentReview } from "../models/AgentReview.js";
import { AgentProfile } from "../models/AgentProfile.js";
import { recalculateAgentMetrics } from "../services/agentMetrics.js";

const router = express.Router();

const addReviewSchema = z.object({
  agentId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  review: z.string().max(1500).optional().default(""),
  serviceSpeed: z.coerce.number().int().min(1).max(5),
  agentBehavior: z.coerce.number().int().min(1).max(5),
  documentationQuality: z.coerce.number().int().min(1).max(5)
});

router.post("/add", requireAuth, async (req, res) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Only users can submit reviews." });
  }

  const parsed = addReviewSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.message });

  const { agentId, rating, review, serviceSpeed, agentBehavior, documentationQuality } = parsed.data;
  const agent = await AgentProfile.findOne({ agent_id: agentId }).select("_id").lean();
  if (!agent) return res.status(404).json({ message: "Agent not found" });

  const created = await AgentReview.create({
    agent_id: agent._id,
    user_id: req.user.id,
    rating,
    review,
    service_speed: serviceSpeed,
    agent_behavior: agentBehavior,
    documentation_quality: documentationQuality
  });

  const metrics = await recalculateAgentMetrics(agent._id);

  return res.status(201).json({
    id: String(created._id),
    rating: created.rating,
    averageRating: metrics.averageRating
  });
});

router.get("/:agentId", async (req, res) => {
  const agent = await AgentProfile.findOne({ agent_id: req.params.agentId })
    .select("name agent_id average_rating total_customers total_registrations")
    .lean();
  if (!agent) return res.status(404).json({ message: "Agent not found" });

  const reviews = await AgentReview.find({ agent_id: agent._id })
    .sort({ created_at: -1 })
    .select("rating review service_speed agent_behavior documentation_quality created_at")
    .populate("user_id", "name")
    .lean();

  return res.json({
    agent: {
      name: agent.name,
      agentId: agent.agent_id,
      averageRating: agent.average_rating,
      totalCustomers: agent.total_customers,
      totalRegistrations: agent.total_registrations
    },
    reviews: reviews.map((item) => ({
      id: String(item._id),
      userName: item.user_id?.name || "User",
      rating: item.rating,
      review: item.review,
      serviceSpeed: item.service_speed,
      agentBehavior: item.agent_behavior,
      documentationQuality: item.documentation_quality,
      createdAt: item.created_at
    }))
  });
});

export default router;
