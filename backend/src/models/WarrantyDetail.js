import mongoose from "mongoose";

const warrantyDetailSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, unique: true, index: true },
    duration_months: { type: Number, required: true },
    coverage_type: { type: String, required: true },
    start_conditions: { type: String, required: true },
    registration_requirements: { type: String, required: true },
    claim_process: { type: String, required: true },
    validity_conditions: { type: String, required: true },
    void_conditions: { type: String, required: true }
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export const WarrantyDetail = mongoose.model("WarrantyDetail", warrantyDetailSchema);
