"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle,
  HelpCircle,
  Clock,
  XCircle,
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

export default function BookingEngine() {
  const { colors } = useTheme();
  const { selectedStatus, selectedRegion, isCreateOpen, setIsCreateOpen } = useBookings();
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [editBookingId, setEditBookingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Booking | null>(null);
  const [page, setPage] = useState(1);
  const [calendarDate, setCalendarDate] = useState(() => new Date());
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
  const selectedRegionId =
    selectedRegion && selectedRegion !== "All Regions"
      ? regions.find((r) => r.name === selectedRegion)?.id
      : undefined;

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

  const bookings = useMemo<Booking[]>(() => {
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
        totalAmount: typeof b.totalAmount === "number" ? b.totalAmount : parseFloat(String(b.totalAmount)) || 0,
        currency: b.currency?.symbol ?? b.currency?.code ?? "",
        status: b.status as Booking["status"],
      };
    });
  }, [data?.bookings]);

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
            bookings={bookings}
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
