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
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
}

const defaultValue: PackageBuilderContextValue = {
  searchQuery: "",
  setSearchQuery: () => {},
  selectedRegion: "",
  setSelectedRegion: () => {},
  selectedDuration: "",
  setSelectedDuration: () => {},
  selectedStatus: "",
  setSelectedStatus: () => {},
  minPrice: "",
  setMinPrice: () => {},
  maxPrice: "",
  setMaxPrice: () => {},
  isFormOpen: false,
  setIsFormOpen: () => {},
};

const PackageBuilderContext =
  createContext<PackageBuilderContextValue>(defaultValue);

export function PackageBuilderProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
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
    minPrice,
    setMinPrice: useCallback((v: string) => setMinPrice(v), []),
    maxPrice,
    setMaxPrice: useCallback((v: string) => setMaxPrice(v), []),
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
