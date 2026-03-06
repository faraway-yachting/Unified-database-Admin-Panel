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
import { FleetStatusSummary } from "./FleetStatusSummary";
import { RecentBookingsTable } from "./RecentBookingsTable";
import { WeeklyCalendar } from "./WeeklyCalendar";
import { TopPackages } from "./TopPackages";
import { PendingActions } from "./PendingActions";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import {
  useDashboardStatsQuery,
  useRevenueChartQuery,
  useBookingsByRegionQuery,
  useFleetStatusQuery,
  useUpcomingBookingsQuery,
  useTopPackagesQuery,
} from "@/lib/api/dashboard";
import type { RevenueDataPoint } from "./RevenueChart";
import type { BookingsDonutItem } from "./BookingsDonut";
import type { RecentBooking } from "./RecentBookingsTable";
import type { WeekDayEvent } from "./WeeklyCalendar";
import type { TopPackageItem } from "./TopPackages";

const DONUT_COLORS = ["#00C9B1", "#F4A924", "#8B5CF6", "#EC4899", "#3B82F6", "#10B981"];

function formatRevenue(num: number): string {
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}k`;
  return `$${num.toLocaleString()}`;
}

function transformRevenueChartData(
  labels: string[],
  series: { name: string; data: number[] }[]
): RevenueDataPoint[] {
  if (!labels.length) return [];
  return labels.map((label, i) => {
    const row: RevenueDataPoint = { month: label };
    series.forEach((s) => {
      row[s.name] = s.data[i] ?? 0;
    });
    return row;
  });
}

function deriveWeekDaysFromBookings(
  bookings: { startDate: string; endDate: string }[]
): WeekDayEvent[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days: WeekDayEvent[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const count = bookings.filter((b) => {
      const start = b.startDate.slice(0, 10);
      const end = b.endDate.slice(0, 10);
      return dateStr >= start && dateStr <= end;
    }).length;
    days.push({
      date: d.getDate().toString(),
      dayName: dayNames[d.getDay()],
      bookingCount: count,
      isToday: i === 0,
    });
  }
  return days;
}

// PendingActions has no API - keep mock data
const pendingActions = [
  { id: "A001", type: "urgent" as const, title: "Payment Overdue", description: "Booking payment is 3 days overdue", time: "2 hours ago" },
  { id: "A002", type: "warning" as const, title: "Maintenance Scheduled", description: "Yacht requires inspection", time: "5 hours ago" },
  { id: "A003", type: "info" as const, title: "New Inquiry", description: "VIP client interested in charter", time: "1 day ago" },
];

export default function Dashboard() {
  const { colors } = useTheme();

  const { data: stats, isLoading: statsLoading } = useDashboardStatsQuery("month");
  const { data: revenueChart } = useRevenueChartQuery("month", "month");
  const { data: bookingsByRegion } = useBookingsByRegionQuery();
  const { data: fleetStatus } = useFleetStatusQuery();
  const { data: upcomingData } = useUpcomingBookingsQuery();
  const { data: topPackagesData } = useTopPackagesQuery();

  const upcomingBookings = upcomingData?.bookings ?? [];
  const weekDays = deriveWeekDaysFromBookings(upcomingBookings);

  const recentBookingsForTable: RecentBooking[] = upcomingBookings.map((b) => {
    const guestName = b.customer
      ? `${b.customer.firstName ?? ""} ${b.customer.lastName ?? ""}`.trim() || "—"
      : "—";
    const start = b.startDate ? new Date(b.startDate) : null;
    const end = b.endDate ? new Date(b.endDate) : null;
    const startStr = start ? `${String(start.getMonth() + 1).padStart(2, "0")}/${start.getDate()}` : "—";
    const endStr = end ? `${String(end.getMonth() + 1).padStart(2, "0")}/${end.getDate()}` : "—";
    const amount = typeof b.totalAmount === "number" ? b.totalAmount : Number(b.totalAmount) || 0;
    const statusMap: Record<string, RecentBooking["status"]> = {
      inquiry: "pending",
      confirmed: "confirmed",
      paid: "confirmed",
      completed: "completed",
      cancelled: "cancelled",
    };
    const status = statusMap[b.status] ?? "pending";
    return {
      id: b.bookingRef,
      guestName,
      yacht: b.yacht?.name ?? "—",
      region: b.region?.name ?? "—",
      startDate: startStr,
      endDate: endStr,
      amount,
      status,
    };
  });

  const bookingsDonutData: BookingsDonutItem[] = (bookingsByRegion ?? []).map((r, i) => ({
    region: r.regionName,
    bookings: r.count,
    color: DONUT_COLORS[i % DONUT_COLORS.length],
  }));

  const revenueData = revenueChart
    ? transformRevenueChartData(revenueChart.labels, revenueChart.series)
    : [];

  const topPackagesForList: TopPackageItem[] = (topPackagesData?.packages ?? []).map((p, i) => ({
    rank: i + 1,
    name: p.packageName,
    region: "—",
    bookings: 0,
    revenue: p.revenueUsd,
    change: 0,
  }));

  const fleetStatusItems = fleetStatus ?? [];
  const emptySparkline = [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }];

  if (statsLoading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <LoadingSpinner variant="fullScreen" size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="pt-[72px] p-4 md:p-6 lg:p-8">
        {/* Row 1: KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <KPICard
            icon={Activity}
            label="Total Bookings"
            value={stats ? stats.bookings.toLocaleString() : "—"}
            change={0}
            sparklineData={emptySparkline}
          />
          <KPICard
            icon={DollarIcon}
            label="Total Revenue (this month)"
            value={stats ? formatRevenue(stats.revenueUsd) : "—"}
            change={0}
            sparklineData={emptySparkline}
          />
          <KPICard
            icon={ShipIcon}
            label="Active Yachts"
            value={stats ? String(stats.fleet.total) : "—"}
            change={0}
            sparklineData={emptySparkline}
          />
          <KPICard
            icon={TrendingUp}
            label="Occupancy"
            value={stats ? `${stats.occupancyPercent}%` : "—"}
            change={0}
            sparklineData={emptySparkline}
          />
        </div>

        {/* Row 2: Revenue Chart + Bookings Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="lg:col-span-2">
            <RevenueChart data={revenueData} />
          </div>
          <div>
            <BookingsDonut data={bookingsDonutData} />
          </div>
        </div>

        {/* Row 3: Fleet Status + Weekly Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <FleetStatusSummary items={fleetStatusItems} />
          <WeeklyCalendar events={weekDays} />
        </div>

        {/* Row 4: Upcoming Bookings */}
        <div className="mb-6 md:mb-8">
          <RecentBookingsTable bookings={recentBookingsForTable} />
        </div>

        {/* Row 5: Top Packages + Pending Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <TopPackages packages={topPackagesForList} />
          <PendingActions actions={pendingActions} />
        </div>
      </div>
    </div>
  );
}
