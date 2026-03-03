"use client";

import { Medal } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface TopPackage {
  rank: number;
  name: string;
  totalBookings: number;
  totalRevenue: number;
  avgBookingValue: number;
}

interface TopPerformingPackagesProps {
  packages: TopPackage[];
}

export function TopPerformingPackages({ packages }: TopPerformingPackagesProps) {
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
          Top Performing Packages
        </h3>
        <p
          className="text-sm"
          style={{ color: colors.textSecondary }}
        >
          Ranked by total revenue
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
              <th
                className="text-left text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                style={{ color: colors.textSecondary }}
              >
                Rank
              </th>
              <th
                className="text-left text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                style={{ color: colors.textSecondary }}
              >
                Package Name
              </th>
              <th
                className="text-left text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                style={{ color: colors.textSecondary }}
              >
                Bookings
              </th>
              <th
                className="text-right text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                style={{ color: colors.textSecondary }}
              >
                Revenue
              </th>
              <th
                className="text-right text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                style={{ color: colors.textSecondary }}
              >
                Avg. Value
              </th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => {
              const isTopThree = pkg.rank <= 3;

              return (
                <tr
                  key={pkg.rank}
                  className="transition-colors relative"
                  style={{
                    borderBottom: `1px solid ${colors.cardBorder}`,
                    borderLeft: isTopThree
                      ? `3px solid ${colors.accentGold}`
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.hoverBg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      {isTopThree && (
                        <Medal
                          className="w-4 h-4 flex-shrink-0"
                          style={{ color: colors.accentGold }}
                        />
                      )}
                      <span
                        className="text-sm font-bold font-mono"
                        style={{
                          color: isTopThree
                            ? colors.accentGold
                            : colors.textSecondary,
                        }}
                      >
                        #{pkg.rank}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div
                      className="text-sm font-semibold"
                      style={{ color: colors.textPrimary }}
                    >
                      {pkg.name}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div
                      className="text-sm font-mono"
                      style={{ color: colors.textPrimary }}
                    >
                      {pkg.totalBookings}
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div
                      className="text-sm font-mono font-bold"
                      style={{ color: colors.textPrimary }}
                    >
                      ${(pkg.totalRevenue / 1000).toFixed(0)}k
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div
                      className="text-sm font-mono"
                      style={{ color: colors.textPrimary }}
                    >
                      ${(pkg.avgBookingValue / 1000).toFixed(1)}k
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopPerformingPackages;
