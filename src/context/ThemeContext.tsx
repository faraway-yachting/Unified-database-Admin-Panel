"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    background: string;
    cardBg: string;
    cardBorder: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    accentGold: string;
    hoverBg: string;
    success: string;
    warning: string;
    danger: string;
    chartGrid: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("yacht-theme") as Theme | null;
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("yacht-theme", newTheme);
  };

  const colors =
    theme === "dark"
      ? {
          background: "#0B1120",
          cardBg: "#111827",
          cardBorder: "rgba(255, 255, 255, 0.05)",
          textPrimary: "#FFFFFF",
          textSecondary: "#9CA3AF",
          accent: "#00C9B1",
          accentGold: "#F4A924",
          hoverBg: "#1F2937",
          success: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
          chartGrid: "rgba(255, 255, 255, 0.05)",
        }
      : {
          background: "#F8F9FC",
          cardBg: "#FFFFFF",
          cardBorder: "rgba(0, 0, 0, 0.08)",
          textPrimary: "#0F172A",
          textSecondary: "#64748B",
          accent: "#00B39F",
          accentGold: "#D97706",
          hoverBg: "#F1F5F9",
          success: "#059669",
          warning: "#D97706",
          danger: "#DC2626",
          chartGrid: "rgba(0, 0, 0, 0.05)",
        };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
