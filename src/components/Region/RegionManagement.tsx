"use client";

import { useState } from "react";
import { Globe, MapPin, Package, Ship } from "lucide-react";
import { RegionKPICard } from "./RegionKPICard";
import { WorldMap, type RegionLocation } from "./WorldMap";
import { RegionsList, type Region } from "./RegionsList";
import { RegionDetailPanel } from "./RegionDetailPanel";
import { RegionPerformance, type RegionPerformanceItem } from "./RegionPerformance";
import { ActivityLog, type Activity } from "./ActivityLog";
import { useTheme } from "@/context/ThemeContext";

const regionsData: Region[] = [
  {
    id: "REG-001",
    city: "Dubai",
    country: "UAE",
    flag: "🇦🇪",
    siteUrl: "/dubai",
    status: "live",
    packages: 12,
    yachts: 18,
    lastUpdated: "Feb 18, 2026",
  },
  {
    id: "REG-002",
    city: "Athens",
    country: "Greece",
    flag: "🇬🇷",
    siteUrl: "/athens",
    status: "live",
    packages: 15,
    yachts: 22,
    lastUpdated: "Feb 17, 2026",
  },
  {
    id: "REG-003",
    city: "Barcelona",
    country: "Spain",
    flag: "🇪🇸",
    siteUrl: "/barcelona",
    status: "live",
    packages: 18,
    yachts: 24,
    lastUpdated: "Feb 19, 2026",
  },
  {
    id: "REG-004",
    city: "Miami",
    country: "USA",
    flag: "🇺🇸",
    siteUrl: "/miami",
    status: "live",
    packages: 14,
    yachts: 20,
    lastUpdated: "Feb 16, 2026",
  },
  {
    id: "REG-005",
    city: "Monaco",
    country: "Monaco",
    flag: "🇲🇨",
    siteUrl: "/monaco",
    status: "draft",
    packages: 8,
    yachts: 12,
    lastUpdated: "Feb 15, 2026",
  },
  {
    id: "REG-006",
    city: "Maldives",
    country: "Maldives",
    flag: "🇲🇻",
    siteUrl: "/maldives",
    status: "live",
    packages: 10,
    yachts: 15,
    lastUpdated: "Feb 14, 2026",
  },
];

const locationsData: RegionLocation[] = [
  {
    id: "REG-001",
    city: "Dubai",
    country: "UAE",
    lat: 25.2048,
    lng: 55.2708,
    packages: 12,
    yachts: 18,
    status: "live",
  },
  {
    id: "REG-002",
    city: "Athens",
    country: "Greece",
    lat: 37.9838,
    lng: 23.7275,
    packages: 15,
    yachts: 22,
    status: "live",
  },
  {
    id: "REG-003",
    city: "Barcelona",
    country: "Spain",
    lat: 41.3851,
    lng: 2.1734,
    packages: 18,
    yachts: 24,
    status: "live",
  },
  {
    id: "REG-004",
    city: "Miami",
    country: "USA",
    lat: 25.7617,
    lng: -80.1918,
    packages: 14,
    yachts: 20,
    status: "live",
  },
  {
    id: "REG-005",
    city: "Monaco",
    country: "Monaco",
    lat: 43.7384,
    lng: 7.4246,
    packages: 8,
    yachts: 12,
    status: "draft",
  },
  {
    id: "REG-006",
    city: "Maldives",
    country: "Maldives",
    lat: 3.2028,
    lng: 73.2207,
    packages: 10,
    yachts: 15,
    status: "live",
  },
];

const performanceData: RegionPerformanceItem[] = [
  {
    name: "Barcelona",
    revenue: 245000,
    bookings: 156,
    occupancy: 87,
    color: "#00C9B1",
  },
  {
    name: "Athens",
    revenue: 198000,
    bookings: 134,
    occupancy: 82,
    color: "#F4A924",
  },
  {
    name: "Miami",
    revenue: 186000,
    bookings: 128,
    occupancy: 79,
    color: "#8B5CF6",
  },
  {
    name: "Dubai",
    revenue: 172000,
    bookings: 115,
    occupancy: 75,
    color: "#10B981",
  },
  {
    name: "Maldives",
    revenue: 145000,
    bookings: 98,
    occupancy: 71,
    color: "#3B82F6",
  },
  {
    name: "Monaco",
    revenue: 89000,
    bookings: 62,
    occupancy: 45,
    color: "#6B7280",
  },
];

