"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type CRMSegmentFilter =
  | "All Customers"
  | "Leads"
  | "Active"
  | "VIP"
  | "Churned";

interface CRMContextValue {
  selectedSegment: CRMSegmentFilter;
  setSelectedSegment: (s: CRMSegmentFilter) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const defaultValue: CRMContextValue = {
  selectedSegment: "All Customers",
  setSelectedSegment: () => {},
  searchQuery: "",
  setSearchQuery: () => {},
};

const CRMContext = createContext<CRMContextValue>(defaultValue);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [selectedSegment, setSelectedSegment] =
    useState<CRMSegmentFilter>("All Customers");
  const [searchQuery, setSearchQuery] = useState("");

  const value: CRMContextValue = {
    selectedSegment,
    setSelectedSegment: useCallback((s: CRMSegmentFilter) => setSelectedSegment(s), []),
    searchQuery,
    setSearchQuery: useCallback((q: string) => setSearchQuery(q), []),
  };

  return (
    <CRMContext.Provider value={value}>{children}</CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  return context ?? defaultValue;
}
