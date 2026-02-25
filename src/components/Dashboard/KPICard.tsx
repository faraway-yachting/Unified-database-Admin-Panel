"use client";

import type { LucideIcon } from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { useTheme } from "@/context/ThemeContext";

interface KPICardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change: number;
  sparklineData: Array<{ value: number }>;
}

export function KPICard({
  icon: Icon,
  label,
  value,
  change,
  sparklineData,
}: KPICardProps) {
  const { colors } = useTheme();
  const isPositive = change >= 0;

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
        <div className="flex items-start justify-between mb-4">
          <div
            className="p-2.5 rounded-lg"
            style={{ backgroundColor: `${colors.accent}15` }}
          >
            <Icon className="w-5 h-5" style={{ color: colors.accent }} />
          </div>
          <div
            className="px-2.5 py-1 rounded-full text-xs font-mono"
            style={{
              backgroundColor: isPositive
                ? `${colors.success}15`
                : `${colors.danger}15`,
              color: isPositive ? colors.success : colors.danger,
            }}
          >
            {isPositive ? "+" : ""}
            {change}%
          </div>
        </div>

        <div className="mb-4">
          <div
            className="text-2xl font-mono font-bold mb-1"
            style={{ color: colors.textPrimary }}
          >
            {value}
          </div>
          <div
            className="text-sm"
            style={{ color: colors.textSecondary }}
          >
            {label}
          </div>
        </div>

        <div className="h-12 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={colors.accent}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default KPICard;
