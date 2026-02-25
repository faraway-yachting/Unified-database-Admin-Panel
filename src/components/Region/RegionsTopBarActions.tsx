"use client";

import { Plus, Eye } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

export function RegionsTopBarActions() {
  const { colors } = useTheme();

  return (
    <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
      <button
        type="button"
        className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border transition-all hover:scale-105 text-xs md:text-sm font-medium"
        style={{
          borderColor: colors.accent,
          color: colors.accent,
          backgroundColor: "transparent",
        }}
      >
        <Eye className="w-4 h-4" />
        <span className="hidden sm:inline">Preview Site</span>
      </button>

      <Link
        href="/regions/new"
        className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-lg transition-all hover:scale-105 text-xs md:text-sm font-semibold text-white shadow-lg flex-shrink-0"
        style={{
          background: `linear-gradient(to right, ${colors.accent}, #00B39F)`,
          boxShadow: `0 10px 25px -5px ${colors.accent}30`,
        }}
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Add Region</span>
        <span className="sm:hidden">Add</span>
      </Link>
    </div>
  );
}

export default RegionsTopBarActions;
