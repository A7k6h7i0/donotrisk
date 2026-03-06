import mongoose from "mongoose";

const agentProfileSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    name: { type: String, required: true },
    agent_id: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    specialization: { type: String, default: "" },
    profile_photo: { type: String, default: "" },
    is_verified: { type: Boolean, default: false },
    total_customers: { type: Number, default: 0 },
    total_registrations: { type: Number, default: 0 },
    average_rating: { type: Number, default: 0 },
    fraud_flags: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const AgentProfile = mongoose.model("AgentProfile", agentProfileSchema);
