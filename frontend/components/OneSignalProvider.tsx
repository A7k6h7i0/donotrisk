"use client";

import { useEffect, useState } from "react";
import { apiPost } from "@/lib/api";

declare global {
  interface Window {
    OneSignal: any;
  }
}

interface OneSignalProviderProps {
  children: React.ReactNode;
}

export function OneSignalProvider({ children }: OneSignalProviderProps) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const onesignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

    // Skip if no OneSignal App ID is configured
    if (!onesignalAppId || onesignalAppId === "your-onesignal-app-id") {
      console.log("[OneSignal] No App ID configured, skipping initialization");
      return;
    }

    // Initialize OneSignal
    const initOneSignal = async () => {
      // Load OneSignal SDK script if not already loaded
      if (!window.OneSignal) {
        const script = document.createElement("script");
        script.src = "https://cdn.onesignal.com/sdks/OneSignalSDK.js";
        script.async = true;
        script.onload = () => {
          initializeSDK(onesignalAppId);
        };
        document.head.appendChild(script);
      } else {
        initializeSDK(onesignalAppId);
      }
    };

    const initializeSDK = (appId: string) => {
      window.OneSignal = window.OneSignal || [];

      window.OneSignal.push(function () {
        window.OneSignal.init({
          appId: appId,
          allowLocalhostAsSecureOrigin: true,
          welcomeNotification: {
            disable: true,
          },
        });

        setInitialized(true);

        // Check if user is already subscribed
        window.OneSignal.getUserId(async (userId: string) => {
          if (userId) {
            console.log("[OneSignal] User ID:", userId);
            await savePlayerId(userId);
          }
        });

        // Listen for subscription changes
        window.OneSignal.on("subscriptionChange", async (subscribed: boolean) => {
          if (subscribed) {
            window.OneSignal.getUserId(async (userId: string) => {
              if (userId) {
                console.log("[OneSignal] Subscription changed, new User ID:", userId);
                await savePlayerId(userId);
              }
            });
          }
        });
      });
    };

    const savePlayerId = async (playerId: string) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("[OneSignal] No auth token, cannot save player ID");
          return;
        }

        await apiPost(
          "/users/me/notification-id",
          { playerId },
          token
        );
        console.log("[OneSignal] Player ID saved successfully");
      } catch (error) {
        console.error("[OneSignal] Failed to save player ID:", error);
      }
    };

    initOneSignal();

    // Cleanup
    return () => {
      // Don't remove the script on unmount as it may be needed elsewhere
    };
  }, []);

  return <>{children}</>;
}

/**
 * Function to manually prompt for notification permission
 * Can be called from a button or UI element
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !window.OneSignal) {
    console.warn("[OneSignal] OneSignal not initialized");
    return false;
  }

  try {
    const result = await window.OneSignal.showSlidedownPrompt();
    return result === true || result === undefined;
  } catch (error) {
    console.error("[OneSignal] Error showing prompt:", error);
    return false;
  }
}
