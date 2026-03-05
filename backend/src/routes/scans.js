import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import axios from "axios";
import { requireAuth } from "../middleware/auth.js";
import { extractFromWarrantyFile } from "../services/ocrClient.js";
import { Product } from "../models/Product.js";
import { ScannedWarranty } from "../models/ScannedWarranty.js";
import { env } from "../config/env.js";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    }
  }),
  limits: { fileSize: env.maxUploadMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    cb(null, allowed.includes(file.mimetype));
  }
});

const KNOWN_BRANDS = [
  "LG",
  "Samsung",
  "Sony",
  "Bosch",
  "Whirlpool",
  "Haier",
  "Godrej",
  "Panasonic",
  "Philips",
  "Lenovo",
  "HP",
  "Dell",
  "Asus"
];

function detectFileKindFromBuffer(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 4) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "jpg";
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return "png";
  if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) return "pdf";
  return null;
}

function detectFileKindFromUrl(url) {
  const pathname = new URL(url).pathname.toLowerCase();
  if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) return "jpg";
  if (pathname.endsWith(".png")) return "png";
  if (pathname.endsWith(".pdf")) return "pdf";
  return null;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeModel(model) {
  return String(model || "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

function normalizeOcrText(raw) {
  return String(raw || "")
    .replace(/[¢Ç]/g, "C")
    .replace(/[§$]/g, "S")
    .replace(/[|]/g, "I")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeToken(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9/\-]/g, "")
    .replace(/\/\/+/, "/")
    .trim();
}

function isValidModel(value) {
  return Boolean(value && value.length >= 6 && /[A-Z]/.test(value) && /\d/.test(value));
}

function isValidSerial(value) {
  return Boolean(value && value.length >= 10 && /^[A-Z0-9]+$/.test(value) && /[A-Z]/.test(value) && /\d/.test(value));
}

function detectBrand(text) {
  const low = text.toLowerCase();
  return KNOWN_BRANDS.find((brand) => low.includes(brand.toLowerCase())) || null;
}

function detectProductName(text) {
  const low = text.toLowerCase();
  if (low.includes("refrigerator") || low.includes("fridge")) return "Refrigerator";
  if (low.includes("washing machine")) return "Washing Machine";
  if (low.includes("air conditioner") || low.includes(" ac ")) return "Air Conditioner";
  if (low.includes("microwave")) return "Microwave";
  if (low.includes("laptop") || low.includes("notebook")) return "Laptop";
  if (low.includes("television") || low.includes(" smart tv") || low.includes(" tv ")) return "Television";
  return null;
}

function extractFromRawText(extracted) {
  const rawText = normalizeOcrText(extracted?.raw_text || "");
  if (!rawText) return extracted;

  const merged = { ...extracted };

  if (!merged.brand) {
    merged.brand = detectBrand(rawText);
  }

  const productFromText = detectProductName(` ${rawText.toLowerCase()} `);
  if (productFromText) {
    merged.product_name = productFromText;
  } else if (merged.product_name) {
    const cleanedProduct = String(merged.product_name).replace(/[^a-zA-Z ]/g, " ").replace(/\s+/g, " ").trim();
    merged.product_name = detectProductName(` ${cleanedProduct.toLowerCase()} `) || null;
  }

  const currentModel = sanitizeToken(merged.model_number || "");
  merged.model_number = isValidModel(currentModel) ? currentModel : null;

  if (!merged.model_number) {
    const modelLabel = rawText.match(/MODEL(?:\s*NUMBER|\s*NO|\s*\/\s*MODELE)?[^A-Z0-9]{0,20}([A-Z0-9¢Ç\-\s\/]{6,30})/i);
    if (modelLabel?.[1]) {
      const parsed = sanitizeToken(modelLabel[1]).replace(/\s+/g, "");
      if (isValidModel(parsed)) merged.model_number = parsed;
    }
  }

  if (!merged.model_number) {
    const generalModel = rawText.match(/\b[A-Z]{2,}[A-Z0-9]{4,}(?:\s*\/\s*[A-Z0-9]{1,4})?\b/);
    if (generalModel?.[0]) {
      const parsed = sanitizeToken(generalModel[0]).replace(/\s+/g, "");
      if (isValidModel(parsed)) merged.model_number = parsed;
    }
  }

  const currentSerial = sanitizeToken(merged.serial_number || "");
  merged.serial_number = isValidSerial(currentSerial) ? currentSerial : null;

  if (!merged.serial_number) {
    const serialLabel = rawText.match(/SER(?:IAL)?(?:\s*NO|\s*NUMBER)?[^A-Z0-9]{0,20}([A-Z0-9]{10,20})/i);
    if (serialLabel?.[1]) {
      const parsed = sanitizeToken(serialLabel[1]);
      if (isValidSerial(parsed)) merged.serial_number = parsed;
    }
  }

  if (!merged.serial_number) {
    const serialGeneric = rawText.match(/\b[A-Z0-9]{10,15}\b/);
    if (serialGeneric?.[0]) {
      const parsed = sanitizeToken(serialGeneric[0]);
      if (isValidSerial(parsed)) merged.serial_number = parsed;
    }
  }

  if (!merged.production_date) {
    const prodNearLabel = rawText.match(/(PRODUCTION|MFG|MANUFACTURED)[^0-9]{0,20}((?:19|20)\d{2})/i);
    if (prodNearLabel?.[2]) merged.production_date = prodNearLabel[2];
  }

  if (!merged.production_date) {
    const year = rawText.match(/\b(?:19|20)\d{2}\b/);
    if (year?.[0]) merged.production_date = year[0];
  }

  if (!merged.warranty_duration) {
    const warranty = rawText.match(/\b(\d+)\s*(year|years|month|months)\b/i);
    if (warranty?.[1]) merged.warranty_duration = `${warranty[1]} ${warranty[2].toLowerCase()}`;
  }

  merged.quality = merged.model_number && merged.serial_number ? "good" : merged.model_number || merged.serial_number ? "moderate" : "low";
  if (!merged.scan_quality || merged.scan_quality === "low") merged.scan_quality = merged.quality;

  return merged;
}

function inferValidation(extracted, match) {
  const warnings = [];
  if (!extracted.model_number) warnings.push("Model number missing");
  if (!extracted.serial_number) warnings.push("Serial number missing");
  if (!extracted.brand) warnings.push("Brand missing");
  if (!match) warnings.push("No product matched by model/brand");

  return {
    is_valid: warnings.length <= 1,
    warnings
  };
}

async function matchProduct(extracted) {
  const model = String(extracted.model_number || "").trim();
  const brand = String(extracted.brand || "").trim();
  const productName = String(extracted.product_name || "").trim();
  const normalizedModel = normalizeModel(model);

  let match = null;

  if (model && brand) {
    match = await Product.findOne({
      model_number: new RegExp(`^${escapeRegex(model)}$`, "i"),
      brand: new RegExp(`^${escapeRegex(brand)}$`, "i")
    }).select("_id name brand model_number risk_score risk_band");
  }

  if (!match && model) {
    match = await Product.findOne({
      model_number: new RegExp(`^${escapeRegex(model)}$`, "i")
    }).select("_id name brand model_number risk_score risk_band");
  }

  if (!match && normalizedModel) {
    const candidates = await Product.find(brand ? { brand: new RegExp(escapeRegex(brand), "i") } : {})
      .select("_id name brand model_number risk_score risk_band")
      .lean();

    match =
      candidates.find((candidate) => {
        const cm = normalizeModel(candidate.model_number);
        return cm === normalizedModel || cm.startsWith(normalizedModel) || normalizedModel.startsWith(cm);
      }) || null;
  }

  if (!match && productName) {
    match = await Product.findOne({
      name: new RegExp(escapeRegex(productName), "i"),
      ...(brand ? { brand: new RegExp(escapeRegex(brand), "i") } : {})
    }).select("_id name brand model_number risk_score risk_band");
  }

  return match;
}

function formatScanResponse(extracted, match) {
  return {
    extracted,
    matched_product: match
      ? {
          id: String(match._id),
          name: match.name,
          brand: match.brand,
          model_number: match.model_number,
          risk_score: match.risk_score,
          risk_band: match.risk_band
        }
      : null,
    validation: inferValidation(extracted, match)
  };
}

function mapOcrFailure(error) {
  const status = Number(error?.response?.status || 0);
  const message = String(error?.message || "");
  const detail =
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    message ||
    "Unable to read document. Upload a clearer image/PDF.";

  // OCR parsing/content errors should stay user-correctable 422 responses,
  // even if upstream failed to include a status code in some environments.
  if (/OCR failed:/i.test(detail) || /Unable to read document/i.test(detail)) {
    return { status: 422, message: detail };
  }

  if (status === 400 || status === 422) {
    return { status: 422, message: detail };
  }

  const infraError = /ECONNREFUSED|ENOTFOUND|ETIMEDOUT|socket hang up|status code 50[234]/i.test(
    `${detail} ${message}`
  );
  if (status >= 500 || infraError || !status) {
    return {
      status: 502,
      message: `OCR service unavailable. Verify OCR_SERVICE_URL and OCR deployment. Detail: ${detail}`
    };
  }

  return { status: 422, message: detail };
}

router.post("/extract", requireAuth, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "File required" });

  let extracted;
  try {
    extracted = await extractFromWarrantyFile(req.file.path, req.file.originalname, req.file.mimetype);
  } catch (error) {
    const mapped = mapOcrFailure(error);
    return res.status(mapped.status).json({ message: mapped.message });
  }

  const enriched = extractFromRawText(extracted);
  const match = await matchProduct(enriched);
  return res.json(formatScanResponse(enriched, match));
});

