import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null }
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

categorySchema.index({ name: 1, parent_id: 1 }, { unique: true });

export const Category = mongoose.model("Category", categorySchema);
