"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type FleetFilter = "all" | "available" | "booked" | "maintenance";

export type FleetYachtType = "sailboat" | "motor" | "catamaran" | "gulet";
export type FleetStatusFilter = "available" | "booked" | "maintenance" | "retired";

export interface FleetFilters {
  regionId: string;
  type: FleetYachtType | "";
  status: FleetStatusFilter | "";
  minCapacity: number;
  maxCapacity: number;
  isActive: boolean;
  includeCompany: boolean;
  includeRegion: boolean;
  includeImages: boolean;
}

export const defaultFleetFilters: FleetFilters = {
  regionId: "",
  type: "",
  status: "",
  minCapacity: 0,
  maxCapacity: 100,
  isActive: false,
  includeCompany: false,
  includeRegion: false,
  includeImages: false,
};

interface FleetTopBarActionsContextValue {
  activeFilter: FleetFilter;
  setActiveFilter: (filter: FleetFilter) => void;
  fleetFilters: FleetFilters;
  setFleetFilters: (filters: FleetFilters | ((prev: FleetFilters) => FleetFilters)) => void;
}

const defaultValue: FleetTopBarActionsContextValue = {
  activeFilter: "all",
  setActiveFilter: () => {},
  fleetFilters: defaultFleetFilters,
  setFleetFilters: () => {},
};

const FleetTopBarActionsContext =
  createContext<FleetTopBarActionsContextValue>(defaultValue);

export function FleetTopBarActionsProvider({ children }: { children: ReactNode }) {
  const [activeFilter, setActiveFilter] = useState<FleetFilter>("all");
  const [fleetFilters, setFleetFiltersState] = useState<FleetFilters>(defaultFleetFilters);

  const setFilter = useCallback((filter: FleetFilter) => {
    setActiveFilter(filter);
  }, []);

  const setFleetFilters = useCallback((f: FleetFilters | ((prev: FleetFilters) => FleetFilters)) => {
    setFleetFiltersState(typeof f === "function" ? f : () => f);
  }, []);

  const value = {
    activeFilter,
    setActiveFilter: setFilter,
    fleetFilters,
    setFleetFilters,
  };

  return (
    <FleetTopBarActionsContext.Provider value={value}>
      {children}
    </FleetTopBarActionsContext.Provider>
  );
}

export function useFleetTopBarActions() {
  const context = useContext(FleetTopBarActionsContext);
  return context ?? defaultValue;
}
