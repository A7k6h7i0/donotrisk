"use client";

import { useState } from "react";

declare global {
  interface Window {
    OneSignal: any;
  }
}

export function EnableNotifications() {
  const [clicked, setClicked] = useState(false);

  const handleEnable = async () => {
    setClicked(true);
    
    if (typeof window === "undefined" || !window.OneSignal) {
      console.warn("OneSignal not available");
      setClicked(false);
      return;
    }

    try {
      // Show the OneSignal prompt
      const result = await window.OneSignal.showSlidedownPrompt();
      console.log("OneSignal prompt result:", result);
    } catch (error) {
      console.error("Error showing OneSignal prompt:", error);
    } finally {
      setClicked(false);
    }
  };

  return (
    <button
      onClick={handleEnable}
      disabled={clicked}
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
    >
      {clicked ? "Opening..." : "Enable Notifications"}
    </button>
  );
}
