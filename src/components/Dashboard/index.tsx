"use client";

import {
  Activity,
  DollarSign as DollarIcon,
  Ship as ShipIcon,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { KPICard } from "./KPICard";
import { RevenueChart } from "./RevenueChart";
import { BookingsDonut } from "./BookingsDonut";
import { FleetStatusList } from "./FleetStatusList";
import { RecentBookingsTable } from "./RecentBookingsTable";
import { WeeklyCalendar } from "./WeeklyCalendar";
import { TopPackages } from "./TopPackages";
import { PendingActions } from "./PendingActions";

// Mock Data
const kpiData = {
  totalBookings: {
    value: "1,284",
    change: 12.5,
    sparkline: [
      { value: 45 }, { value: 52 }, { value: 48 }, { value: 61 }, { value: 55 },
      { value: 67 }, { value: 72 }, { value: 68 }, { value: 75 }, { value: 82 },
    ],
  },
  revenue: {
    value: "$2.4M",
    change: 18.2,
    sparkline: [
      { value: 120 }, { value: 135 }, { value: 128 }, { value: 145 }, { value: 152 },
      { value: 168 }, { value: 175 }, { value: 182 }, { value: 195 }, { value: 210 },
    ],
  },
  activeYachts: {
    value: "87",
    change: 5.3,
    sparkline: [
      { value: 75 }, { value: 77 }, { value: 79 }, { value: 80 }, { value: 81 },
      { value: 82 }, { value: 84 }, { value: 85 }, { value: 86 }, { value: 87 },
    ],
  },
  avgBookingValue: {
    value: "$1,860",
    change: 10.4,
    sparkline: [
      { value: 1700 }, { value: 1750 }, { value: 1800 }, { value: 1850 }, { value: 1900 },
      { value: 1950 }, { value: 2000 }, { value: 2050 }, { value: 2100 }, { value: 2150 },
    ],
  },
};

const revenueData = [
  { month: "Jan", mediterranean: 185000, caribbean: 245000, pacific: 165000, indian: 95000 },
  { month: "Feb", mediterranean: 195000, caribbean: 265000, pacific: 175000, indian: 105000 },
  { month: "Mar", mediterranean: 215000, caribbean: 285000, pacific: 195000, indian: 125000 },
  { month: "Apr", mediterranean: 235000, caribbean: 305000, pacific: 215000, indian: 145000 },
  { month: "May", mediterranean: 255000, caribbean: 325000, pacific: 235000, indian: 165000 },
  { month: "Jun", mediterranean: 275000, caribbean: 345000, pacific: 255000, indian: 185000 },
];

const bookingsData = [
  { region: "Mediterranean", bookings: 342, color: "#00C9B1" },
  { region: "Caribbean", bookings: 487, color: "#F4A924" },
  { region: "Pacific", bookings: 268, color: "#8B5CF6" },
  { region: "Indian Ocean", bookings: 187, color: "#EC4899" },
];

const fleetStatus = [
  { id: "Y001", name: "Azure Majesty", image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=200&h=200&fit=crop", region: "Mediterranean", status: "available" as const },
  { id: "Y002", name: "Ocean Serenity", image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=200&h=200&fit=crop", region: "Caribbean", status: "booked" as const, nextAvailable: "Mar 5" },
  { id: "Y003", name: "Golden Horizon", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop", region: "Pacific", status: "available" as const },
  { id: "Y004", name: "Royal Wave", image: "https://images.unsplash.com/photo-1473220464492-452fb02e6221?w=200&h=200&fit=crop", region: "Mediterranean", status: "booked" as const, nextAvailable: "Feb 28" },
  { id: "Y005", name: "Crystal Dream", image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=200&h=200&fit=crop", region: "Indian Ocean", status: "maintenance" as const, nextAvailable: "Mar 15" },
  { id: "Y006", name: "Sapphire Elite", image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=200&h=200&fit=crop", region: "Caribbean", status: "available" as const },
  { id: "Y007", name: "Diamond Legacy", image: "https://images.unsplash.com/photo-1558281177-3e461c416e24?w=200&h=200&fit=crop", region: "Mediterranean", status: "booked" as const, nextAvailable: "Mar 1" },
];

const recentBookings = [
  { id: "BK2847", guestName: "Alexander Morrison", yacht: "Azure Majesty", region: "Mediterranean", startDate: "02/20", endDate: "02/27", amount: 48500, status: "confirmed" as const },
  { id: "BK2846", guestName: "Victoria Laurent", yacht: "Ocean Serenity", region: "Caribbean", startDate: "02/22", endDate: "03/01", amount: 62000, status: "confirmed" as const },
  { id: "BK2845", guestName: "James Richardson", yacht: "Golden Horizon", region: "Pacific", startDate: "02/19", endDate: "02/25", amount: 38900, status: "pending" as const },
  { id: "BK2844", guestName: "Sophia Chen", yacht: "Royal Wave", region: "Mediterranean", startDate: "02/21", endDate: "02/28", amount: 55200, status: "confirmed" as const },
  { id: "BK2843", guestName: "Marcus Sullivan", yacht: "Sapphire Elite", region: "Caribbean", startDate: "02/18", endDate: "02/24", amount: 47800, status: "completed" as const },
  { id: "BK2842", guestName: "Isabella Rossi", yacht: "Diamond Legacy", region: "Mediterranean", startDate: "02/17", endDate: "02/21", amount: 32500, status: "cancelled" as const },
];

const weekDays = [
  { date: "17", dayName: "Mon", bookingCount: 8, isToday: false },
  { date: "18", dayName: "Tue", bookingCount: 12, isToday: true },
  { date: "19", dayName: "Wed", bookingCount: 9, isToday: false },
  { date: "20", dayName: "Thu", bookingCount: 15, isToday: false },
  { date: "21", dayName: "Fri", bookingCount: 18, isToday: false },
  { date: "22", dayName: "Sat", bookingCount: 22, isToday: false },
  { date: "23", dayName: "Sun", bookingCount: 19, isToday: false },
];

const topPackages = [
  { rank: 1, name: "Mediterranean Luxury Week", region: "Mediterranean", bookings: 87, revenue: 425000, change: 24.5 },
  { rank: 2, name: "Caribbean Paradise Cruise", region: "Caribbean", bookings: 102, revenue: 398000, change: 18.2 },
  { rank: 3, name: "Pacific Island Hopping", region: "Pacific", bookings: 64, revenue: 312000, change: 15.7 },
  { rank: 4, name: "Monaco Grand Prix Experience", region: "Mediterranean", bookings: 42, revenue: 285000, change: 32.1 },
  { rank: 5, name: "Maldives Private Charter", region: "Indian Ocean", bookings: 38, revenue: 247000, change: 12.3 },
];

const pendingActions = [
  { id: "A001", type: "urgent" as const, title: "Payment Overdue", description: "Booking #BK2831 payment is 3 days overdue", time: "2 hours ago" },
  { id: "A002", type: "warning" as const, title: "Maintenance Scheduled", description: "Crystal Dream requires inspection on Mar 15", time: "5 hours ago" },
  { id: "A003", type: "info" as const, title: "New Inquiry", description: "VIP client interested in 2-week Mediterranean charter", time: "1 day ago" },
  { id: "A004", type: "warning" as const, title: "Crew Assignment Pending", description: "Ocean Serenity needs captain for next booking", time: "1 day ago" },
];

export default function Dashboard() {
  const { colors } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Content Area - Sidebar & TopBar are in (root) layout */}
      <div className="pt-[72px] p-4 md:p-6 lg:p-8">
        {/* Row 1: KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <KPICard
            icon={Activity}
            label="Total Bookings"
            value={kpiData.totalBookings.value}
            change={kpiData.totalBookings.change}
            sparklineData={kpiData.totalBookings.sparkline}
          />
          <KPICard
            icon={DollarIcon}
            label="Total Revenue"
            value={kpiData.revenue.value}
            change={kpiData.revenue.change}
            sparklineData={kpiData.revenue.sparkline}
          />
          <KPICard
            icon={ShipIcon}
            label="Active Yachts"
            value={kpiData.activeYachts.value}
            change={kpiData.activeYachts.change}
            sparklineData={kpiData.activeYachts.sparkline}
          />
          <KPICard
            icon={TrendingUp}
            label="Avg. Booking Value"
            value={kpiData.avgBookingValue.value}
            change={kpiData.avgBookingValue.change}
            sparklineData={kpiData.avgBookingValue.sparkline}
          />
        </div>

        {/* Row 2: Revenue Chart + Bookings Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="lg:col-span-2">
            <RevenueChart data={revenueData} />
          </div>
          <div>
            <BookingsDonut data={bookingsData} />
          </div>
        </div>

        {/* Row 3: Fleet Status + Weekly Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <FleetStatusList items={fleetStatus} />
          <WeeklyCalendar events={weekDays} />
        </div>

        {/* Row 4: Recent Bookings */}
        <div className="mb-6 md:mb-8">
          <RecentBookingsTable bookings={recentBookings} />
        </div>

        {/* Row 5: Top Packages + Pending Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <TopPackages packages={topPackages} />
          <PendingActions actions={pendingActions} />
        </div>
      </div>
    </div>
  );
}
