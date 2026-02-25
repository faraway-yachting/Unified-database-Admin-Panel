"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface PackageBuilderContextValue {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedRegion: string;
  setSelectedRegion: (r: string) => void;
  selectedDuration: string;
  setSelectedDuration: (d: string) => void;
  selectedStatus: string;
  setSelectedStatus: (s: string) => void;
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
}

const defaultValue: PackageBuilderContextValue = {
  searchQuery: "",
  setSearchQuery: () => {},
  selectedRegion: "All Regions",
  setSelectedRegion: () => {},
  selectedDuration: "All Durations",
  setSelectedDuration: () => {},
  selectedStatus: "All Status",
  setSelectedStatus: () => {},
  isFormOpen: false,
  setIsFormOpen: () => {},
};

const PackageBuilderContext =
  createContext<PackageBuilderContextValue>(defaultValue);

export function PackageBuilderProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedDuration, setSelectedDuration] = useState("All Durations");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const value: PackageBuilderContextValue = {
    searchQuery,
    setSearchQuery,
    selectedRegion,
    setSelectedRegion: useCallback((r: string) => setSelectedRegion(r), []),
    selectedDuration,
    setSelectedDuration: useCallback((d: string) => setSelectedDuration(d), []),
    selectedStatus,
    setSelectedStatus: useCallback((s: string) => setSelectedStatus(s), []),
    isFormOpen,
    setIsFormOpen: useCallback((open: boolean) => setIsFormOpen(open), []),
  };

  return (
    <PackageBuilderContext.Provider value={value}>
      {children}
    </PackageBuilderContext.Provider>
  );
}

export function usePackageBuilder() {
  const context = useContext(PackageBuilderContext);
  return context ?? defaultValue;
}
