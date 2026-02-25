"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface SeasonalEvent {
  startDay: number;
  endDay: number;
  type: "peak" | "holiday" | "lastminute";
  month: number;
}

interface SeasonalRulesCalendarProps {
  events: SeasonalEvent[];
}

export function SeasonalRulesCalendar({ events }: SeasonalRulesCalendarProps) {
  const { colors } = useTheme();

  const months = [
    { name: "February", days: 28, startOffset: 5 },
    { name: "March", days: 31, startOffset: 5 },
    { name: "April", days: 30, startOffset: 1 },
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "peak":
        return colors.accent;
      case "holiday":
        return colors.accentGold;
      case "lastminute":
        return "#FF6347";
      default:
        return colors.textSecondary;
    }
  };

  const getDayEvents = (monthIdx: number, day: number) => {
    return events.filter(
      (e) => e.month === monthIdx && day >= e.startDay && day <= e.endDay
    );
  };

  return (
    <div
      className="rounded-xl p-6 border backdrop-blur-sm"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder,
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3
            className="text-lg font-bold mb-1"
            style={{ color: colors.textPrimary }}
          >
            Seasonal Calendar
          </h3>
          <p
            className="text-sm"
            style={{ color: colors.textSecondary }}
          >
            3-month pricing overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-1.5 rounded-lg transition-all"
            style={{
              backgroundColor: colors.background,
              color: colors.textPrimary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${colors.accent}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.background;
            }}
            aria-label="Previous period"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-lg transition-all"
            style={{
              backgroundColor: colors.background,
              color: colors.textPrimary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${colors.accent}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.background;
            }}
            aria-label="Next period"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {months.map((month, monthIdx) => (
          <div key={monthIdx}>
            <div
              className="text-xs font-semibold uppercase tracking-wide mb-2"
              style={{ color: colors.textPrimary }}
            >
              {month.name}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
                <div
                  key={idx}
                  className="text-center text-[10px] font-medium py-1"
                  style={{ color: colors.textSecondary }}
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: month.startOffset }).map((_, idx) => (
                <div key={`empty-${idx}`} />
              ))}
              {Array.from({ length: month.days }, (_, i) => i + 1).map((day) => {
                const dayEvents = getDayEvents(monthIdx, day);
                const hasEvents = dayEvents.length > 0;
                const eventColor = hasEvents
                  ? getEventTypeColor(dayEvents[0].type)
                  : colors.cardBorder;

                return (
                  <div
                    key={day}
                    className="aspect-square flex items-center justify-center text-[10px] rounded border transition-all cursor-pointer"
                    style={{
                      backgroundColor: hasEvents
                        ? `${eventColor}15`
                        : colors.background,
                      borderColor: hasEvents ? eventColor : colors.cardBorder,
                      color: hasEvents ? eventColor : colors.textPrimary,
                    }}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div
        className="flex items-center gap-4 mt-6 pt-6 border-t flex-wrap"
        style={{ borderColor: colors.cardBorder }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: colors.accent }}
          />
          <span
            className="text-xs"
            style={{ color: colors.textSecondary }}
          >
            Peak Season
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: colors.accentGold }}
          />
          <span
            className="text-xs"
            style={{ color: colors.textSecondary }}
          >
            Holidays
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: "#FF6347" }}
          />
          <span
            className="text-xs"
            style={{ color: colors.textSecondary }}
          >
            Last-minute
          </span>
        </div>
      </div>
    </div>
  );
}

export default SeasonalRulesCalendar;
