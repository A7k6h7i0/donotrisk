import mongoose from "mongoose";

const registeredProductSchema = new mongoose.Schema(
  {
    registered_product_id: { type: String, required: true, unique: true, index: true },
    customer_name: { type: String, required: true },
    customer_phone: { type: String, default: "" },
    customer_email: { type: String, default: "" },
    product_name: { type: String, required: true },
    brand: { type: String, required: true },
    model_number: { type: String, default: "" },
    serial_number: { type: String, default: "" },
    purchase_date: { type: Date, default: null },
    invoice_number: { type: String, default: "" },
    purchase_store: { type: String, default: "" },
    product_category: { type: String, required: true },
    proof_type: { type: String, enum: ["image", "store_location", "agent_confirmation"], default: "agent_confirmation" },
    purchase_proof_url: { type: String, default: "" },
    qr_warranty_card_url: { type: String, default: "" },
    digital_certificate_url: { type: String, default: "" },
    warranty_expiry_reminder_enabled: { type: Boolean, default: true },
    fraud_risk_score: { type: Number, default: 0 },
    warranty_completed: { type: Boolean, default: false, index: true },
    agent_id: { type: mongoose.Schema.Types.ObjectId, ref: "AgentProfile", required: true, index: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const RegisteredProduct = mongoose.model("RegisteredProduct", registeredProductSchema);
