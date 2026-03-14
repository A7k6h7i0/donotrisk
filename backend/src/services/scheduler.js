import { checkWarrantyExpiry } from "./warrantyExpiryCheck.js";

// Default check interval: every 24 hours (in milliseconds)
const DEFAULT_CHECK_INTERVAL = 24 * 60 * 60 * 1000;

let schedulerInterval = null;

/**
 * Start the warranty expiry check scheduler
 * @param {number} intervalMs - Interval in milliseconds (default: 24 hours)
 */
export function startScheduler(intervalMs = DEFAULT_CHECK_INTERVAL) {
  if (schedulerInterval) {
    console.log("[Scheduler] Scheduler already running");
    return;
  }

  console.log(`[Scheduler] Starting warranty expiry check scheduler (interval: ${intervalMs}ms)`);

  // Run immediately on startup
  checkWarrantyExpiry().catch(err => {
    console.error("[Scheduler] Initial warranty check failed:", err);
  });

  // Then run at the specified interval
  schedulerInterval = setInterval(() => {
    checkWarrantyExpiry().catch(err => {
      console.error("[Scheduler] Scheduled warranty check failed:", err);
    });
  }, intervalMs);
}

/**
 * Stop the warranty expiry check scheduler
 */
export function stopScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log("[Scheduler] Scheduler stopped");
  }
}

/**
 * Manually trigger a warranty expiry check
 */
export async function triggerCheck() {
  return checkWarrantyExpiry();
}
