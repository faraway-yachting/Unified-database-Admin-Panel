"use client";

import { useEffect, useMemo, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useRegionsQuery } from "@/lib/api/regions";
import { pricingKeys, updatePromoCode, usePromoCodeQuery } from "@/lib/api/pricing";
import { useQueryClient } from "@tanstack/react-query";

interface PromoCodeEditDrawerProps {
  promoId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

type FormState = {
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: string;
  minBookingValue: string;
  maxUses: string;
  maxUsesPerCustomer: string;
  regionId: string;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
};

const DISCOUNT_TYPES = [
  { label: "Percentage", value: "percentage" },
  { label: "Fixed", value: "fixed" },
];

const toDateInput = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

export function PromoCodeEditDrawer({ promoId, isOpen, onClose }: PromoCodeEditDrawerProps) {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const { data: regionsData } = useRegionsQuery();
  const { data: promo, isLoading } = usePromoCodeQuery(promoId);
  const regions = regionsData ?? [];

  const initialForm = useMemo<FormState>(() => {
    return {
      code: promo?.code ?? "",
      description: promo?.description ?? "",
      discountType: promo?.discountType ?? "percentage",
      discountValue: promo?.discountValue != null ? String(promo.discountValue) : "",
      minBookingValue: promo?.minBookingValue != null ? String(promo.minBookingValue) : "",
      maxUses: promo?.maxUses != null ? String(promo.maxUses) : "",
      maxUsesPerCustomer:
        promo?.maxUsesPerCustomer != null ? String(promo.maxUsesPerCustomer) : "1",
      regionId: promo?.region?.id ?? "",
      validFrom: toDateInput(promo?.validFrom),
      validUntil: toDateInput(promo?.validUntil),
      isActive: promo?.isActive ?? true,
    };
  }, [promo]);

  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(initialForm);
    }
  }, [initialForm, isOpen]);

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

  const updateField = (key: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!promoId || !form.discountValue || !form.validFrom || !form.validUntil) return;
    setIsSubmitting(true);
    try {
      await updatePromoCode(promoId, {
        description: form.description.trim() || undefined,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minBookingValue: form.minBookingValue ? Number(form.minBookingValue) : undefined,
        maxUses: form.maxUses ? Number(form.maxUses) : undefined,
        maxUsesPerCustomer: form.maxUsesPerCustomer ? Number(form.maxUsesPerCustomer) : undefined,
        regionId: form.regionId || undefined,
        validFrom: form.validFrom,
        validUntil: form.validUntil,
        isActive: form.isActive,
      });
      await queryClient.invalidateQueries({ queryKey: pricingKeys.promoCodes() });
      await queryClient.invalidateQueries({ queryKey: ["pricing", "promo-codes", "detail", promoId] });
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
        className="fixed inset-y-0 right-0 z-50 w-full max-w-3xl flex flex-col shadow-2xl overflow-hidden"
        style={{
          backgroundColor: colors.background,
          borderLeft: `1px solid ${colors.cardBorder}`,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="promo-code-edit-title"
      >
        <div className="flex items-center justify-between h-14 px-4 border-b shrink-0" style={{ borderColor: colors.cardBorder }}>
          <h2 id="promo-code-edit-title" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
            Edit Promo Code
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
          <div className="space-y-6">
            <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: colors.textPrimary }}>
                Promo Code Details
              </h4>
              {isLoading ? (
                <div className="text-sm" style={{ color: colors.textSecondary }}>
                  Loading promo code...
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                      Code
                    </label>
                    <input
                      type="text"
                      value={form.code}
                      disabled
                      className="w-full px-4 py-2.5 rounded-lg border text-sm opacity-70 cursor-not-allowed"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.cardBorder,
                        color: colors.textPrimary,
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="Optional description"
                      value={form.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border text-sm"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.cardBorder,
                        color: colors.textPrimary,
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="relative">
                      <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                        Discount type
                      </label>
                      <select
                        value={form.discountType}
                        onChange={(e) => updateField("discountType", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm appearance-none cursor-pointer"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      >
                        {DISCOUNT_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-[42px] w-4 h-4 pointer-events-none" style={{ color: colors.textSecondary }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                        Discount value
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder={form.discountType === "percentage" ? "15" : "100"}
                        value={form.discountValue}
                        onChange={(e) => updateField("discountValue", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                        Min booking value
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        value={form.minBookingValue}
                        onChange={(e) => updateField("minBookingValue", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                        Max uses
                      </label>
                      <input
                        type="number"
                        placeholder="Optional"
                        value={form.maxUses}
                        onChange={(e) => updateField("maxUses", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                        Max uses per customer
                      </label>
                      <input
                        type="number"
                        placeholder="1"
                        value={form.maxUsesPerCustomer}
                        onChange={(e) => updateField("maxUsesPerCustomer", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                    <div className="relative">
                      <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                        Region
                      </label>
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
                        <option value="">All Regions</option>
                        {regions.map((region) => (
                          <option key={region.id} value={region.id}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-[42px] w-4 h-4 pointer-events-none" style={{ color: colors.textSecondary }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                        Valid from
                      </label>
                      <input
                        type="date"
                        value={form.validFrom}
                        onChange={(e) => updateField("validFrom", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                        Valid until
                      </label>
                      <input
                        type="date"
                        value={form.validUntil}
                        onChange={(e) => updateField("validUntil", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-3 text-sm" style={{ color: colors.textSecondary }}>
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => updateField("isActive", e.target.checked)}
                        className="w-4 h-4"
                      />
                      Active promo code
                    </label>
                  </div>
                </div>
              )}
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
              disabled={isSubmitting || !form.discountValue || !form.validFrom || !form.validUntil}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PromoCodeEditDrawer;
