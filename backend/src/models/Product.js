import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    model_number: { type: String, required: true, unique: true, index: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String, required: true },
    release_date: { type: Date, required: true },
    servicing_frequency_per_year: { type: Number, default: 0 },
    warranty_complexity: { type: Number, default: 5 },
    failure_rate: { type: Number, default: 5 },
    claim_success_probability: { type: Number, default: 50 },
    risk_score: { type: Number, default: 0 },
    risk_band: { type: String, default: "Low" }
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export const Product = mongoose.model("Product", productSchema);
