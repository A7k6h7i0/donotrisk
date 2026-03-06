import express from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { askGemini } from "../services/geminiClient.js";
import { RegisteredProduct } from "../models/RegisteredProduct.js";
import { WarrantyRecord } from "../models/WarrantyRecord.js";
import { Product } from "../models/Product.js";
import { WarrantyDetail } from "../models/WarrantyDetail.js";

const router = express.Router();

const aiSchema = z.object({
  message: z.string().min(1).optional(),
  question: z.string().min(1).optional(),
  productId: z.string().optional().default("")
}).refine((data) => Boolean((data.message || data.question || "").trim()), {
  message: "message is required"
});

const KNOWN_WARRANTY_KB = [
  {
    brand: "Voltas Beko",
    productType: "washing machine",
    model: "",
    warrantyPeriod: "2 years comprehensive",
    componentWarranty: [
      { component: "Motor", warranty: "10 years" },
      { component: "PCB", warranty: "3 years (varies by model)" }
    ],
    covers: ["Manufacturing defects", "Motor failure", "Electrical faults from normal use"],
    notCovered: ["Physical damage", "Water ingress due to misuse", "Improper installation"],
    claimProcess: [
      "Contact Voltas Beko support with invoice and model number",
      "Share serial number and fault details",
      "Schedule authorized service visit"
    ],
    replacementOrReturn: [
      "Replacement is model and fault dependent",
      "Dead-on-arrival or early major defect cases may qualify under seller/manufacturer policy"
    ]
  },
  {
    brand: "Airtel",
    productType: "router",
    model: "Xstream",
    warrantyPeriod: "1 year",
    componentWarranty: [{ component: "Hardware", warranty: "1 year limited warranty" }],
    covers: ["Hardware defects", "Manufacturing faults"],
    notCovered: ["Physical damage", "Lightning surge damage", "Water damage", "Unauthorized repair"],
    claimProcess: [
      "Contact Airtel support",
      "Provide router serial number and account details",
      "Remote diagnostics and technician visit if required"
    ],
    replacementOrReturn: [
      "Router is replaced if diagnosed faulty under policy",
      "For leased routers, replacement is usually covered during active subscription"
    ],
    rmaProcess: [
      "ISP-led RMA workflow is typically managed by Airtel support",
      "Customer generally does not ship directly unless instructed"
    ],
    ispReplacementRules: [
      "Active subscription and non-user-induced damage are commonly required",
      "Unreturned leased hardware may incur charges"
    ]
  }
];

const KNOWN_BRANDS = [
  "voltas beko",
  "samsung",
  "lg",
  "airtel",
  "jio",
  "d-link",
  "tp-link",
  "netgear",
  "tenda",
  "huawei"
];

const PRODUCT_TYPES = [
  "washing machine",
  "router",
  "modem",
  "air conditioner",
  "ac",
  "refrigerator",
  "tv",
  "smart tv",
  "laptop",
  "mobile",
  "smartphone"
];

