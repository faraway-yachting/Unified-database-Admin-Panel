"use client";

import { useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { createBooking, useBookingAvailabilityQuery } from "@/lib/api/bookings";
import { useYachtsQuery } from "@/lib/api/yachts";
import { usePackagesQuery } from "@/lib/api/packages";
import { useRegionsQuery } from "@/lib/api/regions";
import { bookingsKeys } from "@/lib/api/bookings";
import { useQueryClient } from "@tanstack/react-query";
import { useCustomerSearchQuery, type CustomerSearchItem } from "@/lib/api/customers";

interface BookingCreateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormState = {
  customerId: string;
  yachtId: string;
  packageId: string;
  regionId: string;
  startDate: string;
  endDate: string;
  guestCount: string;
  baseAmount: string;
  totalAmount: string;
  currencyCode: string;
  status: string;
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

export function BookingCreateDrawer({ isOpen, onClose }: BookingCreateDrawerProps) {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
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
    startDate: "",
    endDate: "",
    guestCount: "",
    baseAmount: "",
    totalAmount: "",
    currencyCode: "USD",
    status: "inquiry",
    specialRequests: "",
    internalNotes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [debouncedCustomerSearch, setDebouncedCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSearchItem | null>(null);
  const [isCustomerMenuOpen, setIsCustomerMenuOpen] = useState(false);

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedCustomerSearch(customerSearch.trim());
    }, 400);
    return () => clearTimeout(handle);
  }, [customerSearch]);

  const {
    data: customerSearchData,
    isLoading: isCustomerSearchLoading,
    isError: isCustomerSearchError,
    error: customerSearchError,
  } = useCustomerSearchQuery({
    search: debouncedCustomerSearch,
    limit: 10,
    enabled: isOpen,
  });

  const customerResults = customerSearchData?.customers ?? [];

  const availabilityEnabled = !!(form.yachtId && form.startDate && form.endDate);
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

  const availabilityBookings = availability?.conflictingBookings ?? [];
  const availabilityBlocks = availability?.conflictingBlocks ?? [];
  const hasAvailabilityConflict = availabilityEnabled && (availabilityBookings.length > 0 || availabilityBlocks.length > 0);

  const formatDateOnly = (value?: string) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString();
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm({
      customerId: "",
      yachtId: "",
      packageId: "",
      regionId: "",
      startDate: "",
      endDate: "",
      guestCount: "",
      baseAmount: "",
      totalAmount: "",
      currencyCode: "USD",
      status: "inquiry",
      specialRequests: "",
      internalNotes: "",
    });
    setCustomerSearch("");
    setDebouncedCustomerSearch("");
    setSelectedCustomer(null);
    setIsCustomerMenuOpen(false);
  };

  const handleSubmit = async () => {
    if (
      !form.customerId ||
      !form.yachtId ||
      !form.packageId ||
      !form.regionId ||
      !form.startDate ||
      !form.endDate ||
      !form.guestCount ||
      !form.baseAmount ||
      !form.totalAmount ||
      !form.currencyCode
    ) {
      return;
    }
    if (hasAvailabilityConflict || isAvailabilityLoading) {
      return;
    }
    setIsSubmitting(true);
    try {
      await createBooking({
        customerId: form.customerId,
        yachtId: form.yachtId,
        packageId: form.packageId,
        regionId: form.regionId,
        startDate: form.startDate,
        endDate: form.endDate,
        guestCount: Number(form.guestCount),
        baseAmount: Number(form.baseAmount),
        totalAmount: Number(form.totalAmount),
        currencyCode: form.currencyCode,
        status: form.status,
        specialRequests: form.specialRequests || undefined,
        internalNotes: form.internalNotes || undefined,
      });
      await queryClient.invalidateQueries({ queryKey: bookingsKeys.lists() });
      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
        aria-labelledby="booking-form-title"
      >
        <div
          className="flex items-center justify-between h-14 px-4 border-b shrink-0"
          style={{ borderColor: colors.cardBorder }}
        >
          <h2 id="booking-form-title" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
            Create New Booking
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

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-6">
              <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: colors.textPrimary }}>
                  Booking Details
                </h4>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search customer by name, email, or phone"
                      value={customerSearch}
                      onChange={(e) => {
                        setCustomerSearch(e.target.value);
                        setSelectedCustomer(null);
                        updateField("customerId", "");
                        setIsCustomerMenuOpen(true);
                      }}
                      onFocus={() => setIsCustomerMenuOpen(true)}
                      onBlur={() => {
                        window.setTimeout(() => setIsCustomerMenuOpen(false), 150);
                      }}
                      className="w-full px-4 py-2.5 rounded-lg border text-sm"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.cardBorder,
                        color: colors.textPrimary,
                      }}
                    />
                    {isCustomerMenuOpen && customerSearch.trim().length >= 2 && (
                      <div
                        className="absolute z-20 mt-2 w-full rounded-lg border shadow-lg max-h-56 overflow-y-auto"
                        style={{
                          backgroundColor: colors.cardBg,
                          borderColor: colors.cardBorder,
                        }}
                      >
                        {isCustomerSearchLoading ? (
                          <div className="px-3 py-2 text-sm" style={{ color: colors.textSecondary }}>
                            Searching...
                          </div>
                        ) : isCustomerSearchError ? (
                          <div className="px-3 py-2 text-sm" style={{ color: colors.danger }}>
                            {customerSearchError instanceof Error ? customerSearchError.message : "Failed to load customers."}
                          </div>
                        ) : customerResults.length === 0 ? (
                          <div className="px-3 py-2 text-sm" style={{ color: colors.textSecondary }}>
                            No customers found.
                          </div>
                        ) : (
                          customerResults.map((customer) => {
                            const label = `${customer.firstName} ${customer.lastName}`.trim() || customer.email;
                            const subLabel = customer.email || customer.phone || customer.whatsapp || "";
                            return (
                              <button
                                key={customer.id}
                                type="button"
                                className="w-full text-left px-3 py-2 text-sm hover:bg-black/5"
                                style={{ color: colors.textPrimary }}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setSelectedCustomer(customer);
                                  setCustomerSearch(label);
                                  updateField("customerId", customer.id);
                                  setIsCustomerMenuOpen(false);
                                }}
                              >
                                <div className="font-medium">{label}</div>
                                {subLabel ? (
                                  <div className="text-[11px]" style={{ color: colors.textSecondary }}>
                                    {subLabel}
                                  </div>
                                ) : null}
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                    {selectedCustomer && (
                      <div className="mt-1 text-[11px]" style={{ color: colors.textSecondary }}>
                        Selected: {selectedCustomer.firstName} {selectedCustomer.lastName} ({selectedCustomer.email})
                      </div>
                    )}
                  </div>
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
                          {availabilityBookings.length > 0 && (
                            <div className="mt-1">
                              Conflicting bookings:{" "}
                              {availabilityBookings
                                .map((b) => `${b.bookingRef ?? b.id} (${formatDateOnly(b.startDate)} - ${formatDateOnly(b.endDate)})`)
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
                  </div>
                  <div className="grid grid-cols-2 gap-3">
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
              </div>

              <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: colors.textPrimary }}>
                  Notes
                </h4>
                <div className="space-y-4">
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
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
              style={{
                background: `linear-gradient(to right, ${colors.accent}, #00B39F)`,
                boxShadow: `0 10px 25px -5px ${colors.accent}30`,
              }}
              onClick={handleSubmit}
              disabled={isSubmitting || isAvailabilityLoading || hasAvailabilityConflict}
            >
              {isSubmitting ? "Creating..." : isAvailabilityLoading ? "Checking..." : "Create Booking"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingCreateDrawer;
