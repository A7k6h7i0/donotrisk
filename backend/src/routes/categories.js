import express from "express";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const categories = await Category.find().lean();
  const map = new Map(categories.map((c) => [String(c._id), c.name]));
  const rows = categories
    .map((c) => ({
      id: String(c._id),
      name: c.name,
      parent_id: c.parent_id ? String(c.parent_id) : null,
      parent_name: c.parent_id ? map.get(String(c.parent_id)) || null : null
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return res.json(rows);
});

async function getDescendantCategoryIds(rootId) {
  const ids = [rootId];
  const queue = [rootId];
  while (queue.length) {
    const current = queue.shift();
    const children = await Category.find({ parent_id: current }).select("_id").lean();
    for (const child of children) {
      const id = String(child._id);
      ids.push(id);
      queue.push(id);
    }
  }
  return ids;
}

router.get("/:id/products", async (req, res) => {
  const id = req.params.id;
  const category = await Category.findById(id).select("_id");
  if (!category) return res.status(404).json({ message: "Category not found" });

  const categoryIds = await getDescendantCategoryIds(String(category._id));
  const products = await Product.find({ category_id: { $in: categoryIds } }).populate("category_id", "name").sort({ name: 1 }).lean();

  const rows = products.map((p) => ({
    id: String(p._id),
    name: p.name,
    brand: p.brand,
    model_number: p.model_number,
    description: p.description,
    release_date: p.release_date,
    risk_score: p.risk_score,
    risk_band: p.risk_band,
    category_name: p.category_id?.name || "Product"
  }));

  return res.json(rows);
});

export default router;