function normalizeText(value = "") {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function escapeRegex(value = "") {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function inferProductHints(question) {
  const normalized = normalizeText(question);
  const brand = KNOWN_BRANDS.find((b) => normalized.includes(b)) || "";
  const productType = PRODUCT_TYPES.find((p) => normalized.includes(p)) || "";
  const modelMatch = question.match(/\b([A-Za-z0-9]{2,}(?:[- ][A-Za-z0-9]{2,}){0,3})\b/g) || [];
  const model =
    modelMatch.find((part) => /[A-Za-z]/.test(part) && /\d/.test(part) && !normalizeText(part).includes(brand || "")) || "";

  return {
    brand: brand ? brand.replace(/\b\w/g, (c) => c.toUpperCase()) : "",
    productType,
    model: model.trim()
  };
}

function isNetworkingProduct(value = "") {
  return /(router|modem|ont|wifi|wi-fi|broadband)/i.test(value);
}

function getKnownWarrantyMatches({ brand, productType, question }) {
  const q = normalizeText(question);
  return KNOWN_WARRANTY_KB.filter((item) => {
    const brandOk = brand ? normalizeText(item.brand) === normalizeText(brand) : q.includes(normalizeText(item.brand));
    const typeOk = productType
      ? normalizeText(item.productType) === normalizeText(productType)
      : q.includes(normalizeText(item.productType));
    return brandOk || typeOk;
  });
}

const WARRANTY_SYSTEM_INSTRUCTION = `You are a product warranty expert for the DoNotRisk platform.

Core behavior:
1) Identify brand, product type, and model (if present) from the user question and context.
2) If critical product details are missing (brand or product type), ask follow-up questions first.
3) If model number is missing but brand and product type are known, provide best-known warranty info and clearly request model number for exact confirmation.
4) For routers/modems/networking products, always include replacement process, RMA process, and ISP replacement rules.
5) Prefer known warranty context provided by DoNotRisk over generic assumptions.
6) Never respond with generic advice when concrete product context is available.

Response format rules:
- Use clear markdown headings.
- Keep this order exactly:
  1. Product Name
  2. Warranty Period
  3. Motor / Component Warranty
  4. What the warranty covers
  5. What the warranty does not cover
  6. How to claim warranty
  7. Replacement / return process
- If networking product: add heading "RMA / ISP Rules" after section 7.
- If details are missing: start with heading "Follow-up Questions" and list precise required details.
- Keep response concise but complete.`;

router.post("/assistant", requireAuth, async (req, res) => {
  const parsed = aiSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.message });

  const question = (parsed.data.message || parsed.data.question || "").trim();
  const { productId } = parsed.data;
  const inferred = inferProductHints(question);
  let productContext = null;
  let userWarrantyRecord = null;
  let catalogMatches = [];
  let knownWarrantyMatches = [];

  if (productId) {
    const product = await RegisteredProduct.findOne({
      $or: [{ _id: productId }, { registered_product_id: productId }]
    })
      .select(
        "registered_product_id product_name brand model_number serial_number product_category purchase_date invoice_number proof_type warranty_completed user_id agent_id"
      )
      .lean();

    if (product) {
      const warranty = await WarrantyRecord.findOne({ product_id: product._id })
        .select("total_warranty components expiry_date notes")
        .lean();
      productContext = product;
      userWarrantyRecord = warranty;
    }
  }

  const searchTerms = [inferred.brand, inferred.productType, inferred.model]
    .map((item) => item.trim())
    .filter(Boolean);

  if (searchTerms.length > 0) {
    const orFilters = searchTerms.map((term) => {
      const rx = new RegExp(escapeRegex(term), "i");
      return { $or: [{ name: rx }, { brand: rx }, { model_number: rx }] };
    });
    const matchedProducts = await Product.find({ $or: orFilters })
      .select("_id name brand model_number")
      .limit(5)
      .lean();

    if (matchedProducts.length > 0) {
      const detailRows = await WarrantyDetail.find({ product_id: { $in: matchedProducts.map((p) => p._id) } })
        .select(
          "product_id duration_months coverage_type start_conditions registration_requirements claim_process validity_conditions void_conditions"
        )
        .lean();
      const detailsByProductId = new Map(detailRows.map((row) => [String(row.product_id), row]));
      catalogMatches = matchedProducts.map((p) => ({ ...p, warrantyDetail: detailsByProductId.get(String(p._id)) || null }));
    }
  }

  knownWarrantyMatches = getKnownWarrantyMatches({
    brand: inferred.brand || productContext?.brand || "",
    productType: inferred.productType || "",
    question
  });

  const missingBrand = !(productContext?.brand || inferred.brand);
  const missingProductType = !(
    inferred.productType || productContext?.product_category || isNetworkingProduct(productContext?.product_name || "")
  );

  if (missingBrand || missingProductType) {
    const followUp = [
      "### Follow-up Questions",
      "To provide exact warranty details, please share:",
      "",
      `1. Brand${missingBrand ? " (required)" : ""}`,
      `2. Product type${missingProductType ? " (required)" : ""}`,
      "3. Model number (recommended for exact terms)",
      "4. Purchase date (recommended for claim eligibility)"
    ].join("\n");
    return res.json({ reply: followUp, answer: followUp });
  }

  const structuredContext = {
    inferred_from_question: inferred,
    user_registered_product: productContext,
    user_warranty_record: userWarrantyRecord,
    matched_catalog_products: catalogMatches,
    known_warranty_knowledge: knownWarrantyMatches,
    rules: {
      use_known_data_first: true,
      ask_model_if_missing: !Boolean(inferred.model || productContext?.model_number),
      include_networking_sections: isNetworkingProduct(
        `${inferred.productType} ${question} ${productContext?.product_name || ""}`
      )
    }
  };

  try {
    const reply = await askGemini({
      role: req.user.role,
      question,
      context: JSON.stringify(structuredContext, null, 2),
      systemInstruction: WARRANTY_SYSTEM_INSTRUCTION
    });
    // Keep "answer" for old clients, and "reply" for new clients.
    return res.json({ reply, answer: reply });
  } catch (error) {
    // Keep endpoint functional even when upstream AI provider fails.
    const fallbackReply =
      "I could not reach the AI provider right now. Please try again in a minute. " +
      "If this continues, verify GEMINI_API_KEY and GEMINI_MODEL in backend/.env.";
    const detail = error instanceof Error ? error.message : "AI service unavailable";
    return res.json({ reply: fallbackReply, answer: fallbackReply, detail });
  }
});

export default router;
