"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle,
  HelpCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useBookings } from "@/context/BookingsContext";
import { bookingsKeys, cancelBooking, useBookingsQuery } from "@/lib/api/bookings";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useQueryClient } from "@tanstack/react-query";
import { BookingKPICard } from "./BookingKPICard";
import { BookingCalendar } from "./BookingCalendar";
import { UpcomingBookingsList, type UpcomingBooking } from "./UpcomingBookingsList";
import { BookingsTable, type Booking } from "./BookingsTable";
import { BookingDetailPanel } from "./BookingDetailPanel";

const PAGE_SIZE = 20;

const calendarBookings = [
  { id: "1", yacht: "Azure Dream", customer: "Michael Chen", status: "confirmed" as const, day: 22 },
  { id: "2", yacht: "Ocean Majesty", customer: "Sarah Williams", status: "inquiry" as const, day: 5 },
  { id: "3", yacht: "Azure Dream", customer: "Michael Chen", status: "confirmed" as const, day: 23 },
  { id: "4", yacht: "Twin Seas", customer: "James Rodriguez", status: "inquiry" as const, day: 18 },
  { id: "5", yacht: "Platinum Wave", customer: "Emma Thompson", status: "completed" as const, day: 1 },
  { id: "6", yacht: "Wind Chaser", customer: "David Park", status: "cancelled" as const, day: 14 },
  { id: "7", yacht: "Silver Horizon", customer: "Lisa Anderson", status: "inquiry" as const, day: 25 },
  { id: "8", yacht: "Azure Dream", customer: "Michael Chen", status: "confirmed" as const, day: 27 },
];

const upcomingBookings: UpcomingBooking[] = [
  {
    id: "BK-2847",
    customer: {
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    yacht: "Azure Dream",
    package: "Sunset Experience",
    dateRange: "Feb 22 - Feb 28",
    region: "Mediterranean",
    status: "paid",
  },
  {
    id: "BK-2901",
    customer: {
      name: "Sarah Williams",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    yacht: "Ocean Majesty",
    package: "Full Day Adventure",
    dateRange: "Mar 5 - Mar 12",
    region: "Caribbean",
    status: "confirmed",
  },
  {
    id: "BK-2954",
    customer: {
      name: "James Rodriguez",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
    yacht: "Twin Seas",
    package: "Island Hopping",
    dateRange: "Mar 18 - Mar 25",
    region: "Pacific",
    status: "inquiry",
  },
  {
    id: "BK-2999",
    customer: {
      name: "Maria Garcia",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    yacht: "Azure Dream",
    package: "Half-Day Charter",
    dateRange: "Mar 28",
    region: "Mediterranean",
    status: "paid",
  },
  {
    id: "BK-3021",
    customer: {
      name: "Lisa Anderson",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    },
    yacht: "Silver Horizon",
    package: "Corporate Event",
    dateRange: "Apr 2",
    region: "Caribbean",
    status: "inquiry",
  },
];

export default function BookingEngine() {
  const { selectedStatus } = useBookings();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const statusFilter =
    selectedStatus === "All" ? undefined : selectedStatus.toLowerCase();

  const { data, isLoading, isError, error } = useBookingsQuery(page, PAGE_SIZE, {
    status: statusFilter,
  });

  useEffect(() => {
    setPage(1);
  }, [selectedStatus]);

  const bookings = useMemo<Booking[]>(() => {
    return (data?.bookings ?? []).map((b) => {
      const customerName = `${b.customer?.firstName ?? ""} ${b.customer?.lastName ?? ""}`.trim() || "—";
      return {
        id: b.bookingRef ?? b.id,
        customer: customerName,
        yacht: b.yacht?.name ?? "—",
        package: b.package?.name ?? "—",
        region: b.region?.name ?? "—",
        startDate: b.startDate,
        endDate: b.endDate,
        totalAmount: typeof b.totalAmount === "number" ? b.totalAmount : parseFloat(String(b.totalAmount)) || 0,
        currency: b.currency?.symbol ?? b.currency?.code ?? "",
        status: b.status as Booking["status"],
      };
    });
  }, [data?.bookings]);

  const totalBookings = data?.total ?? bookings.length;
  const confirmedBookings = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "paid"
  ).length;
  const pendingInquiries = bookings.filter((b) => b.status === "inquiry").length;
  const completedBookings = bookings.filter((b) => b.status === "completed").length;
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled").length;

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailPanel(true);
  };

  const handleEdit = (booking: Booking) => {
    console.log("Edit booking:", booking.id);
  };

  const handleDelete = async (booking: Booking) => {
    try {
      await cancelBooking(booking.id);
      await queryClient.invalidateQueries({ queryKey: bookingsKeys.lists() });
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickView = (booking: UpcomingBooking) => {
    const fullBooking = bookings.find((b) => b.id === booking.id);
    if (fullBooking) {
      setSelectedBooking(fullBooking);
      setShowDetailPanel(true);
    }
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
          month="February"
          year={2026}
          bookings={calendarBookings}
        />
        <UpcomingBookingsList
          bookings={upcomingBookings}
          onQuickView={handleQuickView}
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

      {/* Row 4 - Booking Detail Panel */}
      {showDetailPanel && (
        <BookingDetailPanel
          booking={selectedBooking}
          onClose={() => {
            setShowDetailPanel(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
}
