"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { X, ChevronDown, Plus, Trash2, Upload, Star } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import {
  addIncludedService,
  createAddon,
  deleteAddon,
  deletePackageMedia,
  removeIncludedService,
  updateAddon,
  updateIncludedService,
  updatePackageRegions,
  uploadPackageMedia,
  usePackageDetailQuery,
  useUpdatePackageMutation,
  packagesKeys,
} from "@/lib/api/packages";
import { useYachtsQuery } from "@/lib/api/yachts";
import { useRegionsQuery } from "@/lib/api/regions";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useQueryClient } from "@tanstack/react-query";

interface PackageEditDrawerProps {
  packageId: string | null;
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

const SERVICE_OPTIONS = [
  { label: "Skipper", value: "skipper" },
  { label: "Fuel", value: "fuel" },
  { label: "Catering", value: "catering" },
  { label: "Transfer", value: "transfer" },
  { label: "Crew", value: "crew" },
  { label: "Gear", value: "gear" },
];

export function PackageEditDrawer({ packageId, onClose }: PackageEditDrawerProps) {
  const { colors } = useTheme();
  const { data: pkg, isLoading, isError, error } = usePackageDetailQuery(packageId);
  const updatePackageMutation = useUpdatePackageMutation();
  const queryClient = useQueryClient();
  const { data: yachtsData } = useYachtsQuery(1, 100);
  const { data: regionsData } = useRegionsQuery();
  const yachts = yachtsData?.yachts ?? [];
  const regions = regionsData ?? [];

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

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceIncluded, setNewServiceIncluded] = useState(true);
  const [newServiceNotes, setNewServiceNotes] = useState("");
  const [newAddon, setNewAddon] = useState({
    name: "",
    description: "",
    price: "",
    priceType: "flat",
    isActive: true,
    sortOrder: "0",
  });

  useEffect(() => {
    if (!pkg) return;
    setForm({
      name: pkg.name ?? "",
      description: pkg.description ?? "",
      yachtId: pkg.yachtId ?? "",
      yachtCategory: pkg.yachtCategory ?? "",
      durationType: pkg.durationType ?? "full_day",
      durationHours: pkg.durationHours ? String(pkg.durationHours) : "",
      durationDays: pkg.durationDays ? String(pkg.durationDays) : "",
      basePrice: pkg.basePrice ? String(pkg.basePrice) : "",
      currencyCode: pkg.currencyCode ?? "USD",
      maxCapacity: pkg.maxCapacity ? String(pkg.maxCapacity) : "",
      status: pkg.status ?? "draft",
      isFeatured: !!pkg.isFeatured,
      sortOrder: pkg.sortOrder != null ? String(pkg.sortOrder) : "0",
    });
  }, [pkg]);

