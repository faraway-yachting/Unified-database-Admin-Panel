"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useTheme } from "@/context/ThemeContext";

const REGION_COLORS = [
  "#00C9B1",
  "#F4A924",
  "#8B5CF6",
  "#EC4899",
  "#3B82F6",
  "#10B981",
];

export interface RevenueDataPoint {
  month: string;
  [key: string]: string | number;
}

export interface RevenueSeriesConfig {
  dataKey: string;
  color: string;
}

interface RevenueChartProps {
  data: RevenueDataPoint[];
  seriesConfig?: RevenueSeriesConfig[];
}

export function RevenueChart({ data, seriesConfig }: RevenueChartProps) {
  const { colors } = useTheme();

  const series = seriesConfig ?? (data.length
    ? Object.keys(data[0])
        .filter((k) => k !== "month")
        .map((k, i) => ({
          dataKey: k,
          color: REGION_COLORS[i % REGION_COLORS.length],
        }))
    : []);

  return (
    <div
      className="rounded-xl p-4 sm:p-6 border backdrop-blur-sm h-[280px] sm:h-[320px] lg:h-[360px]"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder,
      }}
    >
      <div className="flex items-start justify-between mb-6 flex-wrap gap-2">
        <div>
          <h3
            className="text-lg font-bold mb-1"
            style={{ color: colors.textPrimary }}
          >
            Revenue by Region
          </h3>
          <p
            className="text-sm"
            style={{ color: colors.textSecondary }}
          >
            Monthly breakdown across all regions
          </p>
        </div>
        {series.length > 0 && (
          <div className="flex gap-4 text-xs flex-wrap">
            {series.map((s) => (
              <div key={s.dataKey} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span style={{ color: colors.textSecondary }}>{s.dataKey}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {data.length > 0 && series.length > 0 ? (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data}>
            <defs>
              {series.map((s) => (
                <linearGradient
                  key={s.dataKey}
                  id={`gradient-${s.dataKey}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.chartGrid} />
            <XAxis
              dataKey="month"
              stroke={colors.textSecondary}
              style={{ fontSize: "12px", fontFamily: "monospace" }}
            />
            <YAxis
              stroke={colors.textSecondary}
              style={{ fontSize: "12px", fontFamily: "monospace" }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: "8px",
                fontFamily: "monospace",
                fontSize: "12px",
                color: colors.textPrimary,
              }}
              formatter={(value: number) => `$${Number(value).toLocaleString()}`}
            />
            {series.map((s) => (
              <Area
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                stroke={s.color}
                fillOpacity={1}
                fill={`url(#gradient-${s.dataKey})`}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div
          className="flex items-center justify-center h-[260px] text-sm"
          style={{ color: colors.textSecondary }}
        >
          No revenue data to display
        </div>
      )}
    </div>
  );
}

export default RevenueChart;
