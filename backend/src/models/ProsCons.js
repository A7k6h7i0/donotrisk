import mongoose from "mongoose";

const prosConsSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, unique: true, index: true },
    pros: { type: String, required: true },
    cons: { type: String, required: true }
  },
  { timestamps: false }
);

export const ProsCons = mongoose.model("ProsCons", prosConsSchema);
