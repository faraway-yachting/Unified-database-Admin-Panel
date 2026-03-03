"use client";

import { Plus, ChevronDown } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useBookings, type BookingStatusFilter } from "@/context/BookingsContext";

const STATUS_TABS: BookingStatusFilter[] = [
  "All",
  "Inquiry",
  "Confirmed",
  "Paid",
  "Completed",
  "Cancelled",
];

export function BookingsTopBarActions() {
  const { colors } = useTheme();
  const { selectedStatus, setSelectedStatus, setIsCreateOpen } = useBookings();

  return (
    <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 overflow-x-auto">
      <div className="hidden lg:flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: colors.background }}>
        {STATUS_TABS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setSelectedStatus(status)}
            className="px-3 xl:px-4 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-all whitespace-nowrap"
            style={{
              backgroundColor: selectedStatus === status ? colors.accent : "transparent",
              color: selectedStatus === status ? "#FFFFFF" : colors.textSecondary,
            }}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="lg:hidden relative flex-shrink-0">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as BookingStatusFilter)}
          className="px-3 py-2 rounded-lg border text-xs cursor-pointer appearance-none pr-8 focus:outline-none"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.cardBorder,
            color: colors.textPrimary,
          }}
        >
          {STATUS_TABS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
          style={{ color: colors.textSecondary }}
          aria-hidden
        />
      </div>

      <button
        type="button"
        onClick={() => setIsCreateOpen(true)}
        className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-lg transition-all text-xs md:text-sm font-semibold text-white shadow-lg flex-shrink-0"
        style={{
          background: `linear-gradient(to right, ${colors.accent}, #00B39F)`,
          boxShadow: `0 10px 25px -5px ${colors.accent}30`,
        }}
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">New Booking</span>
      </button>
    </div>
  );
}

export default BookingsTopBarActions;
