"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

type FleetFilter = "all" | "available" | "booked" | "maintenance";

interface FleetTopBarActionsContextValue {
  activeFilter: FleetFilter;
  setActiveFilter: (filter: FleetFilter) => void;
}

const defaultValue: FleetTopBarActionsContextValue = {
  activeFilter: "all",
  setActiveFilter: () => {},
};

const FleetTopBarActionsContext =
  createContext<FleetTopBarActionsContextValue>(defaultValue);

export function FleetTopBarActionsProvider({ children }: { children: ReactNode }) {
  const [activeFilter, setActiveFilter] = useState<FleetFilter>("all");
  const setFilter = useCallback((filter: FleetFilter) => {
    setActiveFilter(filter);
  }, []);
  const value = { activeFilter, setActiveFilter: setFilter };
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

export type { FleetFilter };
