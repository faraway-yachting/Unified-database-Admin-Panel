"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface PricingContextValue {
  selectedRegion: string;
  setSelectedRegion: (r: string) => void;
  dateRangeLabel: string;
  setDateRangeLabel: (l: string) => void;
  isCreateRuleOpen: boolean;
  setIsCreateRuleOpen: (open: boolean) => void;
}

const defaultValue: PricingContextValue = {
  selectedRegion: "All Regions",
  setSelectedRegion: () => {},
  dateRangeLabel: "Feb 1 - Feb 28, 2026",
  setDateRangeLabel: () => {},
  isCreateRuleOpen: false,
  setIsCreateRuleOpen: () => {},
};

const PricingContext = createContext<PricingContextValue>(defaultValue);

export function PricingProvider({ children }: { children: ReactNode }) {
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [dateRangeLabel, setDateRangeLabel] = useState("Feb 1 - Feb 28, 2026");
  const [isCreateRuleOpen, setIsCreateRuleOpen] = useState(false);

  const value: PricingContextValue = {
    selectedRegion,
    setSelectedRegion: useCallback((r: string) => setSelectedRegion(r), []),
    dateRangeLabel,
    setDateRangeLabel: useCallback((l: string) => setDateRangeLabel(l), []),
    isCreateRuleOpen,
    setIsCreateRuleOpen: useCallback((open: boolean) => setIsCreateRuleOpen(open), []),
  };

  return (
    <PricingContext.Provider value={value}>{children}</PricingContext.Provider>
  );
}

export function usePricing() {
  const context = useContext(PricingContext);
  return context ?? defaultValue;
}
