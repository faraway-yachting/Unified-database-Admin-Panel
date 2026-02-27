"use client";

import { useMemo, useState } from "react";
import { Package, DollarSign, CheckCircle, TrendingUp } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@/context/ThemeContext";
import { usePackageBuilder } from "@/context/PackageBuilderContext";
import { PackageKPICard } from "./PackageKPICard";
import { PackageFilters } from "./PackageFilters";
import { PackagesTable, type Package as PackageType } from "./PackagesTable";
import { PackageForm } from "./PackageForm";
import { PackageDetailDrawer } from "./PackageDetailDrawer";
import { PackageEditDrawer } from "./PackageEditDrawer";
import { deletePackage, packagesKeys, usePackagesQuery, type PackageListItem } from "@/lib/api/packages";
import { useRegionsQuery } from "@/lib/api/regions";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 50;

function formatDuration(pkg: PackageListItem): string {
  if (pkg.durationHours) {
    const hours = parseFloat(String(pkg.durationHours));
    if (Number.isFinite(hours)) {
      return `${hours} hours`;
    }
  }
  if (pkg.durationDays) {
    return `${pkg.durationDays} days`;
  }
  const type = pkg.durationType?.toLowerCase();
  if (type === "half_day") return "Half-day";
  if (type === "full_day") return "Full-day";
  if (type === "weekly") return "Weekly";
  return "Custom";
}

function statusToLabel(status: string): PackageType["status"] {
  const s = status?.toLowerCase();
  if (s === "active") return "Active";
  if (s === "draft") return "Draft";
  if (s === "archived") return "Archived";
  return status || "Draft";
}

function formatPrice(price: number | string): number {
  const n = typeof price === "number" ? price : parseFloat(String(price));
  return Number.isFinite(n) ? n : 0;
}

export default function PackageBuilder() {
  const { colors } = useTheme();
  const {
    searchQuery,
    setSearchQuery,
    selectedRegion,
    setSelectedRegion,
    selectedDuration,
    setSelectedDuration,
    selectedStatus,
    setSelectedStatus,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    isFormOpen,
    setIsFormOpen,
  } = usePackageBuilder();

  const { data: regionsData, isLoading: regionsLoading } = useRegionsQuery();
  const queryClient = useQueryClient();
  const regions = regionsData ?? [];

  const filters = useMemo(
    () => ({
      regionId: selectedRegion || undefined,
      durationType: selectedDuration || undefined,
      status: selectedStatus || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    }),
    [selectedRegion, selectedDuration, selectedStatus, minPrice, maxPrice]
  );

  const { data, isLoading, isError, error } = usePackagesQuery(1, PAGE_SIZE, filters);
  const packagesList = data?.packages ?? [];

  const selectedRegionLabel = useMemo(
    () => regions.find((r) => r.id === selectedRegion)?.name ?? "",
    [regions, selectedRegion]
  );

  const mappedPackages: PackageType[] = useMemo(
    () =>
      packagesList.map((pkg) => ({
        id: pkg.id,
        name: pkg.name,
        yacht: pkg.yacht?.name ?? pkg.yachtCategory ?? "—",
        duration: formatDuration(pkg),
        region: selectedRegionLabel || "Multiple",
        price: formatPrice(pkg.basePrice),
        currency: pkg.currency?.symbol ?? pkg.currencyCode,
        status: statusToLabel(pkg.status),
      })),
    [packagesList, selectedRegionLabel]
  );

  const filteredPackages = useMemo(() => {
    if (!searchQuery) return mappedPackages;
    const q = searchQuery.toLowerCase();
    return mappedPackages.filter((pkg) => pkg.name.toLowerCase().includes(q));
  }, [mappedPackages, searchQuery]);

  const totalPackages = data?.total ?? filteredPackages.length;
  const activePackages = filteredPackages.filter((p) => p.status === "Active").length;
  const avgPackageValue =
    filteredPackages.length > 0
      ? Math.round(filteredPackages.reduce((sum, p) => sum + p.price, 0) / filteredPackages.length)
      : 0;
  const mostBookedPackage = "—";

  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [selectedEditPackageId, setSelectedEditPackageId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PackageType | null>(null);

  const handleView = (pkg: PackageType) => {
    setSelectedPackageId(pkg.id);
  };

  const handleEdit = (pkg: PackageType) => {
    setSelectedEditPackageId(pkg.id);
  };

  const handleDelete = (pkg: PackageType) => {
    setPendingDelete(pkg);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deletePackage(pendingDelete.id);
      await queryClient.invalidateQueries({ queryKey: packagesKeys.lists() });
      toast.success("Package deleted successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete package";
      toast.error(message);
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="pt-[72px] p-4 md:p-6 lg:p-8">
        {/* Row 1 - KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <PackageKPICard
            icon={Package}
            label="Total Packages"
            value={totalPackages.toString()}
            sparklineData={[
              { value: 45 }, { value: 52 }, { value: 48 }, { value: 61 },
              { value: 55 }, { value: 67 }, { value: 72 }, { value: 68 },
            ]}
          />
          <PackageKPICard
            icon={CheckCircle}
            label="Active Packages"
            value={activePackages.toString()}
            sparklineData={[
              { value: 35 }, { value: 42 }, { value: 38 }, { value: 51 },
              { value: 45 }, { value: 57 }, { value: 62 }, { value: 58 },
            ]}
          />
          <PackageKPICard
            icon={DollarSign}
            label="Avg. Package Value"
            value={`$${(avgPackageValue / 1000).toFixed(1)}k`}
            sparklineData={[
              { value: 3200 }, { value: 3500 }, { value: 3300 }, { value: 4100 },
              { value: 3900 }, { value: 4700 }, { value: 5200 }, { value: 4800 },
            ]}
          />
          <PackageKPICard
            icon={TrendingUp}
            label="Most Booked Package"
            value={mostBookedPackage}
            sparklineData={[
              { value: 25 }, { value: 32 }, { value: 28 }, { value: 41 },
              { value: 35 }, { value: 47 }, { value: 52 }, { value: 48 },
            ]}
          />
        </div>

        {/* Row 2 - Quick Filters */}
        <div className="mb-6 md:mb-8">
          <PackageFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedRegion={selectedRegion}
            selectedDuration={selectedDuration}
            selectedStatus={selectedStatus}
            minPrice={minPrice}
            maxPrice={maxPrice}
            regions={regions}
            regionsLoading={regionsLoading}
            onRegionChange={setSelectedRegion}
            onDurationChange={setSelectedDuration}
            onStatusChange={setSelectedStatus}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
          />
        </div>

        {/* Row 3 - Table */}
        <div className="mb-6 md:mb-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading packages..." />
            </div>
          ) : isError ? (
            <div
              className="rounded-xl border p-6 text-center"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.danger,
                color: colors.textPrimary,
              }}
            >
              <p className="font-medium">Failed to load packages.</p>
              <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                {error instanceof Error ? error.message : "Please try again later."}
              </p>
            </div>
          ) : (
            <PackagesTable
              packages={filteredPackages}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>

        <PackageForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
        <PackageDetailDrawer
          packageId={selectedPackageId}
          onClose={() => setSelectedPackageId(null)}
        />
        <PackageEditDrawer
          packageId={selectedEditPackageId}
          onClose={() => setSelectedEditPackageId(null)}
        />

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
                Delete package?
              </h3>
              <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                This will permanently delete "{pendingDelete.name}". This action cannot be undone.
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
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                  style={{ backgroundColor: colors.danger }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}
