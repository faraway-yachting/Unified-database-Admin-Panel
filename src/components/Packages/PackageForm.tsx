"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Upload, X, Star } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useYachtsQuery } from "@/lib/api/yachts";
import { useCreatePackageMutation } from "@/lib/api/packages";

interface PackageFormProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormState = {
  name: string;
  description: string;
  yachtId: string;
  yachtCategory: string;
  durationType: string;
  durationHours: string;
  durationDays: string;
  basePrice: string;
  currencyCode: string;
  maxCapacity: string;
  status: string;
  isFeatured: boolean;
  sortOrder: string;
};

const DURATION_OPTIONS = [
  { label: "Half-day", value: "half_day" },
  { label: "Full-day", value: "full_day" },
  { label: "Weekly", value: "weekly" },
  { label: "Custom", value: "custom" },
];

const STATUS_OPTIONS = [
  { label: "Draft", value: "draft" },
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
];

export function PackageForm({ isOpen, onClose }: PackageFormProps) {
  const { colors } = useTheme();
  const createPackageMutation = useCreatePackageMutation();
  const { data: yachtsData } = useYachtsQuery(1, 100);
  const yachts = yachtsData?.yachts ?? [];

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    yachtId: "",
    yachtCategory: "",
    durationType: "full_day",
    durationHours: "",
    durationDays: "",
    basePrice: "",
    currencyCode: "USD",
    maxCapacity: "",
    status: "draft",
    isFeatured: false,
    sortOrder: "0",
  });

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

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;
    setMediaFiles(Array.from(files));
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      yachtId: "",
      yachtCategory: "",
      durationType: "full_day",
      durationHours: "",
      durationDays: "",
      basePrice: "",
      currencyCode: "USD",
      maxCapacity: "",
      status: "draft",
      isFeatured: false,
      sortOrder: "0",
    });
    setMediaFiles([]);
  };

  const handleSubmit = async (status: string) => {
    if (!form.name || !form.durationType || !form.basePrice || !form.currencyCode) {
      return;
    }
    await createPackageMutation.mutateAsync({
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      yachtId: form.yachtId || undefined,
      yachtCategory: form.yachtCategory.trim() || undefined,
      durationType: form.durationType,
      durationHours: form.durationHours ? Number(form.durationHours) : undefined,
      durationDays: form.durationDays ? Number(form.durationDays) : undefined,
      basePrice: Number(form.basePrice),
      currencyCode: form.currencyCode.trim(),
      maxCapacity: form.maxCapacity ? Number(form.maxCapacity) : undefined,
      status,
      isFeatured: form.isFeatured,
      sortOrder: form.sortOrder ? Number(form.sortOrder) : undefined,
      media: mediaFiles,
    });
    resetForm();
    onClose();
  };

  const isSubmitting = createPackageMutation.isPending;
  const durationLabel = useMemo(
    () => DURATION_OPTIONS.find((d) => d.value === form.durationType)?.label ?? "Custom",
    [form.durationType]
  );

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
        aria-labelledby="package-form-title"
      >
        <div
          className="flex items-center justify-between h-14 px-4 border-b shrink-0"
          style={{ borderColor: colors.cardBorder }}
        >
          <h2 id="package-form-title" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
            Create New Package
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
                  Basic Information
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                      Package Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="e.g., Sunset Deluxe Experience"
                      className="w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2"
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
                    <textarea
                      placeholder="Describe the package..."
                      value={form.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg border text-sm transition-all resize-none focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.cardBorder,
                        color: colors.textPrimary,
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                      Linked Yacht
                    </label>
                    <div className="relative">
                      <select
                        value={form.yachtId}
                        onChange={(e) => updateField("yachtId", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm appearance-none cursor-pointer focus:outline-none"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      >
                        <option value="">No yacht (use category)</option>
                        {yachts.map((yacht) => (
                          <option key={yacht.id} value={yacht.id}>
                            {yacht.name} ({yacht.type})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: colors.textSecondary }} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                      Yacht Category (optional)
                    </label>
                    <input
                      type="text"
                      value={form.yachtCategory}
                      onChange={(e) => updateField("yachtCategory", e.target.value)}
                      placeholder="e.g., Luxury"
                      className="w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.cardBorder,
                        color: colors.textPrimary,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: colors.textPrimary }}>
                  Duration & Capacity
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                      Duration Type *
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {DURATION_OPTIONS.map((duration) => (
                        <button
                          key={duration.value}
                          type="button"
                          onClick={() => updateField("durationType", duration.value)}
                          className="flex-1 min-w-[90px] px-4 py-2.5 rounded-lg border text-sm font-medium transition-all"
                          style={{
                            backgroundColor: form.durationType === duration.value ? `${colors.accent}15` : colors.cardBg,
                            borderColor: form.durationType === duration.value ? colors.accent : colors.cardBorder,
                            color: form.durationType === duration.value ? colors.accent : colors.textPrimary,
                          }}
                        >
                          {duration.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs mt-2" style={{ color: colors.textSecondary }}>
                      Selected: {durationLabel}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                        Duration Hours
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={form.durationHours}
                        onChange={(e) => updateField("durationHours", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                        Duration Days
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={form.durationDays}
                        onChange={(e) => updateField("durationDays", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                      Max Capacity
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.maxCapacity}
                      onChange={(e) => updateField("maxCapacity", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none"
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
                  <div className="grid grid-cols-[1fr_120px] gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                        Base Price *
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={form.basePrice}
                        onChange={(e) => updateField("basePrice", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                        Currency *
                      </label>
                      <input
                        type="text"
                        value={form.currencyCode}
                        onChange={(e) => updateField("currencyCode", e.target.value.toUpperCase())}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm uppercase focus:outline-none"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                      Status
                    </label>
                    <div className="relative">
                      <select
                        value={form.status}
                        onChange={(e) => updateField("status", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm appearance-none cursor-pointer focus:outline-none"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: colors.textSecondary }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: colors.cardBorder }}>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" style={{ color: colors.accent }} />
                      <div>
                        <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                          Featured Package
                        </div>
                        <div className="text-xs" style={{ color: colors.textSecondary }}>
                          Highlight this package in listings
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="relative w-12 h-6 rounded-full transition-all"
                      style={{ backgroundColor: form.isFeatured ? colors.accent : `${colors.textSecondary}30` }}
                      onClick={() => updateField("isFeatured", !form.isFeatured)}
                      aria-pressed={form.isFeatured}
                    >
                      <div
                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg transition-all"
                        style={{
                          left: form.isFeatured ? "calc(100% - 20px)" : "4px",
                        }}
                      />
                    </button>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                      Sort Order
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.sortOrder}
                      onChange={(e) => updateField("sortOrder", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.cardBorder,
                        color: colors.textPrimary,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: colors.textPrimary }}>
                  Package Media
                </h4>
                <div className="space-y-3">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,application/pdf"
                    onChange={(e) => handleFileChange(e.target.files)}
                    className="w-full px-4 py-2.5 rounded-lg border text-sm"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.cardBorder,
                      color: colors.textPrimary,
                    }}
                  />
                  {mediaFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-xs" style={{ color: colors.textSecondary }}>
                      {mediaFiles.map((file) => (
                        <span key={file.name}>{file.name}</span>
                      ))}
                    </div>
                  )}
                  <div className="text-xs" style={{ color: colors.textSecondary }}>
                    Upload images, videos, or PDFs (up to 10 files).
                  </div>
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
              onClick={() => handleSubmit("draft")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save as Draft"}
            </button>
            <button
              type="button"
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
              style={{
                background: `linear-gradient(to right, ${colors.accent}, #00B39F)`,
                boxShadow: `0 10px 25px -5px ${colors.accent}30`,
              }}
              onClick={() => handleSubmit("active")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publishing..." : "Publish Package"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PackageForm;
