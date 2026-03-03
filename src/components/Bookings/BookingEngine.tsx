"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle,
  HelpCircle,
  Clock,
  XCircle,
  Search,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useBookings } from "@/context/BookingsContext";
import {
  bookingsKeys,
  deleteBooking,
  useBookingCalendarQuery,
  useBookingsQuery,
  useUpcomingBookingsQuery,
  type BookingListItem,
} from "@/lib/api/bookings";
import { useRegionsQuery } from "@/lib/api/regions";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useQueryClient } from "@tanstack/react-query";
import { BookingKPICard } from "./BookingKPICard";
import { BookingCalendar } from "./BookingCalendar";
import { UpcomingBookingsList, type UpcomingBooking } from "./UpcomingBookingsList";
import { BookingsTable, type Booking } from "./BookingsTable";
import { BookingDetailDrawer } from "./BookingDetailDrawer";
import { BookingCreateDrawer } from "./BookingCreateDrawer";
import { BookingEditDrawer } from "./BookingEditDrawer";

const PAGE_SIZE = 20;
const STATUS_OPTIONS = ["All", "Inquiry", "Confirmed", "Paid", "Completed", "Cancelled"] as const;

export default function BookingEngine() {
  const { colors } = useTheme();
  const {
    selectedStatus,
    setSelectedStatus,
    selectedRegion,
    setSelectedRegion,
    isCreateOpen,
    setIsCreateOpen,
  } = useBookings();
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [editBookingId, setEditBookingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Booking | null>(null);
  const [page, setPage] = useState(1);
  const [calendarDate, setCalendarDate] = useState(() => new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [minPriceFilter, setMinPriceFilter] = useState("");
  const [maxPriceFilter, setMaxPriceFilter] = useState("");
  const queryClient = useQueryClient();
  const { data: regionsData } = useRegionsQuery();
  const regions = regionsData ?? [];

  const statusFilter =
    selectedStatus === "All" ? undefined : selectedStatus.toLowerCase();

  const { data, isLoading, isError, error } = useBookingsQuery(page, PAGE_SIZE, {
    status: statusFilter,
  });

  const {
    data: upcomingData,
    isLoading: isUpcomingLoading,
    isError: isUpcomingError,
    error: upcomingError,
  } = useUpcomingBookingsQuery();

  const calendarMonth = calendarDate.getMonth();
  const calendarYear = calendarDate.getFullYear();
  const calendarMonthLabel = calendarDate.toLocaleString(undefined, { month: "long" });
  const calendarMonthParam = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}`;
  const selectedRegionId = selectedRegion || undefined;

  const {
    data: calendarData,
    isLoading: isCalendarLoading,
    isError: isCalendarError,
    error: calendarError,
  } = useBookingCalendarQuery({
    month: calendarMonthParam,
    regionId: selectedRegionId,
  });

  useEffect(() => {
    setPage(1);
  }, [selectedStatus]);

  const formatDateOnly = (value?: string) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString();
  };

  type BookingRow = Booking & {
    startDateRaw?: string;
    endDateRaw?: string;
    regionId?: string;
  };

  const bookings = useMemo<BookingRow[]>(() => {
    return (data?.bookings ?? []).map((b) => {
      const customerName = `${b.customer?.firstName ?? ""} ${b.customer?.lastName ?? ""}`.trim() || "—";
      return {
        id: b.id,
        bookingRef: b.bookingRef ?? b.id,
        customer: customerName,
        yacht: b.yacht?.name ?? "—",
        package: b.package?.name ?? "—",
        region: b.region?.name ?? "—",
        startDate: formatDateOnly(b.startDate),
        endDate: formatDateOnly(b.endDate),
        startDateRaw: b.startDate ?? undefined,
        endDateRaw: b.endDate ?? undefined,
        regionId: b.region?.id ?? "",
        totalAmount: typeof b.totalAmount === "number" ? b.totalAmount : parseFloat(String(b.totalAmount)) || 0,
        currency: b.currency?.symbol ?? b.currency?.code ?? "",
        status: b.status as Booking["status"],
      };
    });
  }, [data?.bookings]);

  const filteredBookings = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const minPrice = minPriceFilter ? Number(minPriceFilter) : null;
    const maxPrice = maxPriceFilter ? Number(maxPriceFilter) : null;
    const startDate = startDateFilter ? new Date(startDateFilter) : null;
    const endDate = endDateFilter ? new Date(endDateFilter) : null;
    const hasValidStart = startDate && !Number.isNaN(startDate.getTime());
    const hasValidEnd = endDate && !Number.isNaN(endDate.getTime());

    return bookings.filter((booking) => {
      if (normalizedSearch) {
        const haystack = `${booking.bookingRef} ${booking.customer} ${booking.yacht} ${booking.package} ${booking.region}`.toLowerCase();
        if (!haystack.includes(normalizedSearch)) return false;
      }

      if (selectedRegion && booking.regionId !== selectedRegion) return false;

      if (hasValidStart) {
        const bookingStart = booking.startDateRaw ? new Date(booking.startDateRaw) : null;
        if (!bookingStart || Number.isNaN(bookingStart.getTime()) || bookingStart < startDate) return false;
      }

      if (hasValidEnd) {
        const bookingEnd = booking.endDateRaw ? new Date(booking.endDateRaw) : null;
        if (!bookingEnd || Number.isNaN(bookingEnd.getTime()) || bookingEnd > endDate) return false;
      }

      if (minPrice !== null && !Number.isNaN(minPrice) && booking.totalAmount < minPrice) return false;
      if (maxPrice !== null && !Number.isNaN(maxPrice) && booking.totalAmount > maxPrice) return false;

      return true;
    });
  }, [bookings, endDateFilter, maxPriceFilter, minPriceFilter, searchQuery, selectedRegion, startDateFilter]);

  const formatUpcomingDateRange = (booking: BookingListItem) => {
    const start = formatDateOnly(booking.startDate);
    const end = formatDateOnly(booking.endDate);
    if (!booking.endDate || start === end) return start;
    return `${start} - ${end}`;
  };

  const upcomingBookings = useMemo<UpcomingBooking[]>(() => {
    return (upcomingData?.bookings ?? []).map((b) => {
      const customerName = `${b.customer?.firstName ?? ""} ${b.customer?.lastName ?? ""}`.trim() || "—";
      const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(customerName || "Guest")}&background=0D9488&color=ffffff`;
      return {
        id: b.id,
        customer: {
          name: customerName,
          avatar,
        },
        yacht: b.yacht?.name ?? "—",
        package: b.package?.name ?? "—",
        dateRange: formatUpcomingDateRange(b),
        region: b.region?.name ?? "—",
        status: (b.status as UpcomingBooking["status"]) ?? "inquiry",
      };
    });
  }, [upcomingData?.bookings]);

  const calendarBookings = useMemo(() => {
    const events = calendarData?.events ?? [];
    const monthStart = new Date(calendarYear, calendarMonth, 1);
    const monthEnd = new Date(calendarYear, calendarMonth + 1, 0);
    const output: { id: string; yacht: string; customer: string; status: "confirmed" | "paid" | "inquiry" | "completed" | "cancelled"; day: number }[] = [];

    events.forEach((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return;
      const rangeStart = start > monthStart ? start : monthStart;
      const rangeEnd = end < monthEnd ? end : monthEnd;
      if (rangeEnd < rangeStart) return;

      const customerName =
        `${event.customer?.firstName ?? ""} ${event.customer?.lastName ?? ""}`.trim() || "—";
      const yachtName = event.yacht?.name ?? "—";
      const status = (event.status as "confirmed" | "paid" | "inquiry" | "completed" | "cancelled") ?? "inquiry";

      for (let d = new Date(rangeStart); d <= rangeEnd; d.setDate(d.getDate() + 1)) {
        output.push({
          id: `${event.id}-${d.toISOString().slice(0, 10)}`,
          yacht: yachtName,
          customer: customerName,
          status,
          day: d.getDate(),
        });
      }
    });

    return output;
  }, [calendarData?.events, calendarMonth, calendarYear]);

  const totalBookings = data?.total ?? bookings.length;
  const confirmedBookings = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "paid"
  ).length;
  const pendingInquiries = bookings.filter((b) => b.status === "inquiry").length;
  const completedBookings = bookings.filter((b) => b.status === "completed").length;
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled").length;

  const handleView = (booking: Booking) => {
    setSelectedBookingId(booking.id);
  };

  const handleEdit = (booking: Booking) => {
    setEditBookingId(booking.id);
  };

  const handleDelete = (booking: Booking) => {
    setPendingDelete(booking);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteBooking(pendingDelete.id);
      await queryClient.invalidateQueries({ queryKey: bookingsKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: bookingsKeys.detail(pendingDelete.id) });
    } catch (err) {
      console.error(err);
    } finally {
      setPendingDelete(null);
    }
  };

  const handleQuickView = (booking: UpcomingBooking) => {
    setSelectedBookingId(booking.id);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedRegion("");
    setSelectedStatus("All");
    setStartDateFilter("");
    setEndDateFilter("");
    setMinPriceFilter("");
    setMaxPriceFilter("");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Row 1 - KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
        <BookingKPICard
          icon={Calendar}
          label="Total Bookings"
          value={totalBookings.toString()}
          change={12}
        />
        <BookingKPICard
          icon={CheckCircle}
          label="Confirmed"
          value={confirmedBookings.toString()}
          change={8}
        />
        <BookingKPICard
          icon={HelpCircle}
          label="Pending Inquiries"
          value={pendingInquiries.toString()}
          change={-3}
        />
        <BookingKPICard
          icon={Clock}
          label="Completed"
          value={completedBookings.toString()}
          change={15}
        />
        <BookingKPICard
          icon={XCircle}
          label="Cancelled"
          value={cancelledBookings.toString()}
          change={-5}
        />
      </div>

      {/* Row 2 - Calendar + Upcoming Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_480px] gap-4 md:gap-6 mb-6 md:mb-8">
        <BookingCalendar
          monthLabel={calendarMonthLabel}
          monthIndex={calendarMonth}
          year={calendarYear}
          bookings={calendarBookings}
          isLoading={isCalendarLoading}
          errorMessage={isCalendarError ? (calendarError instanceof Error ? calendarError.message : "Failed to load calendar.") : undefined}
          onPrevMonth={() =>
            setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
          }
          onNextMonth={() =>
            setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
          }
        />
        <UpcomingBookingsList
          bookings={upcomingBookings}
          onQuickView={handleQuickView}
          isLoading={isUpcomingLoading}
          errorMessage={
            isUpcomingError
              ? upcomingError instanceof Error
                ? upcomingError.message
                : "Failed to load upcoming bookings."
              : undefined
          }
        />
      </div>

      <div className="mb-6 md:mb-8">
        <div
          className="rounded-xl p-4 md:p-6 border backdrop-blur-sm"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.cardBorder,
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="w-5 h-5" style={{ color: colors.accent }} />
            <h3 className="text-base md:text-lg font-bold" style={{ color: colors.textPrimary }}>
              Quick Filters
            </h3>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <div className="min-w-[220px] flex-1">
              <label
                className="text-xs font-semibold uppercase tracking-wide mb-2 block"
                style={{ color: colors.textSecondary }}
              >
                Search Booking
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: colors.textSecondary }}
                  aria-hidden
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID, customer, yacht..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = `${colors.accent}50`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.cardBorder;
                  }}
                />
              </div>
            </div>

            <div className="min-w-[180px]">
              <label
                className="text-xs font-semibold uppercase tracking-wide mb-2 block"
                style={{ color: colors.textSecondary }}
              >
                Region
              </label>
              <div className="relative">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm appearance-none transition-all cursor-pointer focus:outline-none"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                >
                  <option value="">All Regions</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: colors.textSecondary }}
                  aria-hidden
                />
              </div>
            </div>

            <div className="min-w-[180px]">
              <label
                className="text-xs font-semibold uppercase tracking-wide mb-2 block"
                style={{ color: colors.textSecondary }}
              >
                Status
              </label>
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as (typeof STATUS_OPTIONS)[number])}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm appearance-none transition-all cursor-pointer focus:outline-none"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: colors.textSecondary }}
                  aria-hidden
                />
              </div>
            </div>

            <div className="min-w-[180px]">
              <label
                className="text-xs font-semibold uppercase tracking-wide mb-2 block"
                style={{ color: colors.textSecondary }}
              >
                Start Date
              </label>
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.cardBorder,
                  color: colors.textPrimary,
                }}
              />
            </div>

            <div className="min-w-[180px]">
              <label
                className="text-xs font-semibold uppercase tracking-wide mb-2 block"
                style={{ color: colors.textSecondary }}
              >
                End Date
              </label>
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.cardBorder,
                  color: colors.textPrimary,
                }}
              />
            </div>

            <div className="min-w-[240px]">
              <label
                className="text-xs font-semibold uppercase tracking-wide mb-2 block"
                style={{ color: colors.textSecondary }}
              >
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={0}
                  placeholder="Min"
                  value={minPriceFilter}
                  onChange={(e) => setMinPriceFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                />
                <input
                  type="number"
                  min={0}
                  placeholder="Max"
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2.5 rounded-lg border text-sm font-medium transition-all"
              style={{
                backgroundColor: "transparent",
                borderColor: colors.cardBorder,
                color: colors.textSecondary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.accent;
                e.currentTarget.style.color = colors.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.cardBorder;
                e.currentTarget.style.color = colors.textSecondary;
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Row 3 - Bookings Table */}
      <div className="mb-6 md:mb-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading bookings..." />
          </div>
        ) : isError ? (
          <div className="rounded-xl border p-6 text-center text-sm">
            {error instanceof Error ? error.message : "Failed to load bookings."}
          </div>
        ) : (
          <BookingsTable
            bookings={filteredBookings}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        {data?.totalPages && data.totalPages > 1 && (
          <div className="flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= data.totalPages}
              className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Page
            </button>
          </div>
        )}
      </div>

      <BookingDetailDrawer
        bookingId={selectedBookingId}
        onClose={() => {
          setSelectedBookingId(null);
        }}
      />
      <BookingCreateDrawer isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <BookingEditDrawer bookingId={editBookingId} onClose={() => setEditBookingId(null)} />
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
              Delete booking?
            </h3>
            <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
              This will permanently delete "{pendingDelete.bookingRef}". This action cannot be undone.
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
    </div>
  );
}
