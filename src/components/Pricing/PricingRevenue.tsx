"use client";

import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Tag,
  Wallet,
} from "lucide-react";
import { PricingKPICard } from "./PricingKPICard";
import { RevenueChart } from "./RevenueChart";
import { RevenueByRegion } from "./RevenueByRegion";
import { PricingRulesTable, type PricingRule } from "./PricingRulesTable";
import { SeasonalRulesCalendar, type SeasonalEvent } from "./SeasonalRulesCalendar";
import { PromoCodesPanel, type PromoCode } from "./PromoCodesPanel";
import { CommissionPanel, type Commission } from "./CommissionPanel";
import { TopPerformingPackages, type TopPackage } from "./TopPerformingPackages";

const revenueData = [
  { month: "Jan", mediterranean: 45, caribbean: 38, pacific: 25, indianOcean: 18 },
  { month: "Feb", mediterranean: 52, caribbean: 42, pacific: 28, indianOcean: 22 },
  { month: "Mar", mediterranean: 61, caribbean: 48, pacific: 35, indianOcean: 26 },
  { month: "Apr", mediterranean: 68, caribbean: 55, pacific: 42, indianOcean: 30 },
  { month: "May", mediterranean: 75, caribbean: 62, pacific: 48, indianOcean: 35 },
  { month: "Jun", mediterranean: 88, caribbean: 72, pacific: 58, indianOcean: 42 },
  { month: "Jul", mediterranean: 95, caribbean: 82, pacific: 65, indianOcean: 48 },
  { month: "Aug", mediterranean: 92, caribbean: 78, pacific: 62, indianOcean: 45 },
  { month: "Sep", mediterranean: 78, caribbean: 65, pacific: 52, indianOcean: 38 },
  { month: "Oct", mediterranean: 65, caribbean: 52, pacific: 42, indianOcean: 32 },
  { month: "Nov", mediterranean: 58, caribbean: 45, pacific: 35, indianOcean: 28 },
  { month: "Dec", mediterranean: 72, caribbean: 58, pacific: 45, indianOcean: 35 },
];

const regionRevenue = [
  { name: "Mediterranean", flag: "🇬🇷", revenue: 849000, bookings: 324, percentage: 42 },
  { name: "Caribbean", flag: "🇧🇸", revenue: 697000, bookings: 278, percentage: 34 },
  { name: "Pacific", flag: "🇵🇫", revenue: 487000, bookings: 198, percentage: 24 },
  { name: "Indian Ocean", flag: "🇲🇻", revenue: 399000, bookings: 156, percentage: 20 },
];

const pricingRules: PricingRule[] = [
  {
    id: "PR-001",
    name: "Summer Peak Season",
    package: "All Packages",
    region: "Mediterranean",
    dateRange: "Jun 1 - Sep 15",
    multiplier: "1.5x",
    type: "peak",
    status: "active",
  },
  {
    id: "PR-002",
    name: "Christmas Holiday",
    package: "Luxury Packages",
    region: "Caribbean",
    dateRange: "Dec 20 - Jan 5",
    multiplier: "1.8x",
    type: "holiday",
    status: "active",
  },
  {
    id: "PR-003",
    name: "Last Minute Deal",
    package: "All Packages",
    region: "All Regions",
    dateRange: "Within 48hrs",
    multiplier: "0.8x",
    type: "lastminute",
    status: "active",
  },
  {
    id: "PR-004",
    name: "Early Bird Discount",
    package: "Weekly Charters",
    region: "Pacific",
    dateRange: "90+ days",
    multiplier: "0.85x",
    type: "discount",
    status: "active",
  },
  {
    id: "PR-005",
    name: "Spring Break",
    package: "All Packages",
    region: "Caribbean",
    dateRange: "Mar 10 - Apr 10",
    multiplier: "1.4x",
    type: "peak",
    status: "inactive",
  },
];

const seasonalEvents: SeasonalEvent[] = [
  { startDay: 1, endDay: 8, type: "holiday", month: 0 },
  { startDay: 14, endDay: 14, type: "holiday", month: 0 },
  { startDay: 10, endDay: 24, type: "peak", month: 1 },
  { startDay: 1, endDay: 15, type: "peak", month: 2 },
  { startDay: 25, endDay: 28, type: "lastminute", month: 2 },
];

