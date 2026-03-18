"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useTheme } from "@/context/ThemeContext";

export interface BookingsDonutItem {
  region: string;
  bookings: number;
  color: string;
}

interface BookingsDonutProps {
  data: BookingsDonutItem[];
}

export function BookingsDonut({ data }: BookingsDonutProps) {
  const { colors } = useTheme();
  const total = data.reduce((sum, item) => sum + item.bookings, 0);

  return (
    <div
      className="rounded-xl p-4 sm:p-6 border backdrop-blur-sm flex flex-col h-[280px] sm:h-[320px] lg:h-[360px] overflow-hidden"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder,
      }}
    >
      <div className="shrink-0 mb-4">
        <h3
          className="text-lg font-bold mb-1"
          style={{ color: colors.textPrimary }}
        >
          Bookings by Region
        </h3>
        <p
          className="text-sm"
          style={{ color: colors.textSecondary }}
        >
          Distribution across all locations
        </p>
      </div>

      <div className="flex items-center justify-center shrink-0 h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="bookings"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: "8px",
                fontFamily: "monospace",
                fontSize: "12px",
                color: colors.textPrimary,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex-1 min-h-0 overflow-y-auto overflow-x-hidden space-y-2">
        {data.map((item) => (
          <div
            key={item.region}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span
                className="text-sm truncate"
                style={{ color: colors.textPrimary }}
              >
                {item.region}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span
                className="text-sm font-mono font-bold"
                style={{ color: colors.textPrimary }}
              >
                {item.bookings}
              </span>
              <span
                className="text-xs"
                style={{ color: colors.textSecondary }}
              >
                {total ? ((item.bookings / total) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingsDonut;
