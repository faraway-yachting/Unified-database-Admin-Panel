"use client";

import { Plus, Search, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { useCRM, type CRMSegmentFilter } from "@/context/CRMContext";

const SEGMENT_TABS: CRMSegmentFilter[] = [
  "All Customers",
  "Leads",
  "Active",
  "VIP",
  "Churned",
];

export function CRMTopBarActions() {
  const { colors } = useTheme();
  const {
    selectedSegment,
    setSelectedSegment,
    searchQuery,
    setSearchQuery,
  } = useCRM();

  return (
    <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 overflow-x-auto">
      <div className="hidden lg:flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: colors.background }}>
        {SEGMENT_TABS.map((segment) => (
          <button
            key={segment}
            type="button"
            onClick={() => setSelectedSegment(segment)}
            className="px-3 xl:px-4 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-all whitespace-nowrap"
            style={{
              backgroundColor: selectedSegment === segment ? colors.accent : "transparent",
              color: selectedSegment === segment ? "#FFFFFF" : colors.textSecondary,
            }}
          >
            {segment}
          </button>
        ))}
      </div>

      <div className="lg:hidden relative flex-shrink-0">
        <select
          value={selectedSegment}
          onChange={(e) => setSelectedSegment(e.target.value as CRMSegmentFilter)}
          className="px-3 py-2 rounded-lg border text-xs cursor-pointer appearance-none pr-8 focus:outline-none"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.cardBorder,
            color: colors.textPrimary,
          }}
        >
          {SEGMENT_TABS.map((segment) => (
            <option key={segment} value={segment}>
              {segment}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
          style={{ color: colors.textSecondary }}
          aria-hidden
        />
      </div>

      <div className="relative hidden sm:block flex-shrink-0">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: colors.textSecondary }}
          aria-hidden
        />
        <input
          type="text"
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-4 py-2 rounded-lg border text-sm w-48 xl:w-64 transition-all focus:outline-none focus:ring-2"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.cardBorder,
            color: colors.textPrimary,
          }}
        />
      </div>

      <Link
        href="/crm/new"
        className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-lg transition-all text-xs md:text-sm font-semibold text-white shadow-lg flex-shrink-0"
        style={{
          background: `linear-gradient(to right, ${colors.accent}, #00B39F)`,
          boxShadow: `0 10px 25px -5px ${colors.accent}30`,
        }}
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Add Customer</span>
      </Link>
    </div>
  );
}

export default CRMTopBarActions;
