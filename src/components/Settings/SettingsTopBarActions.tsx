"use client";

import { Save, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function SettingsTopBarActions() {
  const { colors } = useTheme();

  return (
    <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
      <button
        type="button"
        className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border transition-all hover:scale-105 text-xs md:text-sm font-medium"
        style={{
          borderColor: colors.cardBorder,
          color: colors.textSecondary,
          backgroundColor: "transparent",
        }}
      >
        <X className="w-4 h-4" />
        <span className="hidden sm:inline">Discard</span>
      </button>
      <button
        type="button"
        className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-lg transition-all hover:scale-105 text-xs md:text-sm font-semibold text-white shadow-lg"
        style={{
          background: `linear-gradient(to right, ${colors.accent}, #00B39F)`,
          boxShadow: `0 10px 25px -5px ${colors.accent}30`,
        }}
      >
        <Save className="w-4 h-4" />
        <span className="hidden sm:inline">Save All Changes</span>
        <span className="sm:hidden">Save</span>
      </button>
    </div>
  );
}

export default SettingsTopBarActions;
