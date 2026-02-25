"use client";

import type { LucideIcon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface FleetKPICardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: number;
  statusColor?: string;
}

export function FleetKPICard({
  icon: Icon,
  label,
  value,
  change,
  statusColor: statusColorProp,
}: FleetKPICardProps) {
  const { colors } = useTheme();
  const statusColor = statusColorProp ?? colors.accent;

  return (
    <div
      className="rounded-xl p-6 border backdrop-blur-sm relative overflow-hidden group transition-all"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${colors.accent}50`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colors.cardBorder;
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(to bottom right, ${colors.accent}0D, transparent)`,
        }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${statusColor}15` }}
          >
            <Icon className="w-6 h-6" style={{ color: statusColor }} />
          </div>
          {change !== undefined && (
            <div
              className="px-2.5 py-1 rounded-full text-xs font-mono"
              style={{
                backgroundColor:
                  change >= 0 ? `${colors.success}15` : `${colors.danger}15`,
                color: change >= 0 ? colors.success : colors.danger,
              }}
            >
              {change >= 0 ? "+" : ""}
              {change}%
            </div>
          )}
        </div>

        <div className="text-3xl font-mono font-bold mb-1" style={{ color: colors.textPrimary }}>
          {value}
        </div>
        <div className="text-sm" style={{ color: colors.textSecondary }}>
          {label}
        </div>
      </div>
    </div>
  );
}

export default FleetKPICard;
