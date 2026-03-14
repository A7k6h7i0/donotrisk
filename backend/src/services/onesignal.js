import axios from "axios";
import { env } from "../config/env.js";

const ONESIGNAL_API_URL = "https://onesignal.com/api/v1/notifications";

/**
 * Send a push notification to a specific user via OneSignal
 * @param {string} playerId - The OneSignal Player ID
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {object} additionalData - Optional additional data to send with notification
 * @returns {Promise<boolean>} - Returns true if notification was sent successfully
 */
export async function sendPushNotification(playerId, title, message, additionalData = {}) {
  if (!playerId) {
    console.log("[OneSignal] No playerId provided, skipping notification");
    return false;
  }

  if (!env.onesignalAppId || !env.onesignalRestApiKey) {
    console.log("[OneSignal] OneSignal credentials not configured, skipping notification");
    return false;
  }

  try {
    const payload = {
      app_id: env.onesignalAppId,
      include_player_ids: [playerId],
      headings: { en: title },
      contents: { en: message },
      data: additionalData,
      ttl: 86400 // 24 hours expiration
    };

    const response = await axios.post(ONESIGNAL_API_URL, payload, {
      headers: {
        Authorization: `Basic ${env.onesignalRestApiKey}`,
        "Content-Type": "application/json"
      }
    });

    if (response.data && response.data.id) {
      console.log(`[OneSignal] Notification sent successfully to player ${playerId}`);
      return true;
    }

    console.log(`[OneSignal] Notification failed for player ${playerId}:`, response.data);
    return false;
  } catch (error) {
    console.error(`[OneSignal] Error sending notification to player ${playerId}:`, 
      error.response?.data || error.message);
    return false;
  }
}

/**
 * Send warranty expiry notification
 * @param {string} playerId - The OneSignal Player ID
 * @param {string} productName - Name of the product
 * @param {number} daysRemaining - Days until warranty expires
 * @returns {Promise<boolean>}
 */
export async function sendWarrantyExpiryNotification(playerId, productName, daysRemaining) {
  let title = "Warranty Expiring Soon";
  let message = "";

  if (daysRemaining === 30) {
    title = "Warranty Expiring in 30 Days";
    message = `Your warranty for ${productName} will expire in 30 days. Please check your dashboard.`;
  } else if (daysRemaining === 7) {
    title = "Warranty Expiring in 1 Week";
    message = `Your warranty for ${productName} will expire in 7 days. Please check your dashboard.`;
  } else if (daysRemaining === 1) {
    title = "Warranty Expiring Tomorrow";
    message = `Your warranty for ${productName} will expire tomorrow. Please check your dashboard.`;
  } else {
    message = `Your warranty for ${productName} will expire in ${daysRemaining} days. Please check your dashboard.`;
  }

  return sendPushNotification(playerId, title, message, {
    type: "warranty_expiry",
    productName,
    daysRemaining
  });
}
