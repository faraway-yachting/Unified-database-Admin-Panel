"use client";

import { Plus, Download, Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { usePricing } from "@/context/PricingContext";

const REGIONS = [
  "All Regions",
  "Mediterranean",
  "Caribbean",
  "Pacific",
  "Indian Ocean",
];

export function PricingTopBarActions() {
  const { colors } = useTheme();
  const { selectedRegion, setSelectedRegion, dateRangeLabel } = usePricing();

  return (
    <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 overflow-x-auto">
      <div className="relative hidden sm:block">
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="px-3 md:px-4 py-2 rounded-lg border text-xs md:text-sm transition-all cursor-pointer appearance-none pr-8 md:pr-10 focus:outline-none focus:ring-2"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.cardBorder,
            color: colors.textPrimary,
          }}
        >
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 pointer-events-none"
          style={{ color: colors.textSecondary }}
          aria-hidden
        />
      </div>

      <div className="relative hidden md:block">
        <button
          type="button"
          className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border text-xs md:text-sm transition-all"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.cardBorder,
            color: colors.textPrimary,
          }}
        >
          <CalendarIcon className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden lg:inline">{dateRangeLabel}</span>
          <span className="lg:hidden">Feb 2026</span>
          <ChevronDown
            className="w-3 h-3 md:w-4 md:h-4"
            style={{ color: colors.textSecondary }}
          />
        </button>
      </div>

      <button
        type="button"
        className="hidden md:flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border text-xs md:text-sm font-medium transition-all"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.cardBorder,
          color: colors.textPrimary,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = colors.textSecondary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = colors.cardBorder;
        }}
      >
        <Download className="w-3 h-3 md:w-4 md:h-4" />
        <span className="hidden lg:inline">Export Report</span>
      </button>

      <Link
        href="/pricing/rules/new"
        className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-lg transition-all text-xs md:text-sm font-semibold text-white shadow-lg flex-shrink-0"
        style={{
          background: `linear-gradient(to right, ${colors.accent}, #00B39F)`,
          boxShadow: `0 10px 25px -5px ${colors.accent}30`,
        }}
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Add Rule</span>
      </Link>
    </div>
  );
}

export default PricingTopBarActions;
