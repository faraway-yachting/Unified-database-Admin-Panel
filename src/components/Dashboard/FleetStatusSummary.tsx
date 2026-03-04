"use client";

import { useTheme } from "@/context/ThemeContext";

export interface FleetStatusCount {
  status: string;
  count: number;
}

interface FleetStatusSummaryProps {
  items: FleetStatusCount[];
}

const STATUS_LABELS: Record<string, string> = {
  available: "Available",
  booked: "Booked",
  maintenance: "Maintenance",
  retired: "Retired",
};

export function FleetStatusSummary({ items }: FleetStatusSummaryProps) {
  const { colors } = useTheme();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "available":
        return {
          label: "Available",
          bgColor: `${colors.accent}15`,
          textColor: colors.accent,
          borderColor: `${colors.accent}50`,
        };
      case "booked":
        return {
          label: "Booked",
          bgColor: `${colors.accentGold}15`,
          textColor: colors.accentGold,
          borderColor: `${colors.accentGold}50`,
        };
      case "maintenance":
        return {
          label: "Maintenance",
          bgColor: `${colors.danger}15`,
          textColor: colors.danger,
          borderColor: `${colors.danger}50`,
        };
      case "retired":
        return {
          label: "Retired",
          bgColor: `${colors.textSecondary}15`,
          textColor: colors.textSecondary,
          borderColor: `${colors.textSecondary}50`,
        };
      default:
        return {
          label: status,
          bgColor: colors.cardBorder,
          textColor: colors.textSecondary,
          borderColor: colors.cardBorder,
        };
    }
  };

  return (
    <div
      className="rounded-xl p-6 border backdrop-blur-sm"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder,
      }}
    >
      <div className="mb-6">
        <h3
          className="text-lg font-bold mb-1"
          style={{ color: colors.textPrimary }}
        >
          Fleet Status
        </h3>
        <p
          className="text-sm"
          style={{ color: colors.textSecondary }}
        >
          Yacht availability summary
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item) => {
          const config = getStatusConfig(item.status);
          return (
            <div
              key={item.status}
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: config.bgColor,
                borderColor: config.borderColor,
              }}
            >
              <div
                className="text-2xl font-bold mb-1"
                style={{ color: config.textColor }}
              >
                {item.count}
              </div>
              <div
                className="text-sm"
                style={{ color: config.textColor }}
              >
                {config.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FleetStatusSummary;