router.post("/extract-url", requireAuth, async (req, res) => {
  const { url } = req.body || {};
  if (!url || typeof url !== "string") return res.status(400).json({ message: "Valid URL is required" });

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({ message: "Invalid URL format" });
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return res.status(400).json({ message: "Only http/https URLs are allowed" });
  }

  const tempName = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const tempPathBase = path.join(uploadDir, tempName);

  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 30000,
      maxContentLength: env.maxUploadMb * 1024 * 1024
    });

    const contentType = String(response.headers["content-type"] || "").toLowerCase();
    const fileBuffer = Buffer.from(response.data);
    const kindFromHeader = contentType.includes("application/pdf")
      ? "pdf"
      : contentType.includes("image/png")
        ? "png"
        : contentType.includes("image/jpeg") || contentType.includes("image/jpg")
          ? "jpg"
          : null;
    const kindFromUrl = detectFileKindFromUrl(url);
    const kindFromBuffer = detectFileKindFromBuffer(fileBuffer);
    const fileKind = kindFromHeader || kindFromUrl || kindFromBuffer;

    if (!fileKind || !["jpg", "png", "pdf"].includes(fileKind)) {
      return res.status(400).json({ message: "URL must point to JPG/PNG/PDF file" });
    }

    const ext = fileKind === "pdf" ? ".pdf" : fileKind === "png" ? ".png" : ".jpg";
    const tempPath = `${tempPathBase}${ext}`;
    fs.writeFileSync(tempPath, fileBuffer);

    const extracted = await extractFromWarrantyFile(tempPath, `url-upload${ext}`, contentType);
    const enriched = extractFromRawText(extracted);
    const match = await matchProduct(enriched);

    try {
      fs.unlinkSync(tempPath);
    } catch {}

    return res.json(formatScanResponse(enriched, match));
  } catch (error) {
    const mapped = mapOcrFailure(error);
    return res.status(mapped.status).json({ message: mapped.message });
  }
});

