import mongoose from "mongoose";

const warrantyComponentSchema = new mongoose.Schema(
  {
    component: { type: String, required: true },
    duration: { type: String, required: true }
  },
  { _id: false }
);

const warrantyRecordSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "RegisteredProduct", required: true, unique: true, index: true },
    total_warranty: { type: String, required: true },
    components: { type: [warrantyComponentSchema], default: [] },
    notes: { type: String, default: "" },
    expiry_date: { type: Date, default: null },
    certificate_issued: { type: Boolean, default: false },
    created_by_agent_id: { type: mongoose.Schema.Types.ObjectId, ref: "AgentProfile", required: true, index: true }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const WarrantyRecord = mongoose.model("WarrantyRecord", warrantyRecordSchema);
