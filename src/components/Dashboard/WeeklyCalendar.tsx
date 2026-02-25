"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface WeekDayEvent {
  date: string;
  dayName: string;
  bookingCount: number;
  isToday: boolean;
}

function generateWeekData(weekOffset: number = 0): WeekDayEvent[] {
  const today = new Date(2026, 1, 18);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(
    today.getDate() - today.getDay() + 1 + weekOffset * 7
  );

  const bookingCounts = [8, 12, 9, 15, 18, 22, 19];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const days: WeekDayEvent[] = [];

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(startOfWeek.getDate() + i);
    const isToday =
      currentDay.getDate() === today.getDate() &&
      currentDay.getMonth() === today.getMonth() &&
      currentDay.getFullYear() === today.getFullYear();

    days.push({
      date: currentDay.getDate().toString(),
      dayName: dayNames[i],
      bookingCount: bookingCounts[i],
      isToday,
    });
  }
  return days;
}

function getWeekLabel(weekOffset: number) {
  if (weekOffset === 0) return "This Week";
  if (weekOffset === -1) return "Last Week";
  if (weekOffset === 1) return "Next Week";
  if (weekOffset < 0) return `${Math.abs(weekOffset)} Weeks Ago`;
  return `${weekOffset} Weeks Ahead`;
}

function getMonthYear(weekOffset: number) {
  const days = generateWeekData(weekOffset);
  if (days.length === 0) return "";
  const first = parseInt(days[0].date, 10);
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const d = new Date(2026, 1, first);
  return `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
}

interface WeeklyCalendarProps {
  events?: WeekDayEvent[];
}

export function WeeklyCalendar({ events: propEvents }: WeeklyCalendarProps) {
  const { colors } = useTheme();
  const [weekOffset, setWeekOffset] = useState(0);
  const days = propEvents ?? generateWeekData(weekOffset);

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
            {propEvents ? "This Week" : getWeekLabel(weekOffset)}
          </h3>
          <p
            className="text-sm"
            style={{ color: colors.textSecondary }}
          >
            {propEvents ? "" : getMonthYear(weekOffset)}
          </p>
        </div>
        {!propEvents && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setWeekOffset((p) => p - 1)}
              className="p-1.5 rounded-lg border transition-all"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${colors.accent}50`;
                e.currentTarget.style.backgroundColor = `${colors.accent}0D`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.cardBorder;
                e.currentTarget.style.backgroundColor = colors.background;
              }}
            >
              <ChevronLeft className="w-4 h-4" style={{ color: colors.textSecondary }} />
            </button>
            <button
              type="button"
              onClick={() => setWeekOffset((p) => p + 1)}
              className="p-1.5 rounded-lg border transition-all"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${colors.accent}50`;
                e.currentTarget.style.backgroundColor = `${colors.accent}0D`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.cardBorder;
                e.currentTarget.style.backgroundColor = colors.background;
              }}
            >
              <ChevronRight className="w-4 h-4" style={{ color: colors.textSecondary }} />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-7 gap-3">
        {days.map((day, index) => (
          <div
            key={`${day.date}-${day.dayName}-${index}`}
            className="p-3 rounded-lg border transition-all cursor-pointer"
            style={{
              backgroundColor: day.isToday ? `${colors.accent}15` : colors.background,
              borderColor: day.isToday ? `${colors.accent}80` : colors.cardBorder,
            }}
            onMouseEnter={(e) => {
              if (!day.isToday) {
                e.currentTarget.style.borderColor = `${colors.textSecondary}30`;
              }
            }}
            onMouseLeave={(e) => {
              if (!day.isToday) {
                e.currentTarget.style.borderColor = colors.cardBorder;
              }
            }}
          >
            <div className="text-center">
              <div
                className="text-[10px] font-medium mb-1 uppercase tracking-wide"
                style={{
                  color: day.isToday ? colors.accent : colors.textSecondary,
                }}
              >
                {day.dayName}
              </div>
              <div
                className="text-lg font-bold mb-1.5"
                style={{
                  color: day.isToday ? colors.accent : colors.textPrimary,
                }}
              >
                {day.date}
              </div>
              <div
                className="text-[11px] font-mono"
                style={{
                  color:
                    day.bookingCount > 0 ? colors.accentGold : colors.textSecondary,
                }}
              >
                {day.bookingCount}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyCalendar;
