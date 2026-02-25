"use client";

import { useState } from "react";
import { Ship, CheckCircle, Wrench, Calendar } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useFleetTopBarActions } from "@/context/FleetTopBarActionsContext";
import { FleetKPICard } from "./FleetKPICard";
import { YachtCard, type Yacht } from "./YachtCard";
import { YachtDetailDrawer } from "./YachtDetailDrawer";

const fleetData: Yacht[] = [
  {
    id: "Y-001",
    name: "Azure Dream",
    type: "Sailboat",
    image:
      "https://images.unsplash.com/photo-1598555071897-42022f8bfca7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    length: 82,
    capacity: 12,
    year: 2022,
    region: "Mediterranean",
    status: "Available",
  },
  {
    id: "Y-002",
    name: "Ocean Majesty",
    type: "Motor Yacht",
    image:
      "https://images.unsplash.com/photo-1683964012191-7cd5617e164d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    length: 95,
    capacity: 10,
    year: 2023,
    region: "Caribbean",
    status: "Booked",
  },
  {
    id: "Y-003",
    name: "Twin Seas",
    type: "Catamaran",
    image:
      "https://images.unsplash.com/photo-1769610352818-cf8fa29ccf9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    length: 68,
    capacity: 8,
    year: 2021,
    region: "Pacific",
    status: "Available",
  },
  {
    id: "Y-004",
    name: "Wind Chaser",
    type: "Sailboat",
    image:
      "https://images.unsplash.com/photo-1692496697713-0e360f67fdb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    length: 75,
    capacity: 10,
    year: 2020,
    region: "Mediterranean",
    status: "Maintenance",
  },
  {
    id: "Y-005",
    name: "Platinum Wave",
    type: "Motor Yacht",
    image:
      "https://images.unsplash.com/photo-1633892224063-8ef7ff14508f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    length: 105,
    capacity: 14,
    year: 2024,
    region: "Caribbean",
    status: "Available",
  },
  {
    id: "Y-006",
    name: "Sea Harmony",
    type: "Catamaran",
    image:
      "https://images.unsplash.com/photo-1705104159597-68a08a9ca8fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    length: 72,
    capacity: 9,
    year: 2022,
    region: "Indian Ocean",
    status: "Booked",
  },
  {
    id: "Y-007",
    name: "Silver Horizon",
    type: "Motor Yacht",
    image:
      "https://images.unsplash.com/photo-1740482881430-53d0e1c04fef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    length: 88,
    capacity: 11,
    year: 2023,
    region: "Mediterranean",
    status: "Available",
  },
  {
    id: "Y-008",
    name: "Sunset Paradise",
    type: "Sailboat",
    image:
      "https://images.unsplash.com/photo-1598555071897-42022f8bfca7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    length: 78,
    capacity: 10,
    year: 2021,
    region: "Pacific",
    status: "Available",
  },
];

function statusToFilter(status: string): string {
  const s = status.toLowerCase();
  if (s === "available" || s === "booked" || s === "maintenance") return s;
  return "all";
}

export default function FleetManagement() {
  const { colors } = useTheme();
  const { activeFilter, setActiveFilter } = useFleetTopBarActions();
  const [selectedYacht, setSelectedYacht] = useState<Yacht | null>(null);

  const filteredYachts =
    activeFilter === "all"
      ? fleetData
      : fleetData.filter(
          (yacht) => statusToFilter(yacht.status) === activeFilter
        );

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="pt-[72px] p-4 md:p-6 lg:p-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <FleetKPICard
            icon={Ship}
            label="Total Yachts"
            value="87"
            change={5}
            statusColor={colors.accent}
          />
          <FleetKPICard
            icon={CheckCircle}
            label="Available Now"
            value="32"
            change={12}
            statusColor={colors.success}
          />
          <FleetKPICard
            icon={Calendar}
            label="Currently Booked"
            value="48"
            change={-8}
            statusColor={colors.accentGold}
          />
          <FleetKPICard
            icon={Wrench}
            label="In Maintenance"
            value="7"
            change={-15}
            statusColor={colors.danger}
          />
        </div>

        {/* Mobile Filter Dropdown */}
        <div className="sm:hidden mb-4">
          <select
            value={activeFilter}
            onChange={(e) => {
              const v = e.target.value as "all" | "available" | "booked" | "maintenance";
              setActiveFilter(v);
            }}
            className="w-full px-4 py-2 rounded-lg border text-sm"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.cardBorder,
              color: colors.textPrimary,
            }}
          >
            <option value="all">All Yachts</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {filteredYachts.map((yacht) => (
            <YachtCard
              key={yacht.id}
              yacht={yacht}
              onClick={() => setSelectedYacht(yacht)}
              onEdit={() => setSelectedYacht(yacht)}
            />
          ))}
        </div>

        {selectedYacht && (
          <YachtDetailDrawer
            yacht={selectedYacht}
            onClose={() => setSelectedYacht(null)}
          />
        )}
      </div>
    </div>
  );
}
