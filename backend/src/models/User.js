import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ["user", "agent", "admin"], default: "user" },
    onesignal_player_id: { type: String, default: null },
    notification_preferences: {
      enabled: { type: Boolean, default: true },
      expiry_reminder_30_days: { type: Boolean, default: true },
      expiry_reminder_7_days: { type: Boolean, default: true },
      expiry_reminder_1_day: { type: Boolean, default: true }
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export const User = mongoose.model("User", userSchema);
