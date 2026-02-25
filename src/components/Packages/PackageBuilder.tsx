"use client";

import { Package, DollarSign, CheckCircle, TrendingUp } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { usePackageBuilder } from "@/context/PackageBuilderContext";
import { PackageKPICard } from "./PackageKPICard";
import { PackageFilters } from "./PackageFilters";
import { PackagesTable, type Package as PackageType } from "./PackagesTable";
import { PackageForm } from "./PackageForm";

const packagesData: PackageType[] = [
  {
    id: "PKG-001",
    name: "Mediterranean Sunset Experience",
    yacht: "Azure Dream",
    duration: "8 hours",
    region: "Mediterranean",
    services: ["Skipper", "Fuel", "Catering", "Transfer", "Crew"],
    price: 3850,
    status: "Active",
  },
  {
    id: "PKG-002",
    name: "Caribbean Full Day Adventure",
    yacht: "Ocean Majesty",
    duration: "12 hours",
    region: "Caribbean",
    services: ["Skipper", "Fuel", "Catering", "Snorkeling"],
    price: 5200,
    status: "Active",
  },
  {
    id: "PKG-003",
    name: "Half-Day Island Hopping",
    yacht: "Twin Seas",
    duration: "4 hours",
    region: "Pacific",
    services: ["Skipper", "Fuel", "Transfer"],
    price: 1850,
    status: "Draft",
  },
  {
    id: "PKG-004",
    name: "Weekly Luxury Cruise",
    yacht: "Platinum Wave",
    duration: "7 days",
    region: "Mediterranean",
    services: ["Skipper", "Fuel", "Catering", "Transfer", "Crew", "Snorkeling"],
    price: 28500,
    status: "Active",
  },
  {
    id: "PKG-005",
    name: "Romantic Dinner Cruise",
    yacht: "Silver Horizon",
    duration: "4 hours",
    region: "Indian Ocean",
    services: ["Skipper", "Fuel", "Catering"],
    price: 2400,
    status: "Active",
  },
  {
    id: "PKG-006",
    name: "Corporate Event Package",
    yacht: "Ocean Majesty",
    duration: "6 hours",
    region: "Caribbean",
    services: ["Skipper", "Fuel", "Catering", "Crew", "Transfer"],
    price: 4750,
    status: "Active",
  },
  {
    id: "PKG-007",
    name: "Snorkeling & Diving Special",
    yacht: "Twin Seas",
    duration: "8 hours",
    region: "Pacific",
    services: ["Skipper", "Fuel", "Snorkeling", "Transfer"],
    price: 3200,
    status: "Draft",
  },
  {
    id: "PKG-008",
    name: "Weekend Gateway",
    yacht: "Wind Chaser",
    duration: "3 days",
    region: "Mediterranean",
    services: ["Skipper", "Fuel", "Catering", "Crew"],
    price: 12800,
    status: "Active",
  },
];

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
    isFormOpen,
    setIsFormOpen,
  } = usePackageBuilder();

  const totalPackages = packagesData.length;
  const activePackages = packagesData.filter((p) => p.status === "Active").length;
  const avgPackageValue = Math.round(
    packagesData.reduce((sum, p) => sum + p.price, 0) / packagesData.length
  );
  const mostBookedPackage = "Sunset Experience";

  const durationKeywords: Record<string, string[]> = {
    "Half-day": ["4", "half"],
    "Full-day": ["6", "8", "12", "full"],
    Weekly: ["7", "week"],
    Custom: [],
  };

  const filteredPackages = packagesData.filter((pkg) => {
    const matchesSearch = pkg.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRegion =
      selectedRegion === "All Regions" || pkg.region === selectedRegion;
    const keywords = durationKeywords[selectedDuration];
    const matchesDuration =
      selectedDuration === "All Durations" ||
      !keywords ||
      keywords.some((k) => pkg.duration.toLowerCase().includes(k));
    const matchesStatus =
      selectedStatus === "All Status" || pkg.status === selectedStatus;

    return (
      matchesSearch &&
      matchesRegion &&
      matchesDuration &&
      matchesStatus
    );
  });

  const handleEdit = (pkg: PackageType) => {
    setIsFormOpen(true);
    // Could set a "editingPackage" in context to prefill form
  };

  const handleClone = (_pkg: PackageType) => {
    // Clone logic – could open form with prefilled data
    setIsFormOpen(true);
  };

  const handleDelete = (_pkg: PackageType) => {
    // Delete logic – confirm and remove
  };

  const handleToggleStatus = (_pkg: PackageType) => {
    // Toggle Active/Draft
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

        {/* Row 2 - Table + Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="lg:hidden">
            <PackageFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedRegion={selectedRegion}
              selectedDuration={selectedDuration}
              selectedStatus={selectedStatus}
              onRegionChange={setSelectedRegion}
              onDurationChange={setSelectedDuration}
              onStatusChange={setSelectedStatus}
            />
          </div>

          <PackagesTable
            packages={filteredPackages}
            onEdit={handleEdit}
            onClone={handleClone}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />

          <div className="hidden lg:block">
            <PackageFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedRegion={selectedRegion}
              selectedDuration={selectedDuration}
              selectedStatus={selectedStatus}
              onRegionChange={setSelectedRegion}
              onDurationChange={setSelectedDuration}
              onStatusChange={setSelectedStatus}
            />
          </div>
        </div>

        <PackageForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      </div>
    </div>
  );
}
