"use client";

import { useState, useEffect } from "react";
import { apiGet, apiPatch } from "@/lib/api";

interface NotificationPreferences {
  enabled: boolean;
  expiry_reminder_30_days: boolean;
  expiry_reminder_7_days: boolean;
  expiry_reminder_1_day: boolean;
}

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enabled: true,
    expiry_reminder_30_days: true,
    expiry_reminder_7_days: true,
    expiry_reminder_1_day: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const data = await apiGet<NotificationPreferences>(
        "/users/me/notification-preferences",
        token
      );
      setPreferences(data);
    } catch (error) {
      console.error("Failed to load preferences:", error);
      // Use default values on error
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key: keyof NotificationPreferences) => {
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key],
    };
    setPreferences(newPreferences);
    await savePreferences(newPreferences);
  };

  const savePreferences = async (newPreferences: NotificationPreferences) => {
    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Please login to save preferences");
        return;
      }

      await apiPatch("/users/me/notification-preferences", newPreferences, token);
      setMessage("Preferences saved successfully");
    } catch (error) {
      console.error("Failed to save preferences:", error);
      setMessage("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-white p-5">
        <p className="text-sm text-ink/60">Loading notification preferences...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <h2 className="font-display text-xl">Notification Preferences</h2>
      <p className="mt-1 text-sm text-ink/60">
        Manage your push notification settings for warranty expiry alerts.
      </p>

      <div className="mt-4 space-y-4">
        {/* Master Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Enable Notifications</p>
            <p className="text-sm text-ink/60">
              Receive push notifications about warranty expiry
            </p>
          </div>
          <button
            onClick={() => handleToggle("enabled")}
            disabled={saving}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              preferences.enabled ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                preferences.enabled ? "left-5" : "left-0.5"
              }`}
            />
          </button>
        </div>

        {/* 30 Days Reminder */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">30-Day Reminder</p>
            <p className="text-sm text-ink/60">
              Notify 30 days before warranty expires
            </p>
          </div>
          <button
            onClick={() => handleToggle("expiry_reminder_30_days")}
            disabled={saving || !preferences.enabled}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              preferences.enabled && preferences.expiry_reminder_30_days
                ? "bg-green-500"
                : "bg-gray-300"
            } ${!preferences.enabled && "opacity-50"}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                preferences.enabled && preferences.expiry_reminder_30_days
                  ? "left-5"
                  : "left-0.5"
              }`}
            />
          </button>
        </div>

        {/* 7 Days Reminder */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">7-Day Reminder</p>
            <p className="text-sm text-ink/60">
              Notify 7 days before warranty expires
            </p>
          </div>
          <button
            onClick={() => handleToggle("expiry_reminder_7_days")}
            disabled={saving || !preferences.enabled}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              preferences.enabled && preferences.expiry_reminder_7_days
                ? "bg-green-500"
                : "bg-gray-300"
            } ${!preferences.enabled && "opacity-50"}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                preferences.enabled && preferences.expiry_reminder_7_days
                  ? "left-5"
                  : "left-0.5"
              }`}
            />
          </button>
        </div>

        {/* 1 Day Reminder */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">1-Day Reminder</p>
            <p className="text-sm text-ink/60">
              Notify 1 day before warranty expires
            </p>
          </div>
          <button
            onClick={() => handleToggle("expiry_reminder_1_day")}
            disabled={saving || !preferences.enabled}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              preferences.enabled && preferences.expiry_reminder_1_day
                ? "bg-green-500"
                : "bg-gray-300"
            } ${!preferences.enabled && "opacity-50"}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                preferences.enabled && preferences.expiry_reminder_1_day
                  ? "left-5"
                  : "left-0.5"
              }`}
            />
          </button>
        </div>

        {message && (
          <p
            className={`text-sm ${
              message.includes("Failed") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
