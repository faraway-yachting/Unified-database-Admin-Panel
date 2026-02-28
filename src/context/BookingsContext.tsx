"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

type BookingStatusFilter =
  | "All"
  | "Inquiry"
  | "Confirmed"
  | "Paid"
  | "Completed"
  | "Cancelled";

interface BookingsContextValue {
  selectedStatus: BookingStatusFilter;
  setSelectedStatus: (s: BookingStatusFilter) => void;
  selectedRegion: string;
  setSelectedRegion: (r: string) => void;
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
}

const defaultValue: BookingsContextValue = {
  selectedStatus: "All",
  setSelectedStatus: () => {},
  selectedRegion: "All Regions",
  setSelectedRegion: () => {},
  isCreateOpen: false,
  setIsCreateOpen: () => {},
};

const BookingsContext = createContext<BookingsContextValue>(defaultValue);

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [selectedStatus, setSelectedStatus] = useState<BookingStatusFilter>("All");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const value: BookingsContextValue = {
    selectedStatus,
    setSelectedStatus: useCallback((s: BookingStatusFilter) => setSelectedStatus(s), []),
    selectedRegion,
    setSelectedRegion: useCallback((r: string) => setSelectedRegion(r), []),
    isCreateOpen,
    setIsCreateOpen: useCallback((open: boolean) => setIsCreateOpen(open), []),
  };

  return (
    <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingsContext);
  return context ?? defaultValue;
}

export type { BookingStatusFilter };
