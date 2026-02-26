"use client";

import { useState, useMemo, useEffect } from "react";
import { Ship, CheckCircle, Wrench, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useFleetTopBarActions } from "@/context/FleetTopBarActionsContext";
import {
  useYachtsQuery,
  DEFAULT_YACHT_IMAGE,
  parseLength,
  yachtTypeToDisplay,
  yachtStatusToDisplay,
  type YachtListItem,
  type YachtsListFilters,
} from "@/lib/api/yachts";
import { FleetKPICard } from "./FleetKPICard";
import { YachtCard, type Yacht } from "./YachtCard";
import { YachtDetailDrawer } from "./YachtDetailDrawer";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const PAGE_SIZE = 12;

function apiYachtToCardYacht(api: YachtListItem): Yacht {
  const image =
    api.images?.length
      ? api.images.find((i) => i.isCover)?.imageUrl ?? api.images[0]?.imageUrl
      : DEFAULT_YACHT_IMAGE;
  const lengthM = parseLength(api.lengthM);
  const lengthFt = Math.round(lengthM * 3.28084);
  const regionName = api.region?.name ?? "—";
  return {
    id: api.id,
    name: api.name,
    type: yachtTypeToDisplay(api.type),
    image,
    length: lengthFt || 0,
    capacity: api.capacityGuests ?? 0,
    year: api.yearBuilt ?? 0,
    region: regionName,
    status: yachtStatusToDisplay(api.status),
  };
}

function buildListFilters(
  activeFilter: string,
  fleetFilters: ReturnType<typeof useFleetTopBarActions>["fleetFilters"]
): YachtsListFilters {
  const status =
    activeFilter === "all"
      ? fleetFilters.status || undefined
      : activeFilter === "available" || activeFilter === "booked" || activeFilter === "maintenance"
        ? activeFilter
        : fleetFilters.status || undefined;

  return {
    regionId: fleetFilters.regionId || undefined,
    type: fleetFilters.type || undefined,
    status: status || undefined,
    minCapacity: fleetFilters.minCapacity > 0 ? fleetFilters.minCapacity : undefined,
    maxCapacity: fleetFilters.maxCapacity < 100 ? fleetFilters.maxCapacity : undefined,
    isActive: fleetFilters.isActive || undefined,
    includeCompany: fleetFilters.includeCompany || undefined,
    includeRegion: true,
    includeImages: true,
  };
}

export default function FleetManagement() {
  const { colors } = useTheme();
  const { activeFilter, setActiveFilter, fleetFilters } = useFleetTopBarActions();
  const [page, setPage] = useState(1);
  const [selectedYacht, setSelectedYacht] = useState<Yacht | null>(null);

  const filters = useMemo(
    () => buildListFilters(activeFilter, fleetFilters),
    [activeFilter, fleetFilters]
  );

  useEffect(() => {
    setPage(1);
  }, [activeFilter, fleetFilters.regionId, fleetFilters.type, fleetFilters.status, fleetFilters.minCapacity, fleetFilters.maxCapacity]);

  const { data, isLoading, isError, error } = useYachtsQuery(page, PAGE_SIZE, filters);

  const cardYachts = useMemo(
    () => (data?.yachts ?? []).map(apiYachtToCardYacht),
    [data?.yachts]
  );

  const kpis = useMemo(() => {
    const total = data?.total ?? 0;
    const onPage = data?.yachts ?? [];
    const available = onPage.filter((y) => y.status?.toLowerCase() === "available").length;
    const booked = onPage.filter((y) => y.status?.toLowerCase() === "booked").length;
    const maintenance = onPage.filter((y) => y.status?.toLowerCase() === "maintenance").length;
    return { total, available, booked, maintenance };
  }, [data?.total, data?.yachts]);

  const totalPages = data?.totalPages ?? 0;
  const currentPage = data?.currentPage ?? 1;
  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="pt-[72px] p-4 md:p-6 lg:p-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <FleetKPICard
            icon={Ship}
            label="Total Yachts"
            value={String(kpis.total)}
            statusColor={colors.accent}
          />
          <FleetKPICard
            icon={CheckCircle}
            label="Available (this page)"
            value={String(kpis.available)}
            statusColor={colors.success}
          />
          <FleetKPICard
            icon={Calendar}
            label="Booked (this page)"
            value={String(kpis.booked)}
            statusColor={colors.accentGold}
          />
          <FleetKPICard
            icon={Wrench}
            label="Maintenance (this page)"
            value={String(kpis.maintenance)}
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
              setPage(1);
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

        {/* Loading / Error */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading fleet..." />
          </div>
        )}
        {isError && (
          <div
            className="rounded-xl border p-6 text-center"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.danger,
              color: colors.textPrimary,
            }}
          >
            <p className="font-medium">Failed to load yachts.</p>
            <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
              {error instanceof Error ? error.message : "Please try again later."}
            </p>
          </div>
        )}

        {/* Fleet Grid */}
        {!isLoading && !isError && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              {cardYachts.map((yacht) => (
                <YachtCard
                  key={yacht.id}
                  yacht={yacht}
                  onClick={() => setSelectedYacht(yacht)}
                  onEdit={() => setSelectedYacht(yacht)}
                />
              ))}
            </div>

            {cardYachts.length === 0 && (
              <div
                className="rounded-xl border p-12 text-center"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.cardBorder,
                  color: colors.textSecondary,
                }}
              >
                No yachts match your filters. Try changing filters or add a new yacht.
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                className="flex items-center justify-center gap-4 py-6"
                style={{ color: colors.textPrimary }}
              >
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!hasPrev}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder,
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNext}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder,
                  }}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

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
