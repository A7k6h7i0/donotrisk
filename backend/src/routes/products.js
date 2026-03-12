import express from "express";
import { Product } from "../models/Product.js";
import { WarrantyDetail } from "../models/WarrantyDetail.js";
import { ProsCons } from "../models/ProsCons.js";

const router = express.Router();

// Default product images based on brand
function getDefaultProductImage(brand, productName) {
  const brandLower = (brand || "").toLowerCase();
  const nameLower = (productName || "").toLowerCase();
  
  // Brand-based placeholder (using brand initial as fallback)
  const brandInitial = brand?.charAt(0).toUpperCase() || "P";
  
  // Category-based emoji icons
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
  const products = await Product.find().populate("category_id", "name").sort({ created_at: -1 }).limit(100).lean();
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
      category_id: p.category_id ? String(p.category_id._id) : null,
      image: p.image || "",
      icon: defaultImg.icon,
      initial: defaultImg.initial
    };
  });
  return res.json(rows);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id).populate("category_id", "name").lean();
  if (!product) return res.status(404).json({ message: "Product not found" });

  const warranty = await WarrantyDetail.findOne({ product_id: id }).lean();
  const prosCons = await ProsCons.findOne({ product_id: id }).lean();
  
  const defaultImg = getDefaultProductImage(product.brand, product.name);

  return res.json({
    id: String(product._id),
    name: product.name,
    brand: product.brand,
    model_number: product.model_number,
    category_name: product.category_id?.name || "Product",
    category_id: product.category_id ? String(product.category_id._id) : null,
    description: product.description,
    release_date: product.release_date,
    risk_score: product.risk_score,
    risk_band: product.risk_band,
    image: product.image || "",
    icon: defaultImg.icon,
    initial: defaultImg.initial,
    warranty_details: warranty
      ? {
          duration_months: warranty.duration_months,
          coverage_type: warranty.coverage_type,
          start_conditions: warranty.start_conditions,
          registration_requirements: warranty.registration_requirements,
          claim_process: warranty.claim_process,
          validity_conditions: warranty.validity_conditions,
          void_conditions: warranty.void_conditions
        }
      : null,
    pros_cons: prosCons ? { pros: prosCons.pros, cons: prosCons.cons } : null,
    service_centers: []
  });
});

export default router;
