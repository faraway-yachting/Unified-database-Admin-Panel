"use client";

import { useState } from "react";
import { Globe, MapPin, Package, Ship } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { RegionKPICard } from "./RegionKPICard";
import { RegionsList, type Region } from "./RegionsList";
import { RegionDetailPanel } from "./RegionDetailPanel";
import { ActivityLog, type Activity } from "./ActivityLog";
import { useTheme } from "@/context/ThemeContext";
import {
  deleteRegion,
  useRegionsListQuery,
  useAuditLogsQuery,
  type AuditLogItem,
} from "@/lib/api/regions";

function mapAuditLogToActivity(log: AuditLogItem): Activity {
  const entity = (log.entity ?? "").toLowerCase();
  let type: Activity["type"] = "settings";
  if (entity.includes("package")) type = "package";
  else if (entity.includes("yacht")) type = "yacht";
  else if (entity.includes("region") || entity.includes("site")) type = "site";

  const adminName =
    log.admin?.name ?? log.user?.name ?? log.admin?.email ?? log.user?.email ?? "—";
  const regionName = log.region?.name ?? "—";

  const relativeTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  };

  return {
    id: log.id,
    type,
    description: log.description ?? `${log.action} ${log.entity}`,
    region: regionName,
    admin: adminName,
    timestamp: relativeTime(log.createdAt),
  };
}

export default function RegionManagement() {
  const { colors } = useTheme();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Region | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const { data: regionsListData } = useRegionsListQuery();
  const { data: auditLogsData } = useAuditLogsQuery();

  const regions = (regionsListData?.regions ?? []).map((region) => ({
    id: region.id,
    city: region.name,
    country: region.country ?? "—",
    flag: "🌍",
    siteUrl: region.siteUrl || `/${region.slug ?? ""}`,
    status: (region.status as Region["status"]) ?? "draft",
    packages:
      region._count?.packageRegionVisibility ??
      region.packagesCount ??
      region.packageCount ??
      region.totalPackages ??
      0,
    yachts:
      region._count?.yachts ??
      region.yachtsCount ??
      region.yachtCount ??
      region.totalYachts ??
      0,
    lastUpdated: region.updatedAt ? new Date(region.updatedAt).toLocaleDateString() : "—",
  }));

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

      {/* Row 2 - Regions List */}
      <div className="mb-6 md:mb-8">
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

      {/* Row 3 - Region Detail Panel */}
      {showDetailPanel && selectedRegionData && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="w-full max-w-5xl max-h-[min(92vh,calc(100dvh-2rem))] h-fit min-h-0 flex flex-col overflow-hidden my-auto">
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
              This will permanently delete &quot;{pendingDelete.city}&quot;.
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

      {/* Row 4 - Activity Log */}
      <ActivityLog activities={(auditLogsData?.logs ?? []).map(mapAuditLogToActivity)} />
    </div>
  );
}
