"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useTheme } from "@/context/ThemeContext";

export interface RegionPerformanceItem {
  name: string;
  revenue: number;
  bookings: number;
  occupancy: number;
  color: string;
}

interface RegionPerformanceProps {
  regions: RegionPerformanceItem[];
}

export function RegionPerformance({ regions }: RegionPerformanceProps) {
  const { colors } = useTheme();
  const [metric, setMetric] = useState<"revenue" | "bookings" | "occupancy">(
    "revenue"
  );

  const metrics = [
    {
      id: "revenue" as const,
      label: "Revenue",
      format: (val: number) => `$${(val / 1000).toFixed(0)}K`,
    },
    {
      id: "bookings" as const,
      label: "Bookings",
      format: (val: number) => val.toString(),
    },
    {
      id: "occupancy" as const,
      label: "Occupancy Rate",
      format: (val: number) => `${val}%`,
    },
  ];

  const chartData = regions.map((region) => ({
    name: region.name,
    value: region[metric],
    color: region.color,
  }));

  const currentMetric = metrics.find((m) => m.id === metric)!;

  return (
    <div
      className="rounded-lg border p-4 md:p-6"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder,
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h3
          className="text-lg font-bold"
          style={{ color: colors.textPrimary }}
        >
          Region Performance
        </h3>
        <div
          className="flex gap-1 p-1 rounded-lg w-fit"
          style={{ backgroundColor: colors.background }}
        >
          {metrics.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMetric(m.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
              style={{
                backgroundColor: metric === m.id ? colors.accent : "transparent",
                color: metric === m.id ? "#FFFFFF" : colors.textSecondary,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={colors.cardBorder}
              horizontal={false}
            />
            <XAxis
              type="number"
              stroke={colors.textSecondary}
              tick={{ fill: colors.textSecondary, fontSize: 12 }}
              tickFormatter={(value) => currentMetric.format(value)}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke={colors.textSecondary}
              tick={{ fill: colors.textSecondary, fontSize: 12 }}
              width={80}
            />
            <Bar
              dataKey="value"
              radius={[0, 4, 4, 0]}
              label={{
                position: "right",
                fill: colors.textPrimary,
                fontSize: 12,
                formatter: (value: number) => currentMetric.format(value),
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RegionPerformance;
