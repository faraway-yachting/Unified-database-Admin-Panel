"use client";

import { Plus } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { usePackageBuilder } from "@/context/PackageBuilderContext";

export function PackageTopBarActions() {
  const { colors } = useTheme();
  const { setIsFormOpen } = usePackageBuilder();

  return (
    <div className="flex items-center gap-2 md:gap-4">
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
