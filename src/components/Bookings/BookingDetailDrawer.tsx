"use client";

import { useMemo } from "react";
import { X, Calendar, User, Ship, Package, MapPin, DollarSign } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useBookingDetailQuery } from "@/lib/api/bookings";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface BookingDetailDrawerProps {
  bookingId: string | null;
  onClose: () => void;
}

export function BookingDetailDrawer({ bookingId, onClose }: BookingDetailDrawerProps) {
  const { colors } = useTheme();
  const { data, isLoading, isError, error } = useBookingDetailQuery(bookingId);

  const booking = data;

  const formatDate = (value?: string | null) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString();
  };

  const formatAmount = (amount?: number | string) => {
    if (amount == null) return "—";
    const n = typeof amount === "number" ? amount : parseFloat(String(amount));
    return Number.isFinite(n) ? n.toLocaleString() : "—";
  };

  const customerName = useMemo(() => {
    if (!booking?.customer) return "—";
    const name = `${booking.customer.firstName ?? ""} ${booking.customer.lastName ?? ""}`.trim();
    return name || "—";
  }, [booking?.customer]);

  if (!bookingId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-detail-title"
    >
      <div
        className="w-full max-w-5xl max-h-[90vh] rounded-2xl border overflow-y-auto"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="sticky top-0 flex items-center justify-between p-6 border-b backdrop-blur-sm z-10"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.cardBorder,
          }}
        >
          <div>
            <h2 id="booking-detail-title" className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
              Booking Details
            </h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {booking?.bookingRef ?? booking?.id ?? "—"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg transition-all"
            style={{
              backgroundColor: colors.background,
              color: colors.textSecondary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${colors.danger}15`;
              e.currentTarget.style.color = colors.danger;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.background;
              e.currentTarget.style.color = colors.textSecondary;
            }}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {isLoading && (
            <div className="flex justify-center py-6">
              <LoadingSpinner size="md" text="Loading booking..." />
            </div>
          )}
          {isError && (
            <div
              className="rounded-xl border p-4 text-sm"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.danger,
                color: colors.textPrimary,
              }}
            >
              {error instanceof Error ? error.message : "Failed to load booking."}
            </div>
          )}

          {booking && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div
                  className="rounded-xl p-6 border"
                  style={{ backgroundColor: colors.background, borderColor: colors.cardBorder }}
                >
                  <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                    Overview
                  </h3>
                  <div className="space-y-3 text-sm" style={{ color: colors.textSecondary }}>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ship className="w-4 h-4" />
                      <span>{booking.yacht?.name ?? "—"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      <span>{booking.package?.name ?? "—"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{booking.region?.name ?? "—"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-xl p-6 border"
                  style={{ backgroundColor: colors.background, borderColor: colors.cardBorder }}
                >
                  <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                    Financials
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div style={{ color: colors.textSecondary }}>Base Amount</div>
                      <div style={{ color: colors.textPrimary }}>
                        {booking.currency?.symbol ?? booking.currency?.code ?? booking.currencyCode}{" "}
                        {formatAmount(booking.baseAmount)}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: colors.textSecondary }}>Total</div>
                      <div style={{ color: colors.textPrimary }}>
                        {booking.currency?.symbol ?? booking.currency?.code ?? booking.currencyCode}{" "}
                        {formatAmount(booking.totalAmount)}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: colors.textSecondary }}>Discount</div>
                      <div style={{ color: colors.textPrimary }}>
                        {formatAmount(booking.discountAmount)}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: colors.textSecondary }}>Tax</div>
                      <div style={{ color: colors.textPrimary }}>
                        {formatAmount(booking.taxAmount)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div
                  className="rounded-xl p-6 border"
                  style={{ backgroundColor: colors.background, borderColor: colors.cardBorder }}
                >
                  <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                    Status & Notes
                  </h3>
                  <div className="space-y-3 text-sm" style={{ color: colors.textSecondary }}>
                    <div>
                      <span style={{ color: colors.textPrimary }}>Status: </span>
                      {booking.status}
                    </div>
                    <div>
                      <span style={{ color: colors.textPrimary }}>Guest Count: </span>
                      {booking.guestCount ?? "—"}
                    </div>
                    <div>
                      <span style={{ color: colors.textPrimary }}>Special Requests: </span>
                      {booking.specialRequests || "—"}
                    </div>
                    <div>
                      <span style={{ color: colors.textPrimary }}>Internal Notes: </span>
                      {booking.internalNotes || "—"}
                    </div>
                    {booking.cancellationReason && (
                      <div>
                        <span style={{ color: colors.textPrimary }}>Cancellation Reason: </span>
                        {booking.cancellationReason}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className="rounded-xl p-6 border"
                  style={{ backgroundColor: colors.background, borderColor: colors.cardBorder }}
                >
                  <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                    Timeline
                  </h3>
                  <div className="space-y-3 text-sm" style={{ color: colors.textSecondary }}>
                    <div>
                      <span style={{ color: colors.textPrimary }}>Created: </span>
                      {formatDate(booking.createdAt)}
                    </div>
                    <div>
                      <span style={{ color: colors.textPrimary }}>Updated: </span>
                      {formatDate(booking.updatedAt)}
                    </div>
                    {booking.cancelledAt && (
                      <div>
                        <span style={{ color: colors.textPrimary }}>Cancelled: </span>
                        {formatDate(booking.cancelledAt)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingDetailDrawer;