const promoCodes: PromoCode[] = [
  {
    id: "PC-001",
    code: "SUMMER2026",
    discountType: "percentage",
    value: 15,
    usageCount: 42,
    expiryDate: "Aug 31, 2026",
    status: "active",
  },
  {
    id: "PC-002",
    code: "FIRST100",
    discountType: "fixed",
    value: 100,
    usageCount: 87,
    expiryDate: "Dec 31, 2026",
    status: "active",
  },
  {
    id: "PC-003",
    code: "LUXURY20",
    discountType: "percentage",
    value: 20,
    usageCount: 28,
    expiryDate: "Jul 15, 2026",
    status: "active",
  },
  {
    id: "PC-004",
    code: "WEEKEND50",
    discountType: "fixed",
    value: 50,
    usageCount: 156,
    expiryDate: "Jun 30, 2026",
    status: "active",
  },
  {
    id: "PC-005",
    code: "SPRING15",
    discountType: "percentage",
    value: 15,
    usageCount: 64,
    expiryDate: "Feb 10, 2026",
    status: "expired",
  },
];

const commissions: Commission[] = [
  {
    id: "CM-001",
    agentName: "Elite Yacht Partners",
    region: "Mediterranean",
    commissionRate: 12,
    bookingsThisMonth: 18,
    totalEarned: 24500,
    payoutStatus: "pending",
  },
  {
    id: "CM-002",
    agentName: "Caribbean Charters Co.",
    region: "Caribbean",
    commissionRate: 10,
    bookingsThisMonth: 15,
    totalEarned: 19800,
    payoutStatus: "paid",
  },
  {
    id: "CM-003",
    agentName: "Pacific Adventures",
    region: "Pacific",
    commissionRate: 11,
    bookingsThisMonth: 12,
    totalEarned: 16200,
    payoutStatus: "pending",
  },
  {
    id: "CM-004",
    agentName: "Luxury Voyage Agency",
    region: "All Regions",
    commissionRate: 15,
    bookingsThisMonth: 22,
    totalEarned: 35600,
    payoutStatus: "paid",
  },
  {
    id: "CM-005",
    agentName: "Ocean Dreams Network",
    region: "Indian Ocean",
    commissionRate: 9,
    bookingsThisMonth: 8,
    totalEarned: 10400,
    payoutStatus: "pending",
  },
];

const topPackages: TopPackage[] = [
  {
    rank: 1,
    name: "Mediterranean Sunset Experience",
    region: "Mediterranean",
    totalBookings: 145,
    totalRevenue: 558250,
    avgBookingValue: 3850,
    occupancyRate: 92,
    trendData: [
      { value: 35 },
      { value: 42 },
      { value: 38 },
      { value: 51 },
      { value: 48 },
      { value: 62 },
    ],
  },
  {
    rank: 2,
    name: "Caribbean Full Day Adventure",
    region: "Caribbean",
    totalBookings: 128,
    totalRevenue: 665600,
    avgBookingValue: 5200,
    occupancyRate: 88,
    trendData: [
      { value: 28 },
      { value: 35 },
      { value: 32 },
      { value: 45 },
      { value: 42 },
      { value: 58 },
    ],
  },
  {
    rank: 3,
    name: "Weekly Luxury Cruise",
    region: "Mediterranean",
    totalBookings: 48,
    totalRevenue: 1368000,
    avgBookingValue: 28500,
    occupancyRate: 85,
    trendData: [
      { value: 18 },
      { value: 25 },
      { value: 22 },
      { value: 32 },
      { value: 28 },
      { value: 42 },
    ],
  },
  {
    rank: 4,
    name: "Island Hopping Package",
    region: "Pacific",
    totalBookings: 96,
    totalRevenue: 403200,
    avgBookingValue: 4200,
    occupancyRate: 78,
    trendData: [
      { value: 22 },
      { value: 28 },
      { value: 25 },
      { value: 35 },
      { value: 32 },
      { value: 45 },
    ],
  },
  {
    rank: 5,
    name: "Corporate Event Package",
    region: "Caribbean",
    totalBookings: 82,
    totalRevenue: 389500,
    avgBookingValue: 4750,
    occupancyRate: 72,
    trendData: [
      { value: 18 },
      { value: 24 },
      { value: 22 },
      { value: 28 },
      { value: 26 },
      { value: 38 },
    ],
  },
  {
    rank: 6,
    name: "Romantic Dinner Cruise",
    region: "Indian Ocean",
    totalBookings: 118,
    totalRevenue: 283200,
    avgBookingValue: 2400,
    occupancyRate: 68,
    trendData: [
      { value: 15 },
      { value: 22 },
      { value: 18 },
      { value: 28 },
      { value: 24 },
      { value: 35 },
    ],
  },
];

