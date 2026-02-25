"use client";

import { Plus, ChevronDown } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { usePackageBuilder } from "@/context/PackageBuilderContext";

const REGIONS = [
  "All Regions",
  "Mediterranean",
  "Caribbean",
  "Pacific",
  "Indian Ocean",
];

export function PackageTopBarActions() {
  const { colors } = useTheme();
  const { selectedRegion, setSelectedRegion, setIsFormOpen } = usePackageBuilder();

  return (
    <div className="flex items-center gap-2 md:gap-4">
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
      <button
        type="button"
        onClick={() => setIsFormOpen(true)}
        className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-lg transition-all text-xs md:text-sm font-semibold text-white shadow-lg"
        style={{
          background: `linear-gradient(to right, ${colors.accent}, #00B39F)`,
          boxShadow: `0 10px 25px -5px ${colors.accent}30`,
        }}
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Create Package</span>
      </button>
    </div>
  );
}

export default PackageTopBarActions;
