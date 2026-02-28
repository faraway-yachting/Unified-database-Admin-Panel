"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { bookingsKeys, updateBooking, useBookingAvailabilityQuery, useBookingDetailQuery } from "@/lib/api/bookings";
import { useYachtsQuery } from "@/lib/api/yachts";
import { usePackagesQuery } from "@/lib/api/packages";
import { useRegionsQuery } from "@/lib/api/regions";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useQueryClient } from "@tanstack/react-query";

interface BookingEditDrawerProps {
  bookingId: string | null;
  onClose: () => void;
}

type FormState = {
  customerId: string;
  yachtId: string;
  packageId: string;
  regionId: string;
  agentId: string;
  promoCodeId: string;
  startDate: string;
  endDate: string;
  startTime: string;
  guestCount: string;
  status: string;
  baseAmount: string;
  addonsAmount: string;
  discountAmount: string;
  taxAmount: string;
  totalAmount: string;
  currencyCode: string;
  cancellationPolicy: string;
  cancellationReason: string;
  specialRequests: string;
  internalNotes: string;
};

const STATUS_OPTIONS = [
  { label: "Inquiry", value: "inquiry" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Paid", value: "paid" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const formatDateInput = (value?: string | null) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

const toStringValue = (value?: string | number | null) => {
  if (value === null || value === undefined) return "";
  return String(value);
};

const formatDateOnly = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
};

export function BookingEditDrawer({ bookingId, onClose }: BookingEditDrawerProps) {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const { data: booking, isLoading, isError, error } = useBookingDetailQuery(bookingId);
  const { data: yachtsData } = useYachtsQuery(1, 100);
  const { data: packagesData } = usePackagesQuery(1, 100);
  const { data: regionsData } = useRegionsQuery();

  const yachts = yachtsData?.yachts ?? [];
  const packages = packagesData?.packages ?? [];
  const regions = regionsData ?? [];

  const [form, setForm] = useState<FormState>({
    customerId: "",
    yachtId: "",
    packageId: "",
    regionId: "",
    agentId: "",
    promoCodeId: "",
    startDate: "",
    endDate: "",
    startTime: "",
    guestCount: "",
    status: "inquiry",
    baseAmount: "",
    addonsAmount: "",
    discountAmount: "",
    taxAmount: "",
    totalAmount: "",
    currencyCode: "USD",
    cancellationPolicy: "",
    cancellationReason: "",
    specialRequests: "",
    internalNotes: "",
  });

  const initialRef = useRef<FormState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availabilityEnabled =
    !!bookingId &&
    !!form.yachtId &&
    !!form.startDate &&
    !!form.endDate &&
    !!initialRef.current &&
    (form.yachtId !== initialRef.current.yachtId ||
      form.startDate !== initialRef.current.startDate ||
      form.endDate !== initialRef.current.endDate);

  const {
    data: availability,
    isLoading: isAvailabilityLoading,
    isError: isAvailabilityError,
    error: availabilityError,
  } = useBookingAvailabilityQuery({
    yachtId: form.yachtId,
    from: form.startDate,
    to: form.endDate,
    enabled: availabilityEnabled,
  });

  const filteredAvailabilityBookings = useMemo(() => {
    const bookings = availability?.conflictingBookings ?? [];
    return bookingId ? bookings.filter((b) => b.id !== bookingId) : bookings;
  }, [availability?.conflictingBookings, bookingId]);

  const availabilityBlocks = availability?.conflictingBlocks ?? [];
  const hasAvailabilityConflict =
    availabilityEnabled && (filteredAvailabilityBookings.length > 0 || availabilityBlocks.length > 0);

  useEffect(() => {
    if (!booking) return;
    const nextForm: FormState = {
      customerId: booking.customerId ?? "",
      yachtId: booking.yachtId ?? "",
      packageId: booking.packageId ?? "",
      regionId: booking.regionId ?? "",
      agentId: booking.agent?.id ?? "",
      promoCodeId: booking.promoCode?.id ?? "",
      startDate: formatDateInput(booking.startDate),
      endDate: formatDateInput(booking.endDate),
      startTime: booking.startTime ?? "",
      guestCount: toStringValue(booking.guestCount),
      status: booking.status ?? "inquiry",
      baseAmount: toStringValue(booking.baseAmount),
      addonsAmount: toStringValue(booking.addonsAmount),
      discountAmount: toStringValue(booking.discountAmount),
      taxAmount: toStringValue(booking.taxAmount),
      totalAmount: toStringValue(booking.totalAmount),
      currencyCode: booking.currencyCode ?? booking.currency?.code ?? "USD",
      cancellationPolicy: booking.cancellationPolicy ?? "",
      cancellationReason: booking.cancellationReason ?? "",
      specialRequests: booking.specialRequests ?? "",
      internalNotes: booking.internalNotes ?? "",
    };
    setForm(nextForm);
    initialRef.current = nextForm;
  }, [booking]);

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const hasChanges = useMemo(() => {
    if (!initialRef.current) return false;
    return Object.keys(form).some((key) => form[key as keyof FormState] !== initialRef.current?.[key as keyof FormState]);
  }, [form]);

  const handleSubmit = async () => {
    if (!bookingId || !initialRef.current) return;
    if (isAvailabilityLoading || hasAvailabilityConflict) return;
    const initial = initialRef.current;
    const payload: Record<string, unknown> = {};

    const setIfChanged = (key: keyof FormState, value: unknown) => {
      if (form[key] !== initial[key]) payload[key] = value;
    };

    if (form.customerId && form.customerId !== initial.customerId) payload.customerId = form.customerId;
    if (form.yachtId && form.yachtId !== initial.yachtId) payload.yachtId = form.yachtId;
    if (form.packageId && form.packageId !== initial.packageId) payload.packageId = form.packageId;
    if (form.regionId && form.regionId !== initial.regionId) payload.regionId = form.regionId;

    if (form.agentId !== initial.agentId) {
      payload.agentId = form.agentId ? form.agentId : null;
    }
    if (form.promoCodeId !== initial.promoCodeId) {
      payload.promoCodeId = form.promoCodeId ? form.promoCodeId : null;
    }

    if (form.startDate && form.startDate !== initial.startDate) payload.startDate = form.startDate;
    if (form.endDate && form.endDate !== initial.endDate) payload.endDate = form.endDate;
    setIfChanged("startTime", form.startTime ? form.startTime : null);

    if (form.guestCount !== "" && form.guestCount !== initial.guestCount) {
      payload.guestCount = Number(form.guestCount);
    }

    setIfChanged("status", form.status);

    if (form.baseAmount !== "" && form.baseAmount !== initial.baseAmount) payload.baseAmount = Number(form.baseAmount);
    if (form.addonsAmount !== "" && form.addonsAmount !== initial.addonsAmount) payload.addonsAmount = Number(form.addonsAmount);
    if (form.discountAmount !== "" && form.discountAmount !== initial.discountAmount) payload.discountAmount = Number(form.discountAmount);
    if (form.taxAmount !== "" && form.taxAmount !== initial.taxAmount) payload.taxAmount = Number(form.taxAmount);
    if (form.totalAmount !== "" && form.totalAmount !== initial.totalAmount) payload.totalAmount = Number(form.totalAmount);
    if (form.currencyCode && form.currencyCode !== initial.currencyCode) payload.currencyCode = form.currencyCode;

    setIfChanged("cancellationPolicy", form.cancellationPolicy ? form.cancellationPolicy : null);
    setIfChanged("cancellationReason", form.cancellationReason ? form.cancellationReason : null);
    setIfChanged("specialRequests", form.specialRequests ? form.specialRequests : null);
    setIfChanged("internalNotes", form.internalNotes ? form.internalNotes : null);

    if (!Object.keys(payload).length) return;

    setIsSubmitting(true);
    try {
      await updateBooking(bookingId, payload);
      await queryClient.invalidateQueries({ queryKey: bookingsKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: bookingsKeys.detail(bookingId) });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!bookingId) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" aria-hidden onClick={onClose} />
      <div
        className="fixed inset-y-0 right-0 z-50 w-full max-w-4xl flex flex-col shadow-2xl overflow-hidden"
        style={{
          backgroundColor: colors.background,
          borderLeft: `1px solid ${colors.cardBorder}`,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-edit-title"
      >
        <div
          className="flex items-center justify-between h-14 px-4 border-b shrink-0"
          style={{ borderColor: colors.cardBorder }}
        >
          <h2 id="booking-edit-title" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
            Edit Booking
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg transition-all flex-shrink-0"
            style={{
              backgroundColor: colors.cardBg,
              color: colors.textSecondary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${colors.danger}15`;
              e.currentTarget.style.color = colors.danger;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.cardBg;
              e.currentTarget.style.color = colors.textSecondary;
            }}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <LoadingSpinner size="lg" text="Loading booking..." />
          </div>
        ) : isError ? (
          <div className="p-6 text-sm" style={{ color: colors.textSecondary }}>
            {error instanceof Error ? error.message : "Failed to load booking."}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-6">
                <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                  <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: colors.textPrimary }}>
                    Booking Details
                  </h4>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Customer ID"
                      value={form.customerId}
                      onChange={(e) => updateField("customerId", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border text-sm"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.cardBorder,
                        color: colors.textPrimary,
                      }}
                    />
                    <div className="relative">
                      <select
                        value={form.yachtId}
                        onChange={(e) => updateField("yachtId", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm appearance-none cursor-pointer"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      >
                        <option value="">Select yacht</option>
                        {yachts.map((y) => (
                          <option key={y.id} value={y.id}>
                            {y.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: colors.textSecondary }} />
                    </div>
                    <div className="relative">
                      <select
                        value={form.packageId}
                        onChange={(e) => updateField("packageId", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm appearance-none cursor-pointer"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      >
                        <option value="">Select package</option>
                        {packages.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: colors.textSecondary }} />
                    </div>
                    <div className="relative">
                      <select
                        value={form.regionId}
                        onChange={(e) => updateField("regionId", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm appearance-none cursor-pointer"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      >
                        <option value="">Select region</option>
                        {regions.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: colors.textSecondary }} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={form.startDate}
                        onChange={(e) => updateField("startDate", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                      <input
                        type="date"
                        value={form.endDate}
                        onChange={(e) => updateField("endDate", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                    {availabilityEnabled && (
                      <div className="text-[11px] md:text-xs">
                        {isAvailabilityLoading ? (
                          <span style={{ color: colors.textSecondary }}>Checking availability...</span>
                        ) : isAvailabilityError ? (
                          <span style={{ color: colors.danger }}>
                            {availabilityError instanceof Error ? availabilityError.message : "Availability check failed."}
                          </span>
                        ) : hasAvailabilityConflict ? (
                          <div style={{ color: colors.danger }}>
                            <div>Selected dates are not available.</div>
                            {filteredAvailabilityBookings.length > 0 && (
                              <div className="mt-1">
                                Conflicting bookings:{" "}
                                {filteredAvailabilityBookings
                                  .map(
                                    (b) =>
                                      `${b.bookingRef ?? b.id} (${formatDateOnly(b.startDate)} - ${formatDateOnly(b.endDate)})`
                                  )
                                  .join(", ")}
                              </div>
                            )}
                            {availabilityBlocks.length > 0 && (
                              <div className="mt-1">
                                Blocked dates:{" "}
                                {availabilityBlocks
                                  .map((b) => `${formatDateOnly(b.startDate)} - ${formatDateOnly(b.endDate)}`)
                                  .join(", ")}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: colors.accent }}>Dates are available.</span>
                        )}
                      </div>
                    )}
                    <input
                      type="text"
                      placeholder="Start time (e.g., 09:00)"
                      value={form.startTime}
                      onChange={(e) => updateField("startTime", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border text-sm"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.cardBorder,
                        color: colors.textPrimary,
                      }}
                    />
                    <input
                      type="number"
                      min={1}
                      placeholder="Guest count"
                      value={form.guestCount}
                      onChange={(e) => updateField("guestCount", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border text-sm"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.cardBorder,
                        color: colors.textPrimary,
                      }}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Agent ID (optional)"
                        value={form.agentId}
                        onChange={(e) => updateField("agentId", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Promo code ID (optional)"
                        value={form.promoCodeId}
                        onChange={(e) => updateField("promoCodeId", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                  <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: colors.textPrimary }}>
                    Pricing & Status
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        min={0}
                        placeholder="Base amount"
                        value={form.baseAmount}
                        onChange={(e) => updateField("baseAmount", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                      <input
                        type="number"
                        min={0}
                        placeholder="Addons amount"
                        value={form.addonsAmount}
                        onChange={(e) => updateField("addonsAmount", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        min={0}
                        placeholder="Discount amount"
                        value={form.discountAmount}
                        onChange={(e) => updateField("discountAmount", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                      <input
                        type="number"
                        min={0}
                        placeholder="Tax amount"
                        value={form.taxAmount}
                        onChange={(e) => updateField("taxAmount", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        min={0}
                        placeholder="Total amount"
                        value={form.totalAmount}
                        onChange={(e) => updateField("totalAmount", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Currency code"
                        value={form.currencyCode}
                        onChange={(e) => updateField("currencyCode", e.target.value.toUpperCase())}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={form.status}
                        onChange={(e) => updateField("status", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm appearance-none cursor-pointer"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: colors.textSecondary }} />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                  <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: colors.textPrimary }}>
                    Notes & Policies
                  </h4>
                  <div className="space-y-4">
                    <textarea
                      rows={2}
                      placeholder="Cancellation policy"
                      value={form.cancellationPolicy}
                      onChange={(e) => updateField("cancellationPolicy", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border text-sm"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.cardBorder,
                        color: colors.textPrimary,
                      }}
                    />
                    <textarea
                      rows={2}
                      placeholder="Cancellation reason"
                      value={form.cancellationReason}
                      onChange={(e) => updateField("cancellationReason", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border text-sm"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.cardBorder,
                        color: colors.textPrimary,
                      }}
                    />
                    <textarea
                      rows={3}
                      placeholder="Special requests"
                      value={form.specialRequests}
                      onChange={(e) => updateField("specialRequests", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border text-sm"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.cardBorder,
                        color: colors.textPrimary,
                      }}
                    />
                    <textarea
                      rows={3}
                      placeholder="Internal notes"
                      value={form.internalNotes}
                      onChange={(e) => updateField("internalNotes", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border text-sm"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.cardBorder,
                        color: colors.textPrimary,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t" style={{ borderColor: colors.cardBorder }}>
              <button
                type="button"
                className="px-6 py-2.5 rounded-lg border text-sm font-medium transition-all"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.cardBorder,
                  color: colors.textPrimary,
                }}
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50"
                style={{
                  background: `linear-gradient(to right, ${colors.accent}, #00B39F)`,
                  boxShadow: `0 10px 25px -5px ${colors.accent}30`,
                }}
                onClick={handleSubmit}
                disabled={isSubmitting || !hasChanges || isAvailabilityLoading || hasAvailabilityConflict}
              >
                {isSubmitting ? "Saving..." : isAvailabilityLoading ? "Checking..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default BookingEditDrawer;
