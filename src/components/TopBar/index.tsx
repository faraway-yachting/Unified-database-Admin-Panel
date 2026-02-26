"use client";

import { ReactNode } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

interface TopBarProps {
  title: string;
  actions?: ReactNode;
}

const HEADER_HEIGHT = 72;

export function TopBar({ title, actions }: TopBarProps) {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <header
      className="fixed top-0 right-0 left-0 lg:left-[240px] z-30 flex items-center justify-between px-4 md:px-6 border-b"
      style={{
        height: HEADER_HEIGHT,
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder,
      }}
    >
      <h1
        className="text-xl md:text-2xl font-bold truncate"
        style={{ color: colors.textPrimary }}
      >
        {title}
      </h1>
      <div className="flex items-center shrink-0 gap-3 ml-4">
        {/* Theme toggle - available from anywhere */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg border transition-colors hover:opacity-90"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.cardBorder,
            color: colors.textSecondary,
          }}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" style={{ color: colors.accentGold }} />
          ) : (
            <Moon className="w-5 h-5" style={{ color: colors.accent }} />
          )}
        </button>
        {actions && <div className="flex items-center">{actions}</div>}
      </div>
    </header>
  );
}

export default TopBar;
export { HEADER_HEIGHT };
