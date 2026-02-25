"use client";

import { TrendingUp } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface TopPackageItem {
  rank: number;
  name: string;
  region: string;
  bookings: number;
  revenue: number;
  change: number;
}

interface TopPackagesProps {
  packages: TopPackageItem[];
}

export function TopPackages({ packages }: TopPackagesProps) {
  const { colors } = useTheme();

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
          Top 5 Packages
        </h3>
        <p
          className="text-sm"
          style={{ color: colors.textSecondary }}
        >
          Ranked by revenue performance
        </p>
      </div>

      <div className="space-y-4">
        {packages.map((pkg) => (
          <div
            key={pkg.rank}
            className="flex items-center gap-4 p-4 rounded-lg border transition-all"
            style={{
              backgroundColor: colors.background,
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
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
              style={{
                backgroundColor:
                  pkg.rank === 1
                    ? `${colors.accentGold}30`
                    : pkg.rank === 2
                      ? `${colors.textSecondary}30`
                      : pkg.rank === 3
                        ? "#D9770630"
                        : colors.cardBorder,
                color:
                  pkg.rank === 1
                    ? colors.accentGold
                    : pkg.rank === 2
                      ? colors.textSecondary
                      : pkg.rank === 3
                        ? "#D97706"
                        : colors.textSecondary,
              }}
            >
              {pkg.rank}
            </div>

            <div className="flex-1 min-w-0">
              <h4
                className="text-sm font-semibold mb-1 truncate"
                style={{ color: colors.textPrimary }}
              >
                {pkg.name}
              </h4>
              <div
                className="flex items-center gap-3 text-xs"
                style={{ color: colors.textSecondary }}
              >
                <span>{pkg.region}</span>
                <span>•</span>
                <span>{pkg.bookings} bookings</span>
              </div>
            </div>

            <div className="text-right">
              <div
                className="text-sm font-mono font-bold mb-1"
                style={{ color: colors.textPrimary }}
              >
                ${pkg.revenue.toLocaleString()}
              </div>
              <div
                className="flex items-center gap-1 text-xs"
                style={{ color: colors.success }}
              >
                <TrendingUp className="w-3 h-3" />
                <span>+{pkg.change}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopPackages;
