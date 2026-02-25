"use client";

import { useState } from "react";
import Image from "next/image";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Ship,
  Package,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import type { Customer } from "./CustomerTable";

interface CustomerDetailPanelProps {
  customer: Customer | null;
  onClose: () => void;
}

export function CustomerDetailPanel({
  customer,
  onClose,
}: CustomerDetailPanelProps) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<
    "history" | "communication" | "notes" | "surveys"
  >("history");

  if (!customer) return null;

  const customerDetails = {
    phone: "+1 (555) 123-4567",
    joinDate: "Jan 15, 2024",
    loyaltyTier: "Gold",
    loyaltyPoints: 2450,
    satisfactionScore: 4.8,
  };

  const bookingHistory = [
    {
      id: "BK-001",
      yacht: "Azure Dream",
      package: "Sunset Experience",
      date: "Feb 15, 2026",
      amount: 3850,
      status: "Completed",
    },
    {
      id: "BK-002",
      yacht: "Ocean Majesty",
      package: "Full Day Charter",
      date: "Jan 20, 2026",
      amount: 5200,
      status: "Completed",
    },
    {
      id: "BK-003",
      yacht: "Twin Seas",
      package: "Island Hopping",
      date: "Dec 10, 2025",
      amount: 2400,
      status: "Completed",
    },
  ];

  const communications = [
    {
      type: "email",
      message: "Booking confirmation sent for Azure Dream charter",
      timestamp: "2 hours ago",
      icon: Mail,
    },
    {
      type: "phone",
      message: "Follow-up call regarding package upgrade options",
      timestamp: "1 day ago",
      icon: Phone,
    },
    {
      type: "email",
      message: "Thank you email after completed booking",
      timestamp: "3 days ago",
      icon: Mail,
    },
  ];

  const tabs = [
    { id: "history" as const, label: "Booking History" },
    { id: "communication" as const, label: "Communication" },
    { id: "notes" as const, label: "Notes" },
    { id: "surveys" as const, label: "Surveys" },
  ];

  const getLoyaltyColor = (tier: string) => {
    switch (tier) {
      case "Gold":
        return colors.accentGold;
      case "Silver":
        return colors.textSecondary;
      case "Bronze":
        return "#CD7F32";
      default:
        return colors.textSecondary;
    }
  };

  return (
    <div
      className="rounded-xl p-4 md:p-6 border backdrop-blur-sm"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder,
      }}
    >
      <div
        className="flex items-center justify-between mb-4 md:mb-6 pb-4 md:pb-6 border-b"
        style={{ borderColor: colors.cardBorder }}
      >
        <h3
          className="text-lg md:text-xl font-bold"
          style={{ color: colors.textPrimary }}
        >
          Customer Details
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-lg transition-all"
          style={{
            backgroundColor: colors.background,
            color: colors.textSecondary,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${colors.danger}15`;
            e.currentTarget.style.color = colors.danger;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.background;
            e.currentTarget.style.color = colors.textSecondary;
          }}
          aria-label="Close panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-4 md:gap-6">
        <div
          className="rounded-xl p-4 md:p-6 border"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.cardBorder,
          }}
        >
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-4">
              <Image
                src={customer.avatar}
                alt={customer.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div
              className="text-lg md:text-xl font-bold mb-1 text-center"
              style={{ color: colors.textPrimary }}
            >
              {customer.name}
            </div>
            <div
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor:
                  customer.segment === "VIP"
                    ? `${colors.accentGold}15`
                    : customer.segment === "Regular"
                      ? `${colors.accent}15`
                      : `${colors.success}15`,
                color:
                  customer.segment === "VIP"
                    ? colors.accentGold
                    : customer.segment === "Regular"
                      ? colors.accent
                      : colors.success,
              }}
            >
              {customer.segment} Member
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Mail
                className="w-4 h-4 flex-shrink-0"
                style={{ color: colors.textSecondary }}
              />
              <span
                className="text-sm break-all"
                style={{ color: colors.textPrimary }}
              >
                {customer.email}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone
                className="w-4 h-4 flex-shrink-0"
                style={{ color: colors.textSecondary }}
              />
              <span
                className="text-sm"
                style={{ color: colors.textPrimary }}
              >
                {customerDetails.phone}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin
                className="w-4 h-4 flex-shrink-0"
                style={{ color: colors.textSecondary }}
              />
              <span
                className="text-sm"
                style={{ color: colors.textPrimary }}
              >
                {customer.region}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar
                className="w-4 h-4 flex-shrink-0"
                style={{ color: colors.textSecondary }}
              />
              <span
                className="text-sm"
                style={{ color: colors.textPrimary }}
              >
                Joined {customerDetails.joinDate}
              </span>
            </div>
          </div>

          <div
            className="p-4 rounded-lg mb-4"
            style={{
              backgroundColor: `${getLoyaltyColor(customerDetails.loyaltyTier)}10`,
              border: `1px solid ${getLoyaltyColor(customerDetails.loyaltyTier)}30`,
            }}
          >
            <div
              className="text-xs uppercase tracking-wide mb-2"
              style={{ color: colors.textSecondary }}
            >
              Loyalty Tier
            </div>
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-lg font-bold"
                style={{
                  color: getLoyaltyColor(customerDetails.loyaltyTier),
                }}
              >
                {customerDetails.loyaltyTier}
              </span>
              <span
                className="text-sm font-mono font-bold"
                style={{ color: colors.textPrimary }}
              >
                {customerDetails.loyaltyPoints} pts
              </span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: colors.cardBorder }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: "75%",
                  backgroundColor: getLoyaltyColor(customerDetails.loyaltyTier),
                }}
              />
            </div>
          </div>

          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
            }}
          >
            <div
              className="text-xs uppercase tracking-wide mb-2"
              style={{ color: colors.textSecondary }}
            >
              Satisfaction Score
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4"
                    style={{
                      color:
                        star <= Math.floor(customerDetails.satisfactionScore)
                          ? colors.accentGold
                          : colors.cardBorder,
                      fill:
                        star <= Math.floor(customerDetails.satisfactionScore)
                          ? colors.accentGold
                          : "none",
                    }}
                  />
                ))}
              </div>
              <span
                className="text-lg font-bold font-mono"
                style={{ color: colors.textPrimary }}
              >
                {customerDetails.satisfactionScore}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all"
                style={{
                  backgroundColor:
                    activeTab === tab.id ? `${colors.accent}15` : colors.background,
                  color: activeTab === tab.id ? colors.accent : colors.textSecondary,
                  border: `1px solid ${activeTab === tab.id ? colors.accent : colors.cardBorder}`,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            className="rounded-xl p-4 md:p-6 border min-h-[400px]"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder,
            }}
          >
            {activeTab === "history" && (
              <div>
                <h4
                  className="text-sm font-bold uppercase tracking-wide mb-4"
                  style={{ color: colors.textPrimary }}
                >
                  Past Bookings
                </h4>
                <div className="space-y-3">
                  {bookingHistory.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 rounded-lg border transition-all"
                      style={{
                        backgroundColor: colors.cardBg,
                        borderColor: colors.cardBorder,
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${colors.accent}15` }}
                          >
                            <Ship
                              className="w-5 h-5"
                              style={{ color: colors.accent }}
                            />
                          </div>
                          <div>
                            <div
                              className="text-sm font-semibold mb-1"
                              style={{ color: colors.textPrimary }}
                            >
                              {booking.yacht}
                            </div>
                            <div
                              className="flex items-center gap-2 text-xs"
                              style={{ color: colors.textSecondary }}
                            >
                              <Package className="w-3 h-3 flex-shrink-0" />
                              <span>{booking.package}</span>
                            </div>
                          </div>
                        </div>
                        <div
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${colors.success}15`,
                            color: colors.success,
                          }}
                        >
                          {booking.status}
                        </div>
                      </div>
                      <div
                        className="flex items-center justify-between pt-3 border-t"
                        style={{ borderColor: colors.cardBorder }}
                      >
                        <div
                          className="flex items-center gap-2 text-xs"
                          style={{ color: colors.textSecondary }}
                        >
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span>{booking.date}</span>
                        </div>
                        <div
                          className="text-sm font-mono font-bold"
                          style={{ color: colors.textPrimary }}
                        >
                          ${booking.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "communication" && (
              <div>
                <h4
                  className="text-sm font-bold uppercase tracking-wide mb-4"
                  style={{ color: colors.textPrimary }}
                >
                  Communication Timeline
                </h4>
                <div className="space-y-4">
                  {communications.map((comm, idx) => {
                    const Icon = comm.icon;
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <div
                          className="p-2 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: `${colors.accent}15` }}
                        >
                          <Icon
                            className="w-4 h-4"
                            style={{ color: colors.accent }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className="text-sm mb-1"
                            style={{ color: colors.textPrimary }}
                          >
                            {comm.message}
                          </div>
                          <div
                            className="text-xs"
                            style={{ color: colors.textSecondary }}
                          >
                            {comm.timestamp}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "notes" && (
              <div>
                <h4
                  className="text-sm font-bold uppercase tracking-wide mb-4"
                  style={{ color: colors.textPrimary }}
                >
                  Customer Notes
                </h4>
                <textarea
                  placeholder="Add notes about this customer..."
                  rows={8}
                  className="w-full px-4 py-3 rounded-lg border text-sm resize-none focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                />
                <button
                  type="button"
                  className="mt-3 px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
                  style={{
                    background: `linear-gradient(to right, ${colors.accent}, #00B39F)`,
                    boxShadow: `0 10px 25px -5px ${colors.accent}30`,
                  }}
                >
                  Save Notes
                </button>
              </div>
            )}

            {activeTab === "surveys" && (
              <div>
                <h4
                  className="text-sm font-bold uppercase tracking-wide mb-4"
                  style={{ color: colors.textPrimary }}
                >
                  Survey Responses
                </h4>
                <div
                  className="text-center py-12"
                  style={{ color: colors.textSecondary }}
                >
                  No survey responses yet
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDetailPanel;