router.post("/save", requireAuth, async (req, res) => {
  try {
    const {
      product_id,
      serial_number,
      purchase_date,
      expiry_date,
      raw_extracted_text,
      extracted_data,
      source_type
    } = req.body;

    const item = await ScannedWarranty.create({
      user_id: req.user.id,
      product_id: product_id || null,
      serial_number: serial_number || extracted_data?.serial_number || "",
      purchase_date: purchase_date || extracted_data?.purchase_date || null,
      expiry_date: expiry_date || null,
      raw_extracted_text: raw_extracted_text || extracted_data?.raw_text || "",
      brand: extracted_data?.brand || "",
      product_name: extracted_data?.product_name || "",
      model_number: extracted_data?.model_number || "",
      production_date: extracted_data?.production_date || null,
      warranty_duration: extracted_data?.warranty_duration || "",
      quality: extracted_data?.quality || "",
      scan_quality: extracted_data?.scan_quality || "",
      decoded_qr: Array.isArray(extracted_data?.decoded_qr) ? extracted_data.decoded_qr : [],
      decoded_barcodes: Array.isArray(extracted_data?.decoded_barcodes) ? extracted_data.decoded_barcodes : [],
      source_type: source_type || extracted_data?.source_type || "upload",
      extracted_data: extracted_data || {}
    });

    return res.status(201).json({
      id: String(item._id),
      user_id: String(item.user_id),
      product_id: item.product_id ? String(item.product_id) : null,
      serial_number: item.serial_number,
      purchase_date: item.purchase_date,
      expiry_date: item.expiry_date,
      raw_extracted_text: item.raw_extracted_text,
      quality: item.quality,
      source_type: item.source_type,
      created_at: item.created_at
    });
  } catch {
    return res.status(400).json({ message: "Unable to save scanned warranty. Please re-login and retry." });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  const rows = await ScannedWarranty.find({ user_id: req.user.id })
    .populate("product_id", "name brand model_number risk_score risk_band")
    .sort({ created_at: -1 })
    .lean();

  return res.json(
    rows.map((r) => ({
      id: String(r._id),
      user_id: String(r.user_id),
      product_id: r.product_id?._id ? String(r.product_id._id) : null,
      serial_number: r.serial_number,
      purchase_date: r.purchase_date,
      expiry_date: r.expiry_date,
      raw_extracted_text: r.raw_extracted_text,
      created_at: r.created_at,
      brand: r.brand || r.product_id?.brand || null,
      product_name: r.product_name || r.product_id?.name || null,
      model_number: r.model_number || r.product_id?.model_number || null,
      quality: r.quality || null,
      scan_quality: r.scan_quality || null,
      decoded_qr: r.decoded_qr || [],
      decoded_barcodes: r.decoded_barcodes || [],
      source_type: r.source_type || "upload",
      risk_score: r.product_id?.risk_score || null,
      risk_band: r.product_id?.risk_band || null
    }))
  );
});

export default router;

