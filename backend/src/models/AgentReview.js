import mongoose from "mongoose";

const agentReviewSchema = new mongoose.Schema(
  {
    agent_id: { type: mongoose.Schema.Types.ObjectId, ref: "AgentProfile", required: true, index: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, default: "" },
    service_speed: { type: Number, default: 0, min: 0, max: 5 },
    agent_behavior: { type: Number, default: 0, min: 0, max: 5 },
    documentation_quality: { type: Number, default: 0, min: 0, max: 5 },
    is_moderated: { type: Boolean, default: false }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

agentReviewSchema.index({ agent_id: 1, user_id: 1, created_at: -1 });

export const AgentReview = mongoose.model("AgentReview", agentReviewSchema);
