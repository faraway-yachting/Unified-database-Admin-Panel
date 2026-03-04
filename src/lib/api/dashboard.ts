import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { config } from "../../../config";

// Stats
export interface DashboardStats {
  bookings: number;
  revenueUsd: number;
  occupancyPercent: number;
  fleet: {
    total: number;
    available: number;
    booked: number;
    maintenance: number;
    retired: number;
  };
  period: string;
}

// Revenue chart
export interface RevenueChartSeries {
  name: string;
  data: number[];
}

export interface RevenueChartResponse {
  labels: string[];
  series: RevenueChartSeries[];
}

// Bookings by region
export interface BookingsByRegionItem {
  regionId: string;
  regionName: string;
  count: number;
}

// Fleet status (counts)
export interface FleetStatusItem {
  status: string;
  count: number;
}

// Upcoming booking (matches booking API shape)
export interface UpcomingBooking {
  id: string;
  bookingRef: string;
  startDate: string;
  endDate: string;
  totalAmount: number | string;
  status: string;
  customer?: { firstName?: string; lastName?: string };
  yacht?: { id?: string; name?: string; type?: string };
  package?: { id?: string; name?: string };
  region?: { id?: string; name?: string; slug?: string };
  currency?: { code?: string; symbol?: string };
}

// Top package
export interface TopPackageItem {
  packageId: string;
  packageName: string;
  revenueUsd: number;
}

export interface TopPackagesResponse {
  packages: TopPackageItem[];
}

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: (period?: string) => [...dashboardKeys.all, "stats", period] as const,
  revenueChart: (period?: string, groupBy?: string) =>
    [...dashboardKeys.all, "revenueChart", period, groupBy] as const,
  bookingsByRegion: () => [...dashboardKeys.all, "bookingsByRegion"] as const,
  fleetStatus: () => [...dashboardKeys.all, "fleetStatus"] as const,
  upcomingBookings: () => [...dashboardKeys.all, "upcomingBookings"] as const,
  topPackages: () => [...dashboardKeys.all, "topPackages"] as const,
};

async function getStatsApi(period?: string): Promise<DashboardStats> {
  const params = new URLSearchParams();
  if (period) params.set("period", period);
  const { data } = await apiClient.get(
    `${config.api.dashboard.stats}${params.toString() ? `?${params}` : ""}`
  );
  if (data?.error) throw new Error(data?.error?.message || "Failed to load stats");
  return data as DashboardStats;
}

async function getRevenueChartApi(
  period?: string,
  groupBy?: string
): Promise<RevenueChartResponse> {
  const params = new URLSearchParams();
  if (period) params.set("period", period);
  if (groupBy) params.set("groupBy", groupBy);
  const { data } = await apiClient.get(
    `${config.api.dashboard.revenueChart}${params.toString() ? `?${params}` : ""}`
  );
  if (data?.error) throw new Error(data?.error?.message || "Failed to load revenue chart");
  return data as RevenueChartResponse;
}

async function getBookingsByRegionApi(): Promise<BookingsByRegionItem[]> {
  const { data } = await apiClient.get(config.api.dashboard.bookingsByRegion);
  if (data?.error) throw new Error(data?.error?.message || "Failed to load bookings");
  return data as BookingsByRegionItem[];
}

async function getFleetStatusApi(): Promise<FleetStatusItem[]> {
  const { data } = await apiClient.get(config.api.dashboard.fleetStatus);
  if (data?.error) throw new Error(data?.error?.message || "Failed to load fleet status");
  return data as FleetStatusItem[];
}

async function getUpcomingBookingsApi(): Promise<{ bookings: UpcomingBooking[] }> {
  const { data } = await apiClient.get(config.api.dashboard.upcomingBookings);
  if (data?.error) throw new Error(data?.error?.message || "Failed to load upcoming bookings");
  return data as { bookings: UpcomingBooking[] };
}

async function getTopPackagesApi(): Promise<TopPackagesResponse> {
  const { data } = await apiClient.get(config.api.dashboard.topPackages);
  if (data?.error) throw new Error(data?.error?.message || "Failed to load top packages");
  return data as TopPackagesResponse;
}

export function useDashboardStatsQuery(period?: string) {
  return useQuery({
    queryKey: dashboardKeys.stats(period),
    queryFn: () => getStatsApi(period),
  });
}

export function useRevenueChartQuery(period?: string, groupBy?: string) {
  return useQuery({
    queryKey: dashboardKeys.revenueChart(period, groupBy),
    queryFn: () => getRevenueChartApi(period, groupBy),
  });
}

export function useBookingsByRegionQuery() {
  return useQuery({
    queryKey: dashboardKeys.bookingsByRegion(),
    queryFn: getBookingsByRegionApi,
  });
}

export function useFleetStatusQuery() {
  return useQuery({
    queryKey: dashboardKeys.fleetStatus(),
    queryFn: getFleetStatusApi,
  });
}

export function useUpcomingBookingsQuery() {
  return useQuery({
    queryKey: dashboardKeys.upcomingBookings(),
    queryFn: getUpcomingBookingsApi,
  });
}

export function useTopPackagesQuery() {
  return useQuery({
    queryKey: dashboardKeys.topPackages(),
    queryFn: getTopPackagesApi,
  });
}