  const updateField = (key: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const refreshPackage = async () => {
    if (!packageId) return;
    await queryClient.invalidateQueries({ queryKey: packagesKeys.detail(packageId) });
    await queryClient.invalidateQueries({ queryKey: packagesKeys.lists() });
  };

  const handleSaveBasics = async () => {
    if (!pkg) return;
    await updatePackageMutation.mutateAsync({
      id: pkg.id,
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      yachtId: form.yachtId || null,
      yachtCategory: form.yachtCategory.trim() || null,
      durationType: form.durationType,
      durationHours: form.durationHours ? Number(form.durationHours) : null,
      durationDays: form.durationDays ? Number(form.durationDays) : null,
      basePrice: form.basePrice ? Number(form.basePrice) : undefined,
      currencyCode: form.currencyCode.trim(),
      maxCapacity: form.maxCapacity ? Number(form.maxCapacity) : null,
      status: form.status,
      isFeatured: form.isFeatured,
      sortOrder: form.sortOrder ? Number(form.sortOrder) : 0,
    });
    await refreshPackage();
  };

  const handleUpdateRegions = async (regionId: string, isVisible: boolean) => {
    if (!pkg) return;
    await updatePackageRegions(pkg.id, {
      regions: [
        {
          regionId,
          isVisible,
        },
      ],
    });
    await refreshPackage();
  };

  const handleAddService = async () => {
    if (!pkg || !newServiceName.trim()) return;
    await addIncludedService(pkg.id, {
      serviceName: newServiceName.trim(),
      isIncluded: newServiceIncluded,
      notes: newServiceNotes.trim() || undefined,
    });
    setNewServiceName("");
    setNewServiceNotes("");
    setNewServiceIncluded(true);
    await refreshPackage();
  };

  const handleAddAddon = async () => {
    if (!pkg || !newAddon.name.trim() || !newAddon.price) return;
    await createAddon(pkg.id, {
      name: newAddon.name.trim(),
      description: newAddon.description.trim() || undefined,
      price: Number(newAddon.price),
      priceType: newAddon.priceType,
      isActive: newAddon.isActive,
      sortOrder: Number(newAddon.sortOrder) || 0,
    });
    setNewAddon({
      name: "",
      description: "",
      price: "",
      priceType: "flat",
      isActive: true,
      sortOrder: "0",
    });
    await refreshPackage();
  };

  const handleUploadMedia = async () => {
    if (!pkg || mediaFiles.length === 0) return;
    await uploadPackageMedia(pkg.id, mediaFiles);
    setMediaFiles([]);
    await refreshPackage();
  };

  const handleUpdateService = async (serviceId: string, payload: Parameters<typeof updateIncludedService>[2]) => {
    if (!pkg) return;
    await updateIncludedService(pkg.id, serviceId, payload);
    await refreshPackage();
  };

  const handleRemoveService = async (serviceId: string) => {
    if (!pkg) return;
    await removeIncludedService(pkg.id, serviceId);
    await refreshPackage();
  };

  const handleUpdateAddon = async (addonId: string, payload: Parameters<typeof updateAddon>[2]) => {
    if (!pkg) return;
    await updateAddon(pkg.id, addonId, payload);
    await refreshPackage();
  };

  const handleDeleteAddon = async (addonId: string) => {
    if (!pkg) return;
    await deleteAddon(pkg.id, addonId);
    await refreshPackage();
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!pkg) return;
    await deletePackageMedia(pkg.id, mediaId);
    await refreshPackage();
  };

  const regionVisibilityIds = useMemo(() => {
    const map = new Map<string, boolean>();
    pkg?.regionVisibility?.forEach((r) => map.set(r.region.id, r.isVisible));
    return map;
  }, [pkg?.regionVisibility]);

