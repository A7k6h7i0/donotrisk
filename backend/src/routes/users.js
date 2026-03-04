import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { ScannedWarranty } from "../models/ScannedWarranty.js";

const router = express.Router();

router.get("/me/warranties", requireAuth, async (req, res) => {
  const rows = await ScannedWarranty.find({ user_id: req.user.id })
    .populate("product_id", "name brand model_number risk_score risk_band")
    .sort({ expiry_date: 1 })
    .lean();

  return res.json(
    rows.map((r) => ({
      id: String(r._id),
      serial_number: r.serial_number,
      purchase_date: r.purchase_date,
      expiry_date: r.expiry_date,
      created_at: r.created_at,
      product_name: r.product_id?.name || null,
      brand: r.product_id?.brand || null,
      model_number: r.product_id?.model_number || null,
      risk_score: r.product_id?.risk_score || null,
      risk_band: r.product_id?.risk_band || null
    }))
  );
});

export default router;
