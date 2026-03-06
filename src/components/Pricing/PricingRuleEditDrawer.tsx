"use client";

import { useEffect, useMemo, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { usePackagesQuery } from "@/lib/api/packages";
import { useRegionsQuery } from "@/lib/api/regions";
import { pricingKeys, updatePricingRule, usePricingRuleQuery } from "@/lib/api/pricing";
import { useQueryClient } from "@tanstack/react-query";

interface PricingRuleEditDrawerProps {
  ruleId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

type FormState = {
  name: string;
  packageId: string;
  regionId: string;
  ruleType: string;
  multiplier: string;
  fixedAdjustment: string;
  startDate: string;
  endDate: string;
  priority: string;
  isActive: boolean;
};

const RULE_TYPES = [
  { label: "Peak", value: "peak" },
  { label: "Holiday", value: "holiday" },
  { label: "Last Minute", value: "last_minute" },
  { label: "Demand", value: "demand" },
  { label: "Custom", value: "custom" },
];

const toDateInput = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

export function PricingRuleEditDrawer({ ruleId, isOpen, onClose }: PricingRuleEditDrawerProps) {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const { data: packagesData } = usePackagesQuery(1, 100);
  const { data: regionsData } = useRegionsQuery();
  const { data: rule, isLoading } = usePricingRuleQuery(ruleId);

  const packages = packagesData?.packages ?? [];
  const regions = regionsData ?? [];

  const initialForm = useMemo<FormState>(() => {
    return {
      name: rule?.name ?? "",
      packageId: rule?.package?.id ?? "",
      regionId: rule?.region?.id ?? "",
      ruleType: rule?.ruleType ?? "peak",
      multiplier: rule?.multiplier != null ? String(rule.multiplier) : "",
      fixedAdjustment: rule?.fixedAdjustment != null ? String(rule.fixedAdjustment) : "",
      startDate: toDateInput(rule?.startDate),
      endDate: toDateInput(rule?.endDate),
      priority: rule?.priority != null ? String(rule.priority) : "0",
      isActive: rule?.isActive ?? true,
    };
  }, [rule]);

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
    if (!ruleId || !form.name || !form.ruleType || !form.startDate || !form.endDate) return;
    setIsSubmitting(true);
    try {
      await updatePricingRule(ruleId, {
        name: form.name.trim(),
        packageId: form.packageId || undefined,
        regionId: form.regionId || undefined,
        ruleType: form.ruleType,
        multiplier: form.multiplier ? Number(form.multiplier) : undefined,
        fixedAdjustment: form.fixedAdjustment ? Number(form.fixedAdjustment) : undefined,
        startDate: form.startDate,
        endDate: form.endDate,
        priority: form.priority ? Number(form.priority) : 0,
        isActive: form.isActive,
      });
      await queryClient.invalidateQueries({ queryKey: pricingKeys.rules() });
      await queryClient.invalidateQueries({ queryKey: pricingKeys.ruleDetail(ruleId) });
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
        aria-labelledby="pricing-rule-edit-title"
      >
        <div
          className="flex items-center justify-between h-14 px-4 border-b shrink-0"
          style={{ borderColor: colors.cardBorder }}
        >
          <h2 id="pricing-rule-edit-title" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
            Edit Pricing Rule
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
                Rule Details
              </h4>
              {isLoading ? (
                <div className="text-sm" style={{ color: colors.textSecondary }}>
                  Loading rule details...
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                      Rule name
                    </label>
                    <input
                      type="text"
                      placeholder="Rule name"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
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
                        Package
                      </label>
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
                        <option value="">All Packages</option>
                        {packages.map((pkg) => (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-[42px] w-4 h-4 pointer-events-none" style={{ color: colors.textSecondary }} />
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
                  <div className="relative">
                    <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                      Rule type
                    </label>
                    <select
                      value={form.ruleType}
                      onChange={(e) => updateField("ruleType", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border text-sm appearance-none cursor-pointer"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.cardBorder,
                        color: colors.textPrimary,
                      }}
                    >
                      {RULE_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-[42px] w-4 h-4 pointer-events-none" style={{ color: colors.textSecondary }} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                        Multiplier
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="1.2"
                        value={form.multiplier}
                        onChange={(e) => updateField("multiplier", e.target.value)}
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
                        Fixed adjustment
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="100"
                        value={form.fixedAdjustment}
                        onChange={(e) => updateField("fixedAdjustment", e.target.value)}
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
                        Start date
                      </label>
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
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                        End date
                      </label>
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
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                        Priority
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={form.priority}
                        onChange={(e) => updateField("priority", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-3 text-sm" style={{ color: colors.textSecondary }}>
                        <input
                          type="checkbox"
                          checked={form.isActive}
                          onChange={(e) => updateField("isActive", e.target.checked)}
                          className="w-4 h-4"
                        />
                        Active rule
                      </label>
                    </div>
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
              disabled={isSubmitting || !form.name || !form.ruleType || !form.startDate || !form.endDate}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PricingRuleEditDrawer;
