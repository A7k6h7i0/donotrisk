import express from "express";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";

const router = express.Router();

// Default icons for categories based on name
function getDefaultIcon(categoryName) {
  const name = categoryName.toLowerCase();
  
  const iconMap = {
    "electronics": "📱",
    "mobile": "📱",
    "smartphone": "📱",
    "laptop": "💻",
    "computer": "💻",
    "tablet": "📲",
    "tv": "📺",
    "television": "📺",
    "smart tv": "📺",
    "washing machine": "🧺",
    "refrigerator": "🧊",
    "fridge": "🧊",
    "air conditioner": "❄️",
    "ac": "❄️",
    "microwave": "🍳",
    "oven": "🍳",
    " dishwasher": "🍽️",
    "vacuum": "🧹",
    "fan": "🌀",
    "heater": "🔥",
    "camera": "📷",
    "headphone": "🎧",
    "speaker": "🔊",
    "router": "📡",
    "modem": "📡",
    "printer": "🖨️",
    "watch": "⌚",
    "smartwatch": "⌚",
    "vehicle": "🚗",
    "car": "🚗",
    "bike": "🏍️",
    "motorcycle": "🏍️",
    "furniture": "🪑",
    "jewelry": "💎",
    "fitness": "💪",
    "gym": "💪",
    "sports": "⚽",
    "toy": "🧸",
    "game": "🎮",
    "gaming": "🎮",
    "book": "📚",
    "software": "💿",
    "appliance": "🔌"
  };

  for (const [key, icon] of Object.entries(iconMap)) {
    if (name.includes(key)) return icon;
  }
  
  return "📦"; // Default icon
}

// Default product images based on brand and name
function getDefaultProductImage(brand, productName) {
  const brandLower = (brand || "").toLowerCase();
  const nameLower = (productName || "").toLowerCase();
  
  const brandInitial = brand?.charAt(0).toUpperCase() || "P";
  
  if (nameLower.includes("phone") || nameLower.includes("mobile") || nameLower.includes("smartphone")) {
    return { icon: "📱", initial: brandInitial };
  }
  if (nameLower.includes("laptop") || nameLower.includes("notebook") || nameLower.includes("computer")) {
    return { icon: "💻", initial: brandInitial };
  }
  if (nameLower.includes("tv") || nameLower.includes("television") || nameLower.includes("smart tv")) {
    return { icon: "📺", initial: brandInitial };
  }
  if (nameLower.includes("washing machine") || nameLower.includes("washer")) {
    return { icon: "🧺", initial: brandInitial };
  }
  if (nameLower.includes("refrigerator") || nameLower.includes("fridge")) {
    return { icon: "🧊", initial: brandInitial };
  }
  if (nameLower.includes("air conditioner") || nameLower.includes("ac ")) {
    return { icon: "❄️", initial: brandInitial };
  }
  if (nameLower.includes("headphone") || nameLower.includes("earphone")) {
    return { icon: "🎧", initial: brandInitial };
  }
  if (nameLower.includes("speaker") || nameLower.includes("audio")) {
    return { icon: "🔊", initial: brandInitial };
  }
  if (nameLower.includes("camera")) {
    return { icon: "📷", initial: brandInitial };
  }
  if (nameLower.includes("watch") || nameLower.includes("smartwatch")) {
    return { icon: "⌚", initial: brandInitial };
  }
  if (nameLower.includes("router") || nameLower.includes("modem")) {
    return { icon: "📡", initial: brandInitial };
  }
  if (nameLower.includes("printer")) {
    return { icon: "🖨️", initial: brandInitial };
  }
  if (nameLower.includes("microwave") || nameLower.includes("oven")) {
    return { icon: "🍳", initial: brandInitial };
  }
  
  return { icon: "📦", initial: brandInitial };
}

router.get("/", async (_req, res) => {
  const categories = await Category.find().lean();
  const map = new Map(categories.map((c) => [String(c._id), c.name]));
  const rows = categories
    .map((c) => ({
      id: String(c._id),
      name: c.name,
      parent_id: c.parent_id ? String(c.parent_id) : null,
      parent_name: c.parent_id ? map.get(String(c.parent_id)) || null : null,
      icon: c.icon || getDefaultIcon(c.name),
      image: c.image || ""
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

  const rows = products.map((p) => {
    const defaultImg = getDefaultProductImage(p.brand, p.name);
    return {
      id: String(p._id),
      name: p.name,
      brand: p.brand,
      model_number: p.model_number,
      description: p.description,
      release_date: p.release_date,
      risk_score: p.risk_score,
      risk_band: p.risk_band,
      category_name: p.category_id?.name || "Product",
      image: p.image || "",
      icon: defaultImg.icon,
      initial: defaultImg.initial
    };
  });

  return res.json(rows);
});

export default router;
