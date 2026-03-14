import mongoose from "mongoose";

const notificationLogSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    warranty_id: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    warranty_type: { 
      type: String, 
      enum: ["registered_product", "scanned_warranty"], 
      required: true 
    },
    days_before_expiry: { type: Number, required: true },
    notification_sent_at: { type: Date, default: Date.now },
    onesignal_notification_id: { type: String, default: null }
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

// Compound index to prevent duplicate notifications
notificationLogSchema.index(
  { user_id: 1, warranty_id: 1, warranty_type: 1, days_before_expiry: 1 },
  { unique: true }
);

export const NotificationLog = mongoose.model("NotificationLog", notificationLogSchema);
