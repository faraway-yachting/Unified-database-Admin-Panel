"use client";

import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface PackageFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedRegion: string;
  selectedDuration: string;
  selectedStatus: string;
  minPrice: string;
  maxPrice: string;
  regions: Array<{ id: string; name: string }>;
  regionsLoading?: boolean;
  onRegionChange: (value: string) => void;
  onDurationChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
}

const durations = [
  { label: "All Durations", value: "" },
  { label: "Half-day", value: "half_day" },
  { label: "Full-day", value: "full_day" },
  { label: "Weekly", value: "weekly" },
  { label: "Custom", value: "custom" },
];

const statuses = [
  { label: "All Status", value: "" },
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
];

export function PackageFilters({
  searchQuery,
  onSearchChange,
  selectedRegion,
  selectedDuration,
  selectedStatus,
  minPrice,
  maxPrice,
  regions,
  regionsLoading,
  onRegionChange,
  onDurationChange,
  onStatusChange,
  onMinPriceChange,
  onMaxPriceChange,
}: PackageFiltersProps) {
  const { colors } = useTheme();

  const clearFilters = () => {
    onSearchChange("");
    onRegionChange("");
    onDurationChange("");
    onStatusChange("");
    onMinPriceChange("");
    onMaxPriceChange("");
  };

  return (
    <div
      className="rounded-xl p-4 md:p-6 border backdrop-blur-sm"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder,
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="w-5 h-5" style={{ color: colors.accent }} />
        <h3 className="text-base md:text-lg font-bold" style={{ color: colors.textPrimary }}>
          Quick Filters
        </h3>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-[220px] flex-1">
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

        <div className="min-w-[180px]">
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
              disabled={regionsLoading}
            >
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
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

        <div className="min-w-[180px]">
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
                <option key={duration.value || "all"} value={duration.value}>
                  {duration.label}
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

        <div className="min-w-[180px]">
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
                <option key={status.value || "all"} value={status.value}>
                  {status.label}
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

        <div className="min-w-[240px]">
          <label
            className="text-xs font-semibold uppercase tracking-wide mb-2 block"
            style={{ color: colors.textSecondary }}
          >
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min={0}
              placeholder="Min"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder,
                color: colors.textPrimary,
              }}
            />
            <input
              type="number"
              min={0}
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder,
                color: colors.textPrimary,
              }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="px-4 py-2.5 rounded-lg border text-sm font-medium transition-all"
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
    </div>
  );
}

export default PackageFilters;
