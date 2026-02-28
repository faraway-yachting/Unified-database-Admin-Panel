"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface BookingEvent {
  id: string;
  yacht: string;
  customer: string;
  status: "confirmed" | "paid" | "inquiry" | "completed" | "cancelled";
  day: number;
}

interface BookingCalendarProps {
  monthLabel: string;
  monthIndex: number;
  year: number;
  bookings: BookingEvent[];
  isLoading?: boolean;
  errorMessage?: string;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
}

export function BookingCalendar({
  monthLabel,
  monthIndex,
  year,
  bookings,
  isLoading,
  errorMessage,
  onPrevMonth,
  onNextMonth,
}: BookingCalendarProps) {
  const { colors } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "paid":
        return colors.accent;
      case "inquiry":
        return colors.accentGold;
      case "completed":
        return colors.textSecondary;
      case "cancelled":
        return colors.danger;
      default:
        return colors.textSecondary;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const firstDayOffset = (firstDay + 6) % 7;
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === monthIndex;

  return (
    <div
      className="rounded-xl p-4 md:p-6 border backdrop-blur-sm"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder,
      }}
    >
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h3
            className="text-base md:text-lg font-bold mb-1"
            style={{ color: colors.textPrimary }}
          >
            Booking Calendar
          </h3>
          <p
            className="text-xs md:text-sm"
            style={{ color: colors.textSecondary }}
          >
            {monthLabel} {year}
          </p>
          {isLoading && (
            <p className="text-[10px] md:text-xs mt-1" style={{ color: colors.textSecondary }}>
              Loading calendar...
            </p>
          )}
          {errorMessage && !isLoading && (
            <p className="text-[10px] md:text-xs mt-1" style={{ color: colors.danger }}>
              {errorMessage}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-1.5 md:p-2 rounded-lg transition-all"
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
            onClick={onPrevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-1.5 md:p-2 rounded-lg transition-all"
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
            onClick={onNextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
          <div
            key={idx}
            className="text-center text-[10px] md:text-xs font-semibold uppercase tracking-wide py-2"
            style={{ color: colors.textSecondary }}
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day[0]}</span>
          </div>
        ))}
        {Array.from({ length: firstDayOffset }).map((_, idx) => (
          <div key={`empty-${idx}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const dayBookings = bookings.filter((b) => b.day === day);
          const isToday = isCurrentMonth && day === today.getDate();

          return (
            <div
              key={day}
              className="min-h-[60px] md:min-h-[100px] p-1 md:p-2 rounded-lg border transition-all cursor-pointer"
              style={{
                backgroundColor: colors.background,
                borderColor: isToday ? colors.accent : colors.cardBorder,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isToday ? colors.accent : colors.cardBorder;
              }}
            >
              <div
                className="text-[10px] md:text-xs font-medium mb-1 md:mb-2"
                style={{ color: isToday ? colors.accent : colors.textPrimary }}
              >
                {day}
              </div>
              <div className="space-y-0.5 md:space-y-1">
                {dayBookings.slice(0, 2).map((booking) => (
                  <div
                    key={booking.id}
                    className="px-1 md:px-2 py-0.5 md:py-1 rounded text-[8px] md:text-xs font-medium truncate"
                    style={{
                      backgroundColor: `${getStatusColor(booking.status)}20`,
                      color: getStatusColor(booking.status),
                      border: `1px solid ${getStatusColor(booking.status)}50`,
                    }}
                    title={`${booking.customer} - ${booking.yacht}`}
                  >
                    <div className="font-semibold hidden md:block">
                      {getInitials(booking.customer)}
                    </div>
                    <div className="md:hidden font-semibold">
                      {getInitials(booking.customer)[0]}
                    </div>
                    <div className="text-[8px] md:text-[10px] opacity-80 truncate hidden md:block">
                      {booking.yacht}
                    </div>
                  </div>
                ))}
                {dayBookings.length > 2 && (
                  <div
                    className="text-[8px] md:text-[10px] text-center"
                    style={{ color: colors.textSecondary }}
                  >
                    +{dayBookings.length - 2}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="flex flex-wrap items-center gap-3 md:gap-4 mt-4 md:mt-6 pt-4 md:pt-6 border-t"
        style={{ borderColor: colors.cardBorder }}
      >
        <div className="flex items-center gap-1.5 md:gap-2">
          <div
            className="w-2 h-2 md:w-3 md:h-3 rounded"
            style={{ backgroundColor: colors.accent }}
          />
          <span className="text-[10px] md:text-xs" style={{ color: colors.textSecondary }}>
            Confirmed
          </span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <div
            className="w-2 h-2 md:w-3 md:h-3 rounded"
            style={{ backgroundColor: colors.accentGold }}
          />
          <span className="text-[10px] md:text-xs" style={{ color: colors.textSecondary }}>
            Inquiry
          </span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <div
            className="w-2 h-2 md:w-3 md:h-3 rounded"
            style={{ backgroundColor: colors.textSecondary }}
          />
          <span className="text-[10px] md:text-xs" style={{ color: colors.textSecondary }}>
            Completed
          </span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <div
            className="w-2 h-2 md:w-3 md:h-3 rounded"
            style={{ backgroundColor: colors.danger }}
          />
          <span className="text-[10px] md:text-xs" style={{ color: colors.textSecondary }}>
            Cancelled
          </span>
        </div>
      </div>
    </div>
  );
}

export default BookingCalendar;
