"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

export type LoadingSpinnerSize = "xs" | "sm" | "md" | "lg";

export type LoadingSpinnerVariant = "inline" | "overlay" | "fullScreen";

export interface LoadingSpinnerProps {
  /** Size of the spinner ring */
  size?: LoadingSpinnerSize;
  /** Optional label below the spinner */
  text?: string;
  /** Layout: inline (flow), overlay (covers parent), fullScreen (covers viewport) */
  variant?: LoadingSpinnerVariant;
  /** Optional className for the wrapper */
  className?: string;
}

const sizeMap: Record<LoadingSpinnerSize, { ring: string; stroke: string }> = {
  xs: { ring: "w-4 h-4", stroke: "border-2" },
  sm: { ring: "w-6 h-6", stroke: "border-2" },
  md: { ring: "w-10 h-10", stroke: "border-[3px]" },
  lg: { ring: "w-14 h-14", stroke: "border-4" },
};

/**
 * Design-system loading spinner. Uses theme colors (accent, textSecondary, background).
 * Use variant="inline" inside content, variant="overlay" over a card/section, variant="fullScreen" for page-level.
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  text,
  variant = "inline",
  className = "",
}) => {
  const { colors } = useTheme();
  const { ring, stroke } = sizeMap[size];

  const spinnerEl = (
    <div
      className={`${ring} ${stroke} rounded-full border-t-transparent animate-spin shrink-0`}
      style={{
        borderColor: colors.cardBorder,
        borderTopColor: colors.accent,
      }}
      aria-hidden
    />
  );

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      {spinnerEl}
      {text && (
        <p
          className="text-sm font-medium"
          style={{ color: colors.textSecondary }}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (variant === "inline") {
    return (
      <div
        className={`flex flex-col items-center justify-center p-6 ${className}`}
        role="status"
        aria-label={text ?? "Loading"}
      >
        {content}
      </div>
    );
  }

  if (variant === "overlay") {
    return (
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center z-10 ${className}`}
        style={{ backgroundColor: `${colors.background}ee` }}
        role="status"
        aria-label={text ?? "Loading"}
      >
        {content}
      </div>
    );
  }

  // fullScreen
  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-[100] ${className}`}
      style={{ backgroundColor: colors.background }}
      role="status"
      aria-label={text ?? "Loading"}
    >
      {content}
    </div>
  );
};

export default LoadingSpinner;
