"use client";

import { Bell, Mail, MessageSquare } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface NotificationGroup {
  title: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  notifications: Array<{
    id: string;
    label: string;
    enabled: boolean;
  }>;
}

const notificationGroups: NotificationGroup[] = [
  {
    title: "Email Notifications",
    icon: Mail,
    notifications: [
      { id: "email-new-booking", label: "New Booking Received", enabled: true },
      { id: "email-booking-confirmed", label: "Booking Confirmed", enabled: true },
      { id: "email-payment-received", label: "Payment Received", enabled: true },
      { id: "email-cancellation", label: "Cancellation Request", enabled: true },
      { id: "email-new-inquiry", label: "New Inquiry", enabled: true },
      { id: "email-document-expiring", label: "Document Expiring", enabled: true },
      { id: "email-maintenance-due", label: "Maintenance Due", enabled: false },
    ],
  },
  {
    title: "In-App Notifications",
    icon: Bell,
    notifications: [
      { id: "app-new-booking", label: "New Booking Received", enabled: true },
      { id: "app-booking-confirmed", label: "Booking Confirmed", enabled: true },
      { id: "app-payment-received", label: "Payment Received", enabled: true },
      { id: "app-cancellation", label: "Cancellation Request", enabled: true },
      { id: "app-new-inquiry", label: "New Inquiry", enabled: true },
      { id: "app-document-expiring", label: "Document Expiring", enabled: true },
      { id: "app-maintenance-due", label: "Maintenance Due", enabled: true },
    ],
  },
  {
    title: "SMS Notifications",
    icon: MessageSquare,
    notifications: [
      { id: "sms-new-booking", label: "New Booking Received", enabled: false },
      { id: "sms-booking-confirmed", label: "Booking Confirmed", enabled: false },
      { id: "sms-payment-received", label: "Payment Received", enabled: false },
      { id: "sms-cancellation", label: "Cancellation Request", enabled: true },
      { id: "sms-new-inquiry", label: "New Inquiry", enabled: false },
      { id: "sms-document-expiring", label: "Document Expiring", enabled: false },
      { id: "sms-maintenance-due", label: "Maintenance Due", enabled: false },
    ],
  },
];

export function NotificationSettings() {
  const { colors } = useTheme();

  return (
    <div
      className="rounded-lg border p-4 md:p-6"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder,
      }}
    >
      <h2
        className="text-xl md:text-2xl font-bold mb-6"
        style={{ color: colors.textPrimary }}
      >
        Notification Settings
      </h2>

      <div className="space-y-8">
        {notificationGroups.map((group) => {
          const Icon = group.icon;

          return (
            <div key={group.title}>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${colors.accent}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: colors.accent }} />
                </div>
                <h3
                  className="text-lg font-bold"
                  style={{ color: colors.textPrimary }}
                >
                  {group.title}
                </h3>
              </div>

              <div
                className="rounded-lg border"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.cardBorder,
                }}
              >
                {group.notifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between p-4"
                    style={{
                      borderBottom:
                        index < group.notifications.length - 1
                          ? `1px solid ${colors.cardBorder}`
                          : "none",
                    }}
                  >
                    <label
                      htmlFor={notification.id}
                      className="text-sm font-medium cursor-pointer flex-1"
                      style={{ color: colors.textPrimary }}
                    >
                      {notification.label}
                    </label>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id={notification.id}
                        className="sr-only peer"
                        defaultChecked={notification.enabled}
                      />
                      <div
                        className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{
                          backgroundColor: notification.enabled
                            ? colors.accent
                            : colors.textSecondary,
                        }}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-6 flex justify-end">
        <button
          type="button"
          className="px-6 py-3 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105 focus:outline-none focus:ring-2"
          style={{
            background: `linear-gradient(to right, ${colors.accent}, #00B39F)`,
          }}
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}

export default NotificationSettings;
