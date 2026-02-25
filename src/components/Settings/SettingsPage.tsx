"use client";

import { useState } from "react";
import {
  Settings as SettingsIcon,
  Users,
  DollarSign,
  Mail,
  Bell,
  Puzzle,
  CreditCard,
  FileText,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { GeneralSettings } from "./GeneralSettings";
import { UsersPermissions } from "./UsersPermissions";
import { CurrencySettings } from "./CurrencySettings";
import { EmailTemplates } from "./EmailTemplates";
import { NotificationSettings } from "./NotificationSettings";
import { IntegrationSettings } from "./IntegrationSettings";
import { AuditLog } from "./AuditLog";

const settingsCategories = [
  { id: "general", label: "General", icon: SettingsIcon },
  { id: "users", label: "Users & Permissions", icon: Users },
  { id: "currency", label: "Currency & Exchange Rates", icon: DollarSign },
  { id: "email", label: "Email Templates", icon: Mail },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "integrations", label: "Integrations", icon: Puzzle },
  { id: "billing", label: "Billing & Subscription", icon: CreditCard },
  { id: "audit", label: "Audit Log", icon: FileText },
];

export function SettingsPage() {
  const { colors } = useTheme();
  const [activeCategory, setActiveCategory] = useState("general");

  const renderContent = () => {
    switch (activeCategory) {
      case "general":
        return <GeneralSettings />;
      case "users":
        return <UsersPermissions />;
      case "currency":
        return <CurrencySettings />;
      case "email":
        return <EmailTemplates />;
      case "notifications":
        return <NotificationSettings />;
      case "integrations":
        return <IntegrationSettings />;
      case "billing":
        return (
          <div
            className="rounded-lg border p-8 text-center"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.cardBorder,
            }}
          >
            <CreditCard
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: colors.textSecondary }}
            />
            <h3
              className="text-xl font-bold mb-2"
              style={{ color: colors.textPrimary }}
            >
              Billing & Subscription
            </h3>
            <p
              className="text-sm"
              style={{ color: colors.textSecondary }}
            >
              Billing and subscription management coming soon
            </p>
          </div>
        );
      case "audit":
        return <AuditLog />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="flex">
      {/* Settings Sidebar - Desktop */}
      <div
        className="hidden lg:block w-[240px] border-r min-h-[calc(100vh-72px)] sticky top-[72px] flex-shrink-0"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder,
        }}
      >
        <div className="p-4">
          <nav className="space-y-1">
            {settingsCategories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all hover:scale-[1.02] focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: isActive
                      ? `${colors.accent}20`
                      : "transparent",
                    color: isActive ? colors.accent : colors.textSecondary,
                  }}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Settings Tabs - Mobile/Tablet Horizontal Scroll */}
      <div
        className="lg:hidden fixed top-[72px] left-0 right-0 border-b overflow-x-auto backdrop-blur-sm z-10"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder,
        }}
      >
        <div className="flex gap-2 p-3 min-w-max">
          {settingsCategories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: isActive ? colors.accent : colors.background,
                  color: isActive ? "#FFFFFF" : colors.textSecondary,
                }}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 lg:pt-6 pt-[140px] lg:pt-8 min-w-0">
        {renderContent()}
      </div>
    </div>
  );
}

export default SettingsPage;
