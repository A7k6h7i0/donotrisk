import mongoose from "mongoose";

const returnRecordSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "RegisteredProduct", required: true, index: true },
    product_type: { type: String, required: true },
    company: { type: String, required: true },
    return_date: { type: Date, required: true },
    location: { type: String, required: true },
    employee_name: { type: String, default: "" },
    return_method: { type: String, default: "" },
    status: { type: String, default: "Returned" },
    receipt_available: { type: Boolean, default: false },
    notes: { type: String, default: "" },
    proof_type: { type: String, enum: ["image", "store_location", "agent_confirmation"], required: true },
    proof_url: { type: String, default: "" },
    agent_id: { type: mongoose.Schema.Types.ObjectId, ref: "AgentProfile", required: true, index: true }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const ReturnRecord = mongoose.model("ReturnRecord", returnRecordSchema);
