"use client";

import type { LucideIcon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface CRMKPICardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change: number;
  sparklineData?: { value: number }[];
}

export function CRMKPICard({
  icon: Icon,
  label,
  value,
  change,
  sparklineData = [],
}: CRMKPICardProps) {
  const { colors } = useTheme();

  return (
    <div
      className="rounded-xl p-4 md:p-6 border backdrop-blur-sm transition-all hover:scale-[1.02]"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder,
      }}
    >
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div
          className="p-2 md:p-3 rounded-lg"
          style={{ backgroundColor: `${colors.accent}15` }}
        >
          <Icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: colors.accent }} />
        </div>
        <div
          className="px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[10px] md:text-xs font-semibold"
          style={{
            backgroundColor: change >= 0 ? `${colors.success}15` : `${colors.danger}15`,
            color: change >= 0 ? colors.success : colors.danger,
          }}
        >
          {change >= 0 ? "+" : ""}
          {change}%
        </div>
      </div>

      <div className="mb-2 md:mb-3">
        <div
          className="text-xl md:text-2xl lg:text-3xl font-bold mb-1 font-mono"
          style={{ color: colors.textPrimary }}
        >
          {value}
        </div>
        <div
          className="text-xs md:text-sm font-medium"
          style={{ color: colors.textSecondary }}
        >
          {label}
        </div>
      </div>

      {sparklineData.length > 0 && (
        <div className="flex items-end gap-0.5 md:gap-1 h-8 md:h-10">
          {sparklineData.map((point, idx) => (
            <div
              key={idx}
              className="flex-1 rounded-t transition-all"
              style={{
                height: `${(point.value / Math.max(...sparklineData.map((p) => p.value))) * 100}%`,
                backgroundColor: `${colors.accent}40`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CRMKPICard;
