"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { useFleetTopBarActions, type FleetFilter } from "@/context/FleetTopBarActionsContext";

const FILTERS: FleetFilter[] = ["all", "available", "booked", "maintenance"];

export function FleetTopBarActions() {
  const { colors } = useTheme();
  const { activeFilter, setActiveFilter } = useFleetTopBarActions();

  return (
    <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
      <div
        className="hidden sm:flex items-center gap-1 p-1 rounded-lg"
        style={{ backgroundColor: colors.background }}
      >
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className="px-3 md:px-4 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all capitalize"
            style={{
              backgroundColor: activeFilter === filter ? colors.accent : "transparent",
              color: activeFilter === filter ? "#0B1120" : colors.textSecondary,
            }}
          >
            {filter === "all" ? "All" : filter}
          </button>
        ))}
      </div>
      <Link
        href="/yachts/addnewyachts"
        className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-lg transition-all text-xs md:text-sm font-semibold text-white shadow-lg"
        style={{
          background: `linear-gradient(to right, ${colors.accent}, #00B39F)`,
          boxShadow: `0 10px 25px -5px ${colors.accent}30`,
        }}
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Add Yacht</span>
      </Link>
    </div>
  );
}

export default FleetTopBarActions;
