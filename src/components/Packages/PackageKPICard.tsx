"use client";

import type { LucideIcon } from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { useTheme } from "@/context/ThemeContext";

interface PackageKPICardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  sparklineData: Array<{ value: number }>;
}

export function PackageKPICard({
  icon: Icon,
  label,
  value,
  sparklineData,
}: PackageKPICardProps) {
  const { colors } = useTheme();

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
            className="p-2.5 rounded-lg"
            style={{ backgroundColor: `${colors.accent}15` }}
          >
            <Icon className="w-5 h-5" style={{ color: colors.accent }} />
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

        <div className="h-10 -mx-2">
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

export default PackageKPICard;
