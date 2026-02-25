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

export interface RevenueDataPoint {
  month: string;
  mediterranean: number;
  caribbean: number;
  pacific: number;
  indian: number;
}

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const { colors } = useTheme();

  return (
    <div
      className="rounded-xl p-6 border backdrop-blur-sm h-[360px]"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder,
      }}
    >
      <div className="flex items-start justify-between mb-6">
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
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.accent }}
            />
            <span style={{ color: colors.textSecondary }}>Mediterranean</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.accentGold }}
            />
            <span style={{ color: colors.textSecondary }}>Caribbean</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
            <span style={{ color: colors.textSecondary }}>Pacific</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#EC4899]" />
            <span style={{ color: colors.textSecondary }}>Indian Ocean</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="mediterranean" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.accent} stopOpacity={0.3} />
              <stop offset="95%" stopColor={colors.accent} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="caribbean" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.accentGold} stopOpacity={0.3} />
              <stop offset="95%" stopColor={colors.accentGold} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="pacific" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="indian" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
            </linearGradient>
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
          <Area
            type="monotone"
            dataKey="mediterranean"
            stroke={colors.accent}
            fillOpacity={1}
            fill="url(#mediterranean)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="caribbean"
            stroke={colors.accentGold}
            fillOpacity={1}
            fill="url(#caribbean)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="pacific"
            stroke="#8B5CF6"
            fillOpacity={1}
            fill="url(#pacific)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="indian"
            stroke="#EC4899"
            fillOpacity={1}
            fill="url(#indian)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueChart;
