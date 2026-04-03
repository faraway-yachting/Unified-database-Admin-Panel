"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

export interface CheckboxOption {
  id: string;
  name: string;
}

interface CheckboxDropdownProps {
  options: CheckboxOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export default function CheckboxDropdown({
  options,
  selected,
  onChange,
  placeholder = "Select...",
  isLoading = false,
}: CheckboxDropdownProps) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const label =
    selected.length === 0
      ? placeholder
      : options
          .filter((o) => selected.includes(o.id))
          .map((o) => o.name)
          .join(", ");

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-3 py-2 rounded-lg border text-sm text-left flex items-center justify-between outline-none"
        style={{
          backgroundColor: colors.hoverBg,
          borderColor: colors.cardBorder,
          color: selected.length > 0 ? colors.textPrimary : colors.textSecondary,
        }}
      >
        <span className="truncate">{label}</span>
        <svg
          className="w-4 h-4 shrink-0 ml-2 transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", color: colors.textSecondary }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute z-50 mt-1 w-full rounded-lg border shadow-lg overflow-auto max-h-52"
          style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}
        >
          {isLoading ? (
            <p className="px-3 py-2 text-xs" style={{ color: colors.textSecondary }}>
              Loading...
            </p>
          ) : options.length === 0 ? (
            <p className="px-3 py-2 text-xs" style={{ color: colors.textSecondary }}>
              No options available
            </p>
          ) : null}
          {options.map((opt) => {
            const checked = selected.includes(opt.id);
            return (
              <label
                key={opt.id}
                className="flex items-center gap-2 px-3 py-2 cursor-pointer text-sm hover:opacity-80"
                style={{
                  color: colors.textPrimary,
                  backgroundColor: checked ? colors.hoverBg : "transparent",
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(opt.id)}
                  className="w-3.5 h-3.5 rounded accent-current shrink-0"
                  style={{ accentColor: colors.accent }}
                />
                {opt.name}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
