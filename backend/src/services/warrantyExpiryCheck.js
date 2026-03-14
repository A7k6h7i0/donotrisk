import { User } from "../models/User.js";
import { RegisteredProduct } from "../models/RegisteredProduct.js";
import { WarrantyRecord } from "../models/WarrantyRecord.js";
import { ScannedWarranty } from "../models/ScannedWarranty.js";
import { NotificationLog } from "../models/NotificationLog.js";
import { sendWarrantyExpiryNotification } from "./onesignal.js";

// Days before expiry to send notifications
const EXPIRY_STAGES = [30, 7, 1];

/**
 * Get all warranties with their user information and expiry dates
 */
async function getAllWarrantiesWithExpiry() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get registered products with warranty records
  const registeredProducts = await RegisteredProduct.find({ 
    user_id: { $ne: null },
    warranty_completed: true 
  })
    .populate("user_id", "name email onesignal_player_id notification_preferences")
    .lean();

  const warrantyRecords = await WarrantyRecord.find({
    product_id: { $in: registeredProducts.map(p => p._id) },
    expiry_date: { $ne: null }
  }).lean();

  const warrantyMap = new Map(warrantyRecords.map(w => [String(w.product_id), w]));

  // Get scanned warranties
  const scannedWarranties = await ScannedWarranty.find({
    user_id: { $ne: null },
    expiry_date: { $ne: null }
  })
    .populate("user_id", "name email onesignal_player_id notification_preferences")
    .populate("product_id", "name brand")
    .lean();

  // Combine and format warranties
  const warranties = [];

  // Add registered products
  for (const product of registeredProducts) {
    const warranty = warrantyMap.get(String(product._id));
    if (warranty && warranty.expiry_date) {
      const expiryDate = new Date(warranty.expiry_date);
      expiryDate.setHours(0, 0, 0, 0);
      
      warranties.push({
        userId: product.user_id?._id,
        userEmail: product.user_id?.email,
        playerId: product.user_id?.onesignal_player_id,
        notificationsEnabled: product.user_id?.notification_preferences?.enabled ?? true,
        warrantyId: product._id,
        warrantyType: "registered_product",
        productName: product.product_name,
        expiryDate,
        daysUntilExpiry: Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      });
    }
  }

  // Add scanned warranties
  for (const scan of scannedWarranties) {
    if (scan.expiry_date && scan.user_id) {
      const expiryDate = new Date(scan.expiry_date);
      expiryDate.setHours(0, 0, 0, 0);
      
      warranties.push({
        userId: scan.user_id._id,
        userEmail: scan.user_id.email,
        playerId: scan.user_id.onesignal_player_id,
        notificationsEnabled: scan.user_id.notification_preferences?.enabled ?? true,
        warrantyId: scan._id,
        warrantyType: "scanned_warranty",
        productName: scan.product_id?.name || "Unknown Product",
        expiryDate,
        daysUntilExpiry: Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      });
    }
  }

  return warranties;
}

/**
 * Check if notification was already sent for this warranty stage
 */
async function wasNotificationSent(userId, warrantyId, warrantyType, daysBeforeExpiry) {
  const existing = await NotificationLog.findOne({
    user_id: userId,
    warranty_id: warrantyId,
    warranty_type: warrantyType,
    days_before_expiry: daysBeforeExpiry
  });
  return !!existing;
}

/**
 * Log a sent notification to prevent duplicates
 */
async function logNotification(userId, warrantyId, warrantyType, daysBeforeExpiry) {
  try {
    await NotificationLog.create({
      user_id: userId,
      warranty_id: warrantyId,
      warranty_type: warrantyType,
      days_before_expiry: daysBeforeExpiry
    });
  } catch (error) {
    // Ignore duplicate key errors
    if (error.code !== 11000) {
      throw error;
    }
  }
}

/**
 * Main function to check warranties and send expiry notifications
 */
export async function checkWarrantyExpiry() {
  console.log("[WarrantyExpiryCheck] Starting warranty expiry check...");

  try {
    const warranties = await getAllWarrantiesWithExpiry();
    console.log(`[WarrantyExpiryCheck] Found ${warranties.length} warranties to check`);

    let notificationsSent = 0;

    for (const warranty of warranties) {
      // Skip if user doesn't have a player ID or notifications disabled
      if (!warranty.playerId || !warranty.notificationsEnabled) {
        continue;
      }

      // Skip expired warranties
      if (warranty.daysUntilExpiry < 0) {
        continue;
      }

      // Check each expiry stage
      for (const daysRemaining of EXPIRY_STAGES) {
        // Only send if we're at or past this stage
        if (warranty.daysUntilExpiry > daysRemaining) {
          continue;
        }

        // Check if we already sent a notification for this stage
        const alreadySent = await wasNotificationSent(
          warranty.userId,
          warranty.warrantyId,
          warranty.warrantyType,
          daysRemaining
        );

        if (alreadySent) {
          continue;
        }

        // Send the notification
        console.log(`[WarrantyExpiryCheck] Sending notification for ${warranty.productName} (${daysRemaining} days)`);
        
        const sent = await sendWarrantyExpiryNotification(
          warranty.playerId,
          warranty.productName,
          daysRemaining
        );

        if (sent) {
          await logNotification(
            warranty.userId,
            warranty.warrantyId,
            warranty.warrantyType,
            daysRemaining
          );
          notificationsSent++;
        }
      }
    }

    console.log(`[WarrantyExpiryCheck] Completed. Sent ${notificationsSent} notifications`);
    return { totalChecked: warranties.length, notificationsSent };
  } catch (error) {
    console.error("[WarrantyExpiryCheck] Error during warranty expiry check:", error);
    throw error;
  }
}

/**
 * Run the warranty expiry check (for manual/testing use)
 */
export async function runWarrantyExpiryCheck() {
  return checkWarrantyExpiry();
}
