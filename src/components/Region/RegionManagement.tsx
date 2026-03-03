"use client";

import { useState } from "react";
import { Globe, MapPin, Package, Ship } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { RegionKPICard } from "./RegionKPICard";
import { WorldMap, type RegionLocation } from "./WorldMap";
import { RegionsList, type Region } from "./RegionsList";
import { RegionDetailPanel } from "./RegionDetailPanel";
import { RegionPerformance } from "./RegionPerformance";
import { ActivityLog, type Activity } from "./ActivityLog";
import { useTheme } from "@/context/ThemeContext";
import {
  deleteRegion,
  useRegionPerformanceQuery,
  useRegionsListQuery,
} from "@/lib/api/regions";

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
  const [pendingDelete, setPendingDelete] = useState<Region | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const { data: regionsListData } = useRegionsListQuery();
  const { data: performanceData } = useRegionPerformanceQuery();

  const regions = (regionsListData?.regions ?? []).map((region) => ({
    id: region.id,
    city: region.name,
    country: region.country ?? "—",
    flag: "🌍",
    siteUrl: region.siteUrl || `/${region.slug ?? ""}`,
    status: (region.status as Region["status"]) ?? "draft",
    packages: 0,
    yachts: 0,
    lastUpdated: region.updatedAt ? new Date(region.updatedAt).toLocaleDateString() : "—",
  }));

  const locationLookup = new Map(
    locationsData.map((location) => [location.city.toLowerCase(), location])
  );
  const mapLocations = regions
    .map((region) => {
      const match = locationLookup.get(region.city.toLowerCase());
      if (!match) return null;
      return {
        ...match,
        id: region.id,
        city: region.city,
        country: region.country,
        status: region.status,
      };
    })
    .filter((item): item is RegionLocation => item !== null);

  const handleRegionSelect = (regionId: string) => {
    setSelectedRegion(regionId);
    setShowDetailPanel(true);
  };

  const handleView = (region: Region) => {
    setSelectedRegion(region.id);
    setShowDetailPanel(true);
  };

  const handleDelete = (region: Region) => {
    setPendingDelete(region);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteRegion(pendingDelete.id);
      await queryClient.invalidateQueries({ queryKey: ["regions"] });
      if (selectedRegion === pendingDelete.id) {
        setSelectedRegion(null);
        setShowDetailPanel(false);
      }
    } finally {
      setIsDeleting(false);
      setPendingDelete(null);
    }
  };

  const selectedRegionData = regions.find((r) => r.id === selectedRegion);

  const totalRegions = regions.length;
  const activeSites = regions.filter((r) => r.status === "live").length;
  const totalPackages = regions.reduce((sum, r) => sum + r.packages, 0);
  const totalFleet = regions.reduce((sum, r) => sum + r.yachts, 0);

  const performanceColors = [
    colors.accent,
    colors.accentGold,
    "#8B5CF6",
    "#3B82F6",
    "#10B981",
    "#F97316",
    "#14B8A6",
  ];

  const performanceRegions = (performanceData?.regions ?? []).map(
    (region, index) => ({
      name: region.name,
      revenue: region.revenue,
      bookings: region.bookings,
      color: performanceColors[index % performanceColors.length],
    })
  );

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
            locations={mapLocations}
            selectedRegion={selectedRegion}
            onRegionSelect={handleRegionSelect}
          />
        </div>
        <div className="lg:col-span-2">
          <RegionsList
            regions={regions}
            selectedRegion={selectedRegion}
            onSelectRegion={handleRegionSelect}
            onPreview={(region) => {
              if (region.siteUrl) window.open(region.siteUrl, "_blank", "noopener,noreferrer");
            }}
            onView={handleView}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Row 3 - Region Detail Panel */}
      {showDetailPanel && selectedRegionData && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="w-full max-w-5xl">
            <RegionDetailPanel
              region={selectedRegionData}
              onClose={() => {
                setShowDetailPanel(false);
                setSelectedRegion(null);
              }}
            />
          </div>
        </div>
      )}

      {pendingDelete && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div
            className="w-full max-w-md rounded-2xl border p-6"
            style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}
          >
            <h3 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
              Delete region?
            </h3>
            <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
              This will permanently delete "{pendingDelete.city}".
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="px-4 py-2 rounded-lg border text-sm"
                style={{ borderColor: colors.cardBorder, color: colors.textPrimary }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ backgroundColor: colors.danger }}
              >
                {isDeleting ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Row 4 - Performance + Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <RegionPerformance regions={performanceRegions} />
        <ActivityLog activities={activitiesData} />
      </div>
    </div>
  );
}
