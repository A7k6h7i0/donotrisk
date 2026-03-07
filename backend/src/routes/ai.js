import express from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { askGemini } from "../services/geminiClient.js";
import { RegisteredProduct } from "../models/RegisteredProduct.js";
import { WarrantyRecord } from "../models/WarrantyRecord.js";
import { Product } from "../models/Product.js";
import { WarrantyDetail } from "../models/WarrantyDetail.js";

const router = express.Router();

const historyItemSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000)
});

const aiSchema = z.object({
  message: z.string().min(1).optional(),
  question: z.string().min(1).optional(),
  productId: z.string().optional().default(""),
  history: z.array(historyItemSchema).max(12).optional().default([])
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

const REQUIRED_SECTIONS = ["Introduction", "Warranty Details", "Process Steps", "Summary"];

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

const WARRANTY_SYSTEM_INSTRUCTION = `You are DoNotRisk's professional customer support assistant for warranty and product queries.

Core behavior rules:
1) Always answer in simple, user-friendly language.
2) Be accurate and grounded in the provided DoNotRisk context.
3) Do not invent facts. If data is missing, say "Not available".
4) Use conversation history for follow-up questions and keep topic continuity.
5) If local context is insufficient, use web-grounded information from reliable sources.
6) For web-grounded facts, include source links under "Sources" at the end.
7) Never stop mid-response. Always complete all sections.
8) Use clear headings, bullet points, and step-by-step numbered actions.

Mandatory output format (use this exact order and labels):
Introduction:
- 2-4 short bullet points with direct answer context.

Warranty Details:
- Product Name: ...
- Warranty Period: ...
- Component Warranty: ...
- Covered Under Warranty: ...
- Not Covered Under Warranty: ...
- Required Documents: ...
- Service Contact / Support: ...

Process Steps:
1. ...
2. ...
3. ...

Summary:
- 2-4 short bullet points with key takeaways and next action.

Always include all four sections.
Always end with this exact final line: End of response.`;

function hasAllRequiredSections(text = "") {
  return REQUIRED_SECTIONS.every((section) => {
    const rx = new RegExp(`(^|\\n)\\s*${section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*:`, "i");
    return rx.test(text);
  });
}

function isLikelyTruncated(text = "") {
  const trimmed = text.trim();
  if (!trimmed) return true;
  if (!/end of response\.\s*$/i.test(trimmed)) return true;
  // Common truncation patterns from incomplete model output.
  if (/(what the warranty does not|not covered under warranty|process steps)\s*:?$/i.test(trimmed)) return true;
  return false;
}

function isCompleteWarrantyResponse(text = "") {
  return hasAllRequiredSections(text) && !isLikelyTruncated(text);
}

function isLowInformationResponse(text = "") {
  const matches = text.match(/not available/gi) || [];
  return matches.length >= 4;
}

function toBulletList(values) {
  if (!values || values.length === 0) return "Not available";
  return values.map((item) => `- ${item}`).join("\n");
}

function buildFallbackResponse({ inferred, productContext, userWarrantyRecord, catalogMatches, knownWarrantyMatches }) {
  const bestKnown = knownWarrantyMatches[0] || null;
  const bestCatalog = catalogMatches[0] || null;
  const catalogDetail = bestCatalog?.warrantyDetail || null;

  const productName =
    productContext?.product_name ||
    bestCatalog?.name ||
    [inferred.brand, inferred.productType].filter(Boolean).join(" ") ||
    "Not available";

  const warrantyPeriod =
    userWarrantyRecord?.total_warranty ||
    bestKnown?.warrantyPeriod ||
    (typeof catalogDetail?.duration_months === "number" ? `${catalogDetail.duration_months} months` : "") ||
    "Not available";

  const componentFromUser = (userWarrantyRecord?.components || []).map((item) => `${item.component}: ${item.duration}`);
  const componentFromKnown = (bestKnown?.componentWarranty || []).map((item) => `${item.component}: ${item.warranty}`);
  const componentWarranty = toBulletList(componentFromUser.length ? componentFromUser : componentFromKnown);

  const covered = toBulletList(bestKnown?.covers || (catalogDetail?.coverage_type ? [catalogDetail.coverage_type] : []));

  const notCovered = toBulletList(
    bestKnown?.notCovered ||
      (catalogDetail?.void_conditions ? [catalogDetail.void_conditions] : catalogDetail?.validity_conditions ? [catalogDetail.validity_conditions] : [])
  );

  const howToClaim = toBulletList(bestKnown?.claimProcess || (catalogDetail?.claim_process ? [catalogDetail.claim_process] : []));

  const requiredDocs = toBulletList(
    catalogDetail?.registration_requirements ? [catalogDetail.registration_requirements] : ["Not available"]
  );

  const support = toBulletList(
    isNetworkingProduct(`${inferred.productType} ${productName}`) && /airtel/i.test(`${inferred.brand} ${productName}`)
      ? ["Airtel Customer Care: 121", "Website: https://www.airtel.in"]
      : ["Not available"]
  );

  const processSteps = toBulletList(
    bestKnown?.claimProcess ||
      bestKnown?.replacementOrReturn ||
      (catalogDetail?.claim_process ? [catalogDetail.claim_process] : ["Contact support and share product details"])
  )
    .split("\n")
    .map((line, index) => `${index + 1}. ${line.replace(/^-+\s*/, "")}`)
    .join("\n");

  return [
    "Introduction:",
    "- Here are the available warranty and support details for your product query.",
    "- The response is based on DoNotRisk records and known brand policy patterns.",
    "- Any missing item is marked as Not available.",
    "",
    "Warranty Details:",
    `- Product Name: ${productName || "Not available"}`,
    `- Warranty Period: ${warrantyPeriod || "Not available"}`,
    "- Component Warranty:",
    componentWarranty,
    "- Covered Under Warranty:",
    covered,
    "- Not Covered Under Warranty:",
    notCovered,
    `- Required Documents: ${requiredDocs.replace(/\n+/g, "; ")}`,
    `- Service Contact / Support: ${support.replace(/\n+/g, "; ")}`,
    "",
    "Process Steps:",
    processSteps,
    "",
    "Summary:",
    "- Verify invoice and serial number before raising a request.",
    "- Follow the support steps above to claim warranty or return guidance.",
    "- If your exact model policy differs, confirm once with official support.",
    "End of response."
  ].join("\n");
}

router.post("/assistant", requireAuth, async (req, res) => {
  const parsed = aiSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.message });

  const question = (parsed.data.message || parsed.data.question || "").trim();
  const { productId, history } = parsed.data;
  const historyText = history.map((item) => `${item.role}: ${item.content}`).join("\n");
  const combinedQuestion = [historyText, question].filter(Boolean).join("\n");
  const inferred = inferProductHints(combinedQuestion);
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
    question: combinedQuestion
  });

  const structuredContext = {
    conversation_history: history,
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

  const shouldPreferWebGrounding = !productContext && catalogMatches.length === 0 && knownWarrantyMatches.length === 0;

  try {
    let reply = "";
    let attemptQuestion = question;

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      const enableWebSearch = shouldPreferWebGrounding || attempt > 1;
      reply = await askGemini({
        role: req.user.role,
        question: attemptQuestion,
        context: JSON.stringify(structuredContext, null, 2),
        systemInstruction: WARRANTY_SYSTEM_INSTRUCTION,
        enableWebSearch
      });

      if (isCompleteWarrantyResponse(reply) && !isLowInformationResponse(reply)) break;

      attemptQuestion = [
        question,
        "",
        "Regenerate the response.",
        "Your last answer was incomplete or missed required sections.",
        "If local product data is missing, use web-grounded sources for accurate policy details.",
        "Add source links under a 'Sources:' block.",
        "Return all sections exactly in this order and labels:",
        "Introduction:",
        "Warranty Details:",
        "Process Steps:",
        "Summary:",
        "",
        'Use bullets and numbered steps. If any field is unknown, write "Not available".',
        'End with this exact final line: End of response.'
      ].join("\n");
    }

    if (!isCompleteWarrantyResponse(reply) || isLowInformationResponse(reply)) {
      reply = buildFallbackResponse({
        inferred,
        productContext,
        userWarrantyRecord,
        catalogMatches,
        knownWarrantyMatches
      });
    }

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