export default function PricingRevenue() {
  const handleEditRule = (rule: PricingRule) => {
    console.log("Edit rule:", rule.id);
  };

  const handleDeleteRule = (rule: PricingRule) => {
    console.log("Delete rule:", rule.id);
  };

  const handleToggleRuleStatus = (rule: PricingRule) => {
    console.log("Toggle rule status:", rule.id);
  };

  const handleCopyPromo = (promo: PromoCode) => {
    console.log("Copy promo code:", promo.code);
  };

  const handleDeactivatePromo = (promo: PromoCode) => {
    console.log("Deactivate promo:", promo.id);
  };

  const handleCreatePromo = () => {
    console.log("Create new promo code");
  };

  const handleViewCommission = (commission: Commission) => {
    console.log("View commission:", commission.id);
  };

  const handleEditCommission = (commission: Commission) => {
    console.log("Edit commission:", commission.id);
  };

  const handleAddAgent = () => {
    console.log("Add new agent");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Row 1 - KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
        <PricingKPICard
          icon={DollarSign}
          label="Total Revenue"
          value="$2.4M"
          change={18}
          sparklineData={[
            { value: 145 },
            { value: 162 },
            { value: 158 },
            { value: 181 },
            { value: 175 },
            { value: 197 },
            { value: 212 },
            { value: 208 },
            { value: 225 },
            { value: 240 },
          ]}
        />
        <PricingKPICard
          icon={TrendingUp}
          label="Revenue This Month"
          value="$342k"
          change={12}
          sparklineData={[
            { value: 25 },
            { value: 32 },
            { value: 28 },
            { value: 38 },
            { value: 35 },
            { value: 42 },
            { value: 48 },
            { value: 52 },
            { value: 58 },
            { value: 62 },
          ]}
        />
        <PricingKPICard
          icon={CreditCard}
          label="Avg. Booking Value"
          value="$4.8k"
          change={8}
          sparklineData={[
            { value: 3800 },
            { value: 4100 },
            { value: 3900 },
            { value: 4400 },
            { value: 4200 },
            { value: 4700 },
            { value: 5100 },
            { value: 4900 },
            { value: 5200 },
            { value: 4800 },
          ]}
        />
        <PricingKPICard
          icon={Tag}
          label="Active Promo Codes"
          value="4"
          change={-2}
          sparklineData={[
            { value: 8 },
            { value: 7 },
            { value: 6 },
            { value: 7 },
            { value: 6 },
            { value: 5 },
            { value: 5 },
            { value: 4 },
            { value: 5 },
            { value: 4 },
          ]}
        />
        <PricingKPICard
          icon={Wallet}
          label="Pending Commissions"
          value="$51.1k"
          change={15}
          sparklineData={[
            { value: 28 },
            { value: 32 },
            { value: 35 },
            { value: 38 },
            { value: 42 },
            { value: 45 },
            { value: 48 },
            { value: 51 },
            { value: 54 },
            { value: 51 },
          ]}
        />
      </div>

      {/* Row 2 - Revenue Chart + Revenue by Region */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_460px] gap-4 md:gap-6 mb-6 md:mb-8">
        <RevenueChart data={revenueData} />
        <RevenueByRegion regions={regionRevenue} />
      </div>

      {/* Row 3 - Pricing Rules Table + Seasonal Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_560px] gap-4 md:gap-6 mb-6 md:mb-8">
        <PricingRulesTable
          rules={pricingRules}
          onEdit={handleEditRule}
          onDelete={handleDeleteRule}
          onToggleStatus={handleToggleRuleStatus}
        />
        <SeasonalRulesCalendar events={seasonalEvents} />
      </div>

      {/* Row 4 - Promo Codes + Commission Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <PromoCodesPanel
          promoCodes={promoCodes}
          onCopy={handleCopyPromo}
          onDeactivate={handleDeactivatePromo}
          onCreate={handleCreatePromo}
        />
        <CommissionPanel
          commissions={commissions}
          onView={handleViewCommission}
          onEdit={handleEditCommission}
          onAddAgent={handleAddAgent}
        />
      </div>

      {/* Row 5 - Top Performing Packages */}
      <TopPerformingPackages packages={topPackages} />
    </div>
  );
}
