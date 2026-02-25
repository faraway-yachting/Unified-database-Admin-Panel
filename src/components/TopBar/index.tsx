"use client";

import { ReactNode } from "react";
import { useTheme } from "@/context/ThemeContext";

interface TopBarProps {
  title: string;
  actions?: ReactNode;
}

export function TopBar({ title, actions }: TopBarProps) {
  const { colors } = useTheme();

  return (
    <header
      className="fixed top-0 right-0 left-0 lg:left-[240px] z-30 h-[72px] flex items-center justify-between px-4 md:px-6 border-b"
      style={{
        backgroundColor: colors.background,
        borderColor: "rgba(255, 255, 255, 0.06)",
      }}
    >
      <h1
        className="text-xl md:text-2xl font-bold truncate"
        style={{ color: colors.textPrimary }}
      >
        {title}
      </h1>
      {actions && (
        <div className="flex items-center shrink-0 ml-4">{actions}</div>
      )}
    </header>
  );
}

export default TopBar;
