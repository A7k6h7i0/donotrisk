import mongoose from "mongoose";

const scannedWarrantySchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
    serial_number: { type: String, default: "" },
    purchase_date: { type: Date, default: null },
    expiry_date: { type: Date, default: null },
    raw_extracted_text: { type: String, default: "" },
    brand: { type: String, default: "" },
    product_name: { type: String, default: "" },
    model_number: { type: String, default: "" },
    production_date: { type: String, default: null },
    warranty_duration: { type: String, default: "" },
    quality: { type: String, default: "" },
    scan_quality: { type: String, default: "" },
    decoded_qr: { type: [String], default: [] },
    decoded_barcodes: { type: [String], default: [] },
    source_type: { type: String, default: "upload" },
    extracted_data: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export const ScannedWarranty = mongoose.model("ScannedWarranty", scannedWarrantySchema);
