"use client";

import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface PackageFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedRegion: string;
  selectedDuration: string;
  selectedStatus: string;
  onRegionChange: (value: string) => void;
  onDurationChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const regions = ["All Regions", "Mediterranean", "Caribbean", "Pacific", "Indian Ocean"];
const durations = ["All Durations", "Half-day", "Full-day", "Weekly", "Custom"];
const statuses = ["All Status", "Active", "Draft"];

export function PackageFilters({
  searchQuery,
  onSearchChange,
  selectedRegion,
  selectedDuration,
  selectedStatus,
  onRegionChange,
  onDurationChange,
  onStatusChange,
}: PackageFiltersProps) {
  const { colors } = useTheme();

  const clearFilters = () => {
    onSearchChange("");
    onRegionChange("All Regions");
    onDurationChange("All Durations");
    onStatusChange("All Status");
  };

  return (
    <div
      className="rounded-xl p-4 md:p-6 border backdrop-blur-sm lg:sticky lg:top-24 h-fit"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder,
      }}
    >
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <SlidersHorizontal className="w-5 h-5" style={{ color: colors.accent }} />
        <h3 className="text-base md:text-lg font-bold" style={{ color: colors.textPrimary }}>
          Quick Filters
        </h3>
      </div>

      <div className="mb-6">
        <label
          className="text-xs font-semibold uppercase tracking-wide mb-2 block"
          style={{ color: colors.textSecondary }}
        >
          Search Package
        </label>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: colors.textSecondary }}
            aria-hidden
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder,
              color: colors.textPrimary,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = `${colors.accent}50`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = colors.cardBorder;
            }}
          />
        </div>
      </div>

      <div className="mb-6">
        <label
          className="text-xs font-semibold uppercase tracking-wide mb-2 block"
          style={{ color: colors.textSecondary }}
        >
          Region
        </label>
        <div className="relative">
          <select
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border text-sm appearance-none transition-all cursor-pointer focus:outline-none"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder,
              color: colors.textPrimary,
            }}
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: colors.textSecondary }}
            aria-hidden
          />
        </div>
      </div>

      <div className="mb-6">
        <label
          className="text-xs font-semibold uppercase tracking-wide mb-2 block"
          style={{ color: colors.textSecondary }}
        >
          Duration Type
        </label>
        <div className="relative">
          <select
            value={selectedDuration}
            onChange={(e) => onDurationChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border text-sm appearance-none transition-all cursor-pointer focus:outline-none"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder,
              color: colors.textPrimary,
            }}
          >
            {durations.map((duration) => (
              <option key={duration} value={duration}>
                {duration}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: colors.textSecondary }}
            aria-hidden
          />
        </div>
      </div>

      <div className="mb-6">
        <label
          className="text-xs font-semibold uppercase tracking-wide mb-2 block"
          style={{ color: colors.textSecondary }}
        >
          Price Range
        </label>
        <div className="flex items-center gap-2 text-sm" style={{ color: colors.textPrimary }}>
          <span>$500</span>
          <div
            className="flex-1 h-1 rounded-full relative"
            style={{ backgroundColor: colors.cardBorder }}
          >
            <div
              className="absolute h-full rounded-full"
              style={{ width: "65%", backgroundColor: colors.accent }}
            />
          </div>
          <span>$10k</span>
        </div>
        <div className="text-xs mt-2 text-center" style={{ color: colors.textSecondary }}>
          $1,500 - $8,000
        </div>
      </div>

      <div className="mb-6">
        <label
          className="text-xs font-semibold uppercase tracking-wide mb-2 block"
          style={{ color: colors.textSecondary }}
        >
          Status
        </label>
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border text-sm appearance-none transition-all cursor-pointer focus:outline-none"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder,
              color: colors.textPrimary,
            }}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: colors.textSecondary }}
            aria-hidden
          />
        </div>
      </div>

      <button
        type="button"
        onClick={clearFilters}
        className="w-full py-2.5 rounded-lg border text-sm font-medium transition-all"
        style={{
          backgroundColor: "transparent",
          borderColor: colors.cardBorder,
          color: colors.textSecondary,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = colors.accent;
          e.currentTarget.style.color = colors.accent;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = colors.cardBorder;
          e.currentTarget.style.color = colors.textSecondary;
        }}
      >
        Clear Filters
      </button>
    </div>
  );
}

export default PackageFilters;
