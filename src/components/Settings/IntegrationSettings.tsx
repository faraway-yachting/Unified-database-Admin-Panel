"use client";

import Image from "next/image";
import { CheckCircle, XCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface Integration {
  id: string;
  name: string;
  description: string;
  logo: string;
  connected: boolean;
}

const integrations: Integration[] = [
  {
    id: "I-001",
    name: "Stripe Payment Gateway",
    description: "Accept credit card and online payments securely",
    logo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&h=100&fit=crop",
    connected: true,
  },
  {
    id: "I-002",
    name: "WhatsApp Business API",
    description: "Send booking confirmations and notifications via WhatsApp",
    logo: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=100&h=100&fit=crop",
    connected: true,
  },
  {
    id: "I-003",
    name: "Google Calendar",
    description: "Sync bookings with Google Calendar",
    logo: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=100&h=100&fit=crop",
    connected: true,
  },
  {
    id: "I-004",
    name: "Exchange Rate API",
    description: "Auto-update currency exchange rates in real-time",
    logo: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100&fit=crop",
    connected: true,
  },
  {
    id: "I-005",
    name: "Twilio SMS",
    description: "Send SMS notifications to customers and staff",
    logo: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=100&h=100&fit=crop",
    connected: false,
  },
  {
    id: "I-006",
    name: "Google Analytics",
    description: "Track website traffic and user behavior",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop",
    connected: false,
  },
];

export function IntegrationSettings() {
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
        Integrations
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="rounded-lg border p-4 md:p-6 transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder,
            }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div
                className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                style={{ backgroundColor: colors.cardBg }}
              >
                <Image
                  src={integration.logo}
                  alt={integration.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className="text-base font-bold mb-1"
                  style={{ color: colors.textPrimary }}
                >
                  {integration.name}
                </h3>
                <p
                  className="text-xs"
                  style={{ color: colors.textSecondary }}
                >
                  {integration.description}
                </p>
              </div>
            </div>

            <div
              className="flex items-center justify-between pt-4 border-t"
              style={{ borderColor: colors.cardBorder }}
            >
              <div className="flex items-center gap-2">
                {integration.connected ? (
                  <>
                    <CheckCircle
                      className="w-4 h-4"
                      style={{ color: colors.accent }}
                    />
                    <span
                      className="text-sm font-medium"
                      style={{ color: colors.accent }}
                    >
                      Connected
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle
                      className="w-4 h-4"
                      style={{ color: colors.textSecondary }}
                    />
                    <span
                      className="text-sm font-medium"
                      style={{ color: colors.textSecondary }}
                    >
                      Not Connected
                    </span>
                  </>
                )}
              </div>

              <button
                type="button"
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: integration.connected
                    ? colors.background
                    : colors.accent,
                  color: integration.connected
                    ? colors.textPrimary
                    : "#FFFFFF",
                  border: integration.connected
                    ? `1px solid ${colors.cardBorder}`
                    : "none",
                }}
              >
                {integration.connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IntegrationSettings;