const activitiesData: Activity[] = [
  {
    id: "A-001",
    type: "package",
    description:
      "Sunset Experience package updated with new pricing",
    region: "Barcelona",
    admin: "Sarah Mitchell",
    timestamp: "2 hours ago",
  },
  {
    id: "A-002",
    type: "yacht",
    description: "Azure Dream yacht assigned to region",
    region: "Dubai",
    admin: "James Rodriguez",
    timestamp: "4 hours ago",
  },
  {
    id: "A-003",
    type: "site",
    description: "Site status changed to Draft",
    region: "Monaco",
    admin: "Emma Thompson",
    timestamp: "5 hours ago",
  },
  {
    id: "A-004",
    type: "settings",
    description: "Currency changed from USD to EUR",
    region: "Athens",
    admin: "Michael Chen",
    timestamp: "6 hours ago",
  },
  {
    id: "A-005",
    type: "package",
    description: "Full Day Charter package visibility changed",
    region: "Miami",
    admin: "Sarah Mitchell",
    timestamp: "8 hours ago",
  },
  {
    id: "A-006",
    type: "yacht",
    description: "Sea Harmony removed from fleet",
    region: "Maldives",
    admin: "David Park",
    timestamp: "10 hours ago",
  },
  {
    id: "A-007",
    type: "package",
    description: "Island Hopping package created",
    region: "Barcelona",
    admin: "Lisa Anderson",
    timestamp: "12 hours ago",
  },
  {
    id: "A-008",
    type: "settings",
    description: "Hero banner image updated",
    region: "Dubai",
    admin: "Robert Kim",
    timestamp: "1 day ago",
  },
];

export default function RegionManagement() {
  const { colors } = useTheme();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  const handleRegionSelect = (regionId: string) => {
    setSelectedRegion(regionId);
    setShowDetailPanel(true);
  };

  const handleManage = (region: Region) => {
    setSelectedRegion(region.id);
    setShowDetailPanel(true);
  };

  const selectedRegionData = regionsData.find((r) => r.id === selectedRegion);

  const totalRegions = regionsData.length;
  const activeSites = regionsData.filter((r) => r.status === "live").length;
  const totalPackages = regionsData.reduce((sum, r) => sum + r.packages, 0);
  const totalFleet = regionsData.reduce((sum, r) => sum + r.yachts, 0);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Row 1 - KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <RegionKPICard
          icon={Globe}
          label="Total Regions"
          value={totalRegions.toString()}
          status="All Time"
          statusColor={colors.accent}
        />
        <RegionKPICard
          icon={MapPin}
          label="Active Sites"
          value={activeSites.toString()}
          status="Live Now"
          statusColor="#10B981"
        />
        <RegionKPICard
          icon={Package}
          label="Total Packages"
          value={totalPackages.toString()}
          status="Across Regions"
          statusColor={colors.accentGold}
        />
        <RegionKPICard
          icon={Ship}
          label="Total Fleet"
          value={totalFleet.toString()}
          status="Across Regions"
          statusColor="#8B5CF6"
        />
      </div>

      {/* Row 2 - Map + Regions List */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="lg:col-span-3">
          <WorldMap
            locations={locationsData}
            selectedRegion={selectedRegion}
            onRegionSelect={handleRegionSelect}
          />
        </div>
        <div className="lg:col-span-2">
          <RegionsList
            regions={regionsData}
            selectedRegion={selectedRegion}
            onSelectRegion={handleRegionSelect}
            onManage={handleManage}
            onPreview={(region) => console.log("Preview", region)}
            onSettings={(region) => handleManage(region)}
          />
        </div>
      </div>

      {/* Row 3 - Region Detail Panel */}
      {showDetailPanel && selectedRegionData && (
        <div className="mb-6 md:mb-8">
          <RegionDetailPanel
            region={selectedRegionData}
            onClose={() => {
              setShowDetailPanel(false);
              setSelectedRegion(null);
            }}
          />
        </div>
      )}

      {/* Row 4 - Performance + Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <RegionPerformance regions={performanceData} />
        <ActivityLog activities={activitiesData} />
      </div>
    </div>
  );
}
