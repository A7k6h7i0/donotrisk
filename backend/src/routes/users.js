import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { ScannedWarranty } from "../models/ScannedWarranty.js";
import { RegisteredProduct } from "../models/RegisteredProduct.js";
import { WarrantyRecord } from "../models/WarrantyRecord.js";
import { AgentProfile } from "../models/AgentProfile.js";

const router = express.Router();

router.get("/me/warranties", requireAuth, async (req, res) => {
  const scannedRows = await ScannedWarranty.find({ user_id: req.user.id })
    .populate("product_id", "name brand model_number risk_score risk_band")
    .sort({ expiry_date: 1 })
    .lean();

  const registeredProducts = await RegisteredProduct.find({ user_id: req.user.id, warranty_completed: true })
    .sort({ created_at: -1 })
    .populate("agent_id", "name agent_id phone")
    .lean();
  const warrantyRows = await WarrantyRecord.find({ product_id: { $in: registeredProducts.map((x) => x._id) } }).lean();
  const warrantyMap = new Map(warrantyRows.map((item) => [String(item.product_id), item]));

  const scanned = scannedRows.map((r) => ({
    id: String(r._id),
    serial_number: r.serial_number,
    purchase_date: r.purchase_date,
    expiry_date: r.expiry_date,
    created_at: r.created_at,
    product_name: r.product_id?.name || null,
    brand: r.product_id?.brand || null,
    model_number: r.product_id?.model_number || null,
    risk_score: r.product_id?.risk_score || null,
    risk_band: r.product_id?.risk_band || null,
    source: "scanned"
  }));

  const registered = registeredProducts.map((item) => {
    const warranty = warrantyMap.get(String(item._id));
    return {
      id: String(item._id),
      registered_product_id: item.registered_product_id,
      serial_number: item.serial_number,
      purchase_date: item.purchase_date,
      expiry_date: warranty?.expiry_date || null,
      created_at: item.created_at,
      product_name: item.product_name,
      brand: item.brand,
      model_number: item.model_number,
      risk_score: item.fraud_risk_score || 0,
      risk_band: item.fraud_risk_score > 70 ? "High" : item.fraud_risk_score > 40 ? "Moderate" : "Low",
      source: "agent_registered",
      agent_name: item.agent_id?.name || null,
      agent_id: item.agent_id?.agent_id || null,
      agent_phone: item.agent_id?.phone || null,
      total_warranty: warranty?.total_warranty || null
    };
  });

  return res.json([...registered, ...scanned]);
});

router.get("/me/registered-products", requireAuth, async (req, res) => {
  const rows = await RegisteredProduct.find({ user_id: req.user.id, warranty_completed: true })
    .sort({ created_at: -1 })
    .populate("agent_id", "name agent_id location phone")
    .lean();
  const warranties = await WarrantyRecord.find({ product_id: { $in: rows.map((x) => x._id) } }).lean();
  const warrantyMap = new Map(warranties.map((item) => [String(item.product_id), item]));
  const agentIds = [...new Set(rows.map((x) => String(x.agent_id?._id || x.agent_id)).filter(Boolean))];
  const agentProfiles = await AgentProfile.find({ _id: { $in: agentIds } }).select("_id average_rating").lean();
  const ratingMap = new Map(agentProfiles.map((item) => [String(item._id), item.average_rating]));

  return res.json(
    rows.map((item) => {
      const warranty = warrantyMap.get(String(item._id));
      return {
        id: String(item._id),
        registeredProductId: item.registered_product_id,
        productName: item.product_name,
        brand: item.brand,
        modelNumber: item.model_number,
        serialNumber: item.serial_number,
        purchaseDate: item.purchase_date,
        invoiceNumber: item.invoice_number,
        category: item.product_category,
        warranty: warranty
          ? {
              totalWarranty: warranty.total_warranty,
              components: warranty.components,
              expiryDate: warranty.expiry_date
            }
          : null,
        agent: {
          name: item.agent_id?.name || null,
          agentId: item.agent_id?.agent_id || null,
          location: item.agent_id?.location || null,
          phone: item.agent_id?.phone || null,
          averageRating: ratingMap.get(String(item.agent_id?._id || item.agent_id)) || 0
        }
      };
    })
  );
});

export default router;