  if (!packageId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="package-edit-title"
    >
      <div
        className="w-full max-w-6xl max-h-[90vh] rounded-2xl border overflow-y-auto"
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
            <h2 id="package-edit-title" className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
              Edit Package
            </h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Update package details and related data.
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
              <LoadingSpinner size="md" text="Loading package..." />
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
              {error instanceof Error ? error.message : "Failed to load package."}
            </div>
          )}

          {pkg && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.background, borderColor: colors.cardBorder }}>
                  <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                    Basic Details
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Package name"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border text-sm"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.cardBorder,
                        color: colors.textPrimary,
                      }}
                    />
                    <textarea
                      rows={3}
                      placeholder="Description"
                      value={form.description}
                      onChange={(e) => updateField("description", e.target.value)}
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
                        <option value="">No yacht</option>
                        {yachts.map((y) => (
                          <option key={y.id} value={y.id}>
                            {y.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: colors.textSecondary }} />
                    </div>
                    <input
                      type="text"
                      placeholder="Yacht category"
                      value={form.yachtCategory}
                      onChange={(e) => updateField("yachtCategory", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border text-sm"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.cardBorder,
                        color: colors.textPrimary,
                      }}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <select
                          value={form.durationType}
                          onChange={(e) => updateField("durationType", e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg border text-sm appearance-none cursor-pointer"
                          style={{
                            backgroundColor: colors.background,
                            borderColor: colors.cardBorder,
                            color: colors.textPrimary,
                          }}
                        >
                          {DURATION_OPTIONS.map((d) => (
                            <option key={d.value} value={d.value}>
                              {d.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: colors.textSecondary }} />
                      </div>
                      <input
                        type="number"
                        placeholder="Hours"
                        value={form.durationHours}
                        onChange={(e) => updateField("durationHours", e.target.value)}
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
                        placeholder="Days"
                        value={form.durationDays}
                        onChange={(e) => updateField("durationDays", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Max capacity"
                        value={form.maxCapacity}
                        onChange={(e) => updateField("maxCapacity", e.target.value)}
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
                        placeholder="Base price"
                        value={form.basePrice}
                        onChange={(e) => updateField("basePrice", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Currency"
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
                    <div className="grid grid-cols-2 gap-3">
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
                      <input
                        type="number"
                        placeholder="Sort order"
                        value={form.sortOrder}
                        onChange={(e) => updateField("sortOrder", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm"
                      style={{
                        backgroundColor: form.isFeatured ? `${colors.accent}15` : colors.background,
                        borderColor: form.isFeatured ? colors.accent : colors.cardBorder,
                        color: form.isFeatured ? colors.accent : colors.textPrimary,
                      }}
                      onClick={() => updateField("isFeatured", !form.isFeatured)}
                    >
                      <Star className="w-4 h-4" />
                      Featured
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveBasics}
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                      style={{ background: `linear-gradient(to right, ${colors.accent}, #00B39F)` }}
                    >
                      Save Basic Details
                    </button>
                  </div>
                </div>

                <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.background, borderColor: colors.cardBorder }}>
                  <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                    Region Visibility
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {regions.map((region) => {
                      const isVisible = regionVisibilityIds.get(region.id) ?? false;
                      return (
                        <button
                          key={region.id}
                          type="button"
                          onClick={() => handleUpdateRegions(region.id, !isVisible)}
                          className="px-3 py-2 rounded-lg border text-sm transition-all text-left"
                          style={{
                            backgroundColor: isVisible ? `${colors.accent}15` : colors.background,
                            borderColor: isVisible ? colors.accent : colors.cardBorder,
                            color: isVisible ? colors.accent : colors.textPrimary,
                          }}
                        >
                          {region.name} {isVisible ? "• Visible" : "• Hidden"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.background, borderColor: colors.cardBorder }}>
                  <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                    Included Services
                  </h3>
                  <div className="space-y-3">
                    {(pkg.includedServices ?? []).map((service) => (
                      <div
                        key={service.id}
                        className="flex flex-col gap-2 p-3 rounded-lg border"
                        style={{ borderColor: colors.cardBorder, backgroundColor: colors.cardBg }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <select
                              defaultValue={service.serviceName}
                              onChange={(e) => handleUpdateService(service.id, { serviceName: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border text-sm appearance-none cursor-pointer"
                              style={{
                                backgroundColor: colors.background,
                                borderColor: colors.cardBorder,
                                color: colors.textPrimary,
                              }}
                            >
                              {SERVICE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                              style={{ color: colors.textSecondary }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUpdateService(service.id, { isIncluded: !service.isIncluded })}
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              backgroundColor: service.isIncluded ? `${colors.accent}15` : `${colors.textSecondary}15`,
                              color: service.isIncluded ? colors.accent : colors.textSecondary,
                            }}
                          >
                            {service.isIncluded ? "Included" : "Excluded"}
                          </button>
                          <button type="button" onClick={() => handleRemoveService(service.id)}>
                            <Trash2 className="w-4 h-4" style={{ color: colors.danger }} />
                          </button>
                        </div>
                        <input
                          type="text"
                          defaultValue={service.notes ?? ""}
                          onBlur={(e) => handleUpdateService(service.id, { notes: e.target.value })}
                          placeholder="Notes"
                          className="bg-transparent text-xs outline-none"
                          style={{ color: colors.textSecondary }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="relative">
                      <select
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border text-sm appearance-none cursor-pointer"
                        style={{ backgroundColor: colors.background, borderColor: colors.cardBorder, color: colors.textPrimary }}
                      >
                        <option value="">Select service</option>
                        {SERVICE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                        style={{ color: colors.textSecondary }}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Notes"
                      value={newServiceNotes}
                      onChange={(e) => setNewServiceNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{ backgroundColor: colors.background, borderColor: colors.cardBorder, color: colors.textPrimary }}
                    />
                    <div className="flex items-center justify-between">
                      <label className="text-sm" style={{ color: colors.textSecondary }}>
                        Included
                      </label>
                      <input
                        type="checkbox"
                        checked={newServiceIncluded}
                        onChange={(e) => setNewServiceIncluded(e.target.checked)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddService}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                      style={{ backgroundColor: `${colors.accent}15`, color: colors.accent }}
                    >
                      <Plus className="w-4 h-4" />
                      Add Service
                    </button>
                  </div>
                </div>

                <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.background, borderColor: colors.cardBorder }}>
                  <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                    Add-ons
                  </h3>
                  <div className="space-y-3">
                    {(pkg.addons ?? []).map((addon) => (
                      <div key={addon.id} className="p-3 rounded-lg border" style={{ borderColor: colors.cardBorder, backgroundColor: colors.cardBg }}>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            defaultValue={addon.name}
                            onBlur={(e) => handleUpdateAddon(addon.id, { name: e.target.value })}
                            className="bg-transparent text-sm outline-none"
                            style={{ color: colors.textPrimary }}
                          />
                          <input
                            type="number"
                            defaultValue={addon.price}
                            onBlur={(e) => handleUpdateAddon(addon.id, { price: Number(e.target.value) })}
                            className="bg-transparent text-sm outline-none text-right"
                            style={{ color: colors.textPrimary }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2 items-center">
                          <input
                            type="text"
                            defaultValue={addon.priceType}
                            onBlur={(e) => handleUpdateAddon(addon.id, { priceType: e.target.value })}
                            className="bg-transparent text-xs outline-none"
                            style={{ color: colors.textSecondary }}
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateAddon(addon.id, { isActive: !addon.isActive })}
                              className="px-2 py-1 rounded text-xs"
                              style={{
                                backgroundColor: addon.isActive ? `${colors.accent}15` : `${colors.textSecondary}15`,
                                color: addon.isActive ? colors.accent : colors.textSecondary,
                              }}
                            >
                              {addon.isActive ? "Active" : "Inactive"}
                            </button>
                            <button type="button" onClick={() => handleDeleteAddon(addon.id)}>
                              <Trash2 className="w-4 h-4" style={{ color: colors.danger }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2">
                    <input
                      type="text"
                      placeholder="Addon name"
                      value={newAddon.name}
                      onChange={(e) => setNewAddon((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{ backgroundColor: colors.background, borderColor: colors.cardBorder, color: colors.textPrimary }}
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={newAddon.description}
                      onChange={(e) => setNewAddon((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{ backgroundColor: colors.background, borderColor: colors.cardBorder, color: colors.textPrimary }}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Price"
                        value={newAddon.price}
                        onChange={(e) => setNewAddon((prev) => ({ ...prev, price: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border text-sm"
                        style={{ backgroundColor: colors.background, borderColor: colors.cardBorder, color: colors.textPrimary }}
                      />
                      <input
                        type="text"
                        placeholder="Price type"
                        value={newAddon.priceType}
                        onChange={(e) => setNewAddon((prev) => ({ ...prev, priceType: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border text-sm"
                        style={{ backgroundColor: colors.background, borderColor: colors.cardBorder, color: colors.textPrimary }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddAddon}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                      style={{ backgroundColor: `${colors.accent}15`, color: colors.accent }}
                    >
                      <Plus className="w-4 h-4" />
                      Add Add-on
                    </button>
                  </div>
                </div>

                <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.background, borderColor: colors.cardBorder }}>
                  <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                    Media
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setMediaFiles(Array.from(e.target.files ?? []))}
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{ backgroundColor: colors.background, borderColor: colors.cardBorder, color: colors.textPrimary }}
                    />
                    <button
                      type="button"
                      onClick={handleUploadMedia}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                      style={{ backgroundColor: `${colors.accent}15`, color: colors.accent }}
                    >
                      <Upload className="w-4 h-4" />
                      Upload Media
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {(pkg.media ?? []).map((media) => (
                      <div key={media.id} className="relative rounded-lg border overflow-hidden" style={{ borderColor: colors.cardBorder }}>
                        <Image src={media.url} alt={media.caption ?? "media"} width={300} height={200} className="w-full h-28 object-cover" />
                        <button
                          type="button"
                          onClick={() => handleDeleteMedia(media.id)}
                          className="absolute top-2 right-2 p-1 rounded-full"
                          style={{ backgroundColor: colors.cardBg }}
                        >
                          <Trash2 className="w-4 h-4" style={{ color: colors.danger }} />
                        </button>
                      </div>
                    ))}
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

export default PackageEditDrawer;
