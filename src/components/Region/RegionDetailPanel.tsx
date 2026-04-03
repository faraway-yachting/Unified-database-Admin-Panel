"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  ExternalLink,
  GripVertical,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Upload,
  Loader2,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "react-toastify";
import type { Region } from "./RegionsList";
import {
  useRegionYachtsQuery,
  useRegionPackagesQuery,
  useRegionDetailQuery,
  useRemoveYachtMutation,
  useRemovePackageMutation,
  useUpdateRegionMutation,
} from "@/lib/api/regions";
import { useRegionBlogsQuery } from "@/lib/api/blog";

interface RegionDetailPanelProps {
  region: Region;
  onClose: () => void;
}

export function RegionDetailPanel({ region, onClose }: RegionDetailPanelProps) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<"fleet" | "blog" | "packages" | "settings">("fleet");

  const { data: yachts = [], isLoading: yachtsLoading } = useRegionYachtsQuery(region.id);
  const { data: blogs = [], isLoading: blogsLoading } = useRegionBlogsQuery(region.id);
  const { data: packages = [], isLoading: packagesLoading } = useRegionPackagesQuery(region.id);

  const removeYacht = useRemoveYachtMutation(region.id);
  const removePackage = useRemovePackageMutation(region.id);
  const updateRegion = useUpdateRegionMutation(region.id);
  const { data: regionDetail } = useRegionDetailQuery(region.id);

  // Settings form state
  const [settingsContactEmail, setSettingsContactEmail] = useState("");
  const [settingsPhone, setSettingsPhone] = useState("");
  const [settingsCurrency, setSettingsCurrency] = useState("USD");
  const [settingsLanguage, setSettingsLanguage] = useState("en");
  const [settingsMetaTitle, setSettingsMetaTitle] = useState(`Yacht Charter ${region.city}`);
  const [settingsMetaDesc, setSettingsMetaDesc] = useState("Luxury yacht charter experiences in the region's most beautiful waters.");
  const [heroBannerFile, setHeroBannerFile] = useState<File | null>(null);
  const [heroBannerPreview, setHeroBannerPreview] = useState<string | null>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Pre-populate settings form from backend data
  useEffect(() => {
    if (!regionDetail) return;
    setSettingsContactEmail(regionDetail.contactEmail ?? "");
    setSettingsPhone(regionDetail.contactPhone ?? "");
    setSettingsCurrency(regionDetail.currencyCode ?? "USD");
    setSettingsLanguage(regionDetail.languageCode ?? "en");
    setSettingsMetaTitle(regionDetail.metaTitle ?? `Yacht Charter ${region.city}`);
    setSettingsMetaDesc(regionDetail.metaDescription ?? "Luxury yacht charter experiences in the region's most beautiful waters.");
    setHeroBannerPreview(regionDetail.heroBannerUrl ?? null);
  }, [regionDetail, region.city]);

  const handleBannerChange = (file: File | null) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be 2MB or smaller");
      return;
    }
    setHeroBannerFile(file);
    setHeroBannerPreview(URL.createObjectURL(file));
  };

  const handleSaveSettings = async () => {
    try {
      await updateRegion.mutateAsync({
        contactEmail: settingsContactEmail || undefined,
        contactPhone: settingsPhone || undefined,
        currencyCode: settingsCurrency,
        languageCode: settingsLanguage,
        metaTitle: settingsMetaTitle || undefined,
        metaDescription: settingsMetaDesc || undefined,
        heroBannerImage: heroBannerFile ?? undefined,
      });
      toast.success("Settings saved successfully");
    } catch (err) {
      const e = err as { message?: string };
      toast.error(e?.message || "Failed to save settings");
    }
  };

  const tabs = [
    { id: "fleet" as const, label: "Fleet" },
    { id: "blog" as const, label: "Blog" },
    { id: "packages" as const, label: "Packages" },
    { id: "settings" as const, label: "Site Settings" },
  ];

  const getAvailabilityColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "available":
        return colors.accent;
      case "booked":
        return colors.accentGold;
      case "maintenance":
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <div
      className="rounded-lg border overflow-hidden flex flex-col flex-1 min-h-0 h-full"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder,
      }}
    >
      <div
        className="p-4 md:p-6 border-b shrink-0"
        style={{ borderColor: colors.cardBorder }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl md:text-4xl">{region.flag}</span>
            <div>
              <h3
                className="text-xl md:text-2xl font-bold"
                style={{ color: colors.textPrimary }}
              >
                {region.city}, {region.country}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm" style={{ color: colors.textSecondary }}>
                  {region.siteUrl}
                </span>
                <div
                  className="px-2 py-0.5 rounded text-xs font-semibold"
                  style={{
                    backgroundColor:
                      region.status === "live"
                        ? `${colors.accent}20`
                        : `${colors.textSecondary}20`,
                    color:
                      region.status === "live" ? colors.accent : colors.textSecondary,
                  }}
                >
                  {region.status.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={region.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border transition-all hover:scale-105 text-sm"
              style={{
                borderColor: colors.cardBorder,
                color: colors.textPrimary,
                backgroundColor: colors.background,
              }}
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Visit Site</span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg transition-all hover:scale-110"
              style={{
                color: colors.textSecondary,
                backgroundColor: colors.background,
              }}
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
              style={{
                backgroundColor: activeTab === tab.id ? colors.accent : "transparent",
                color: activeTab === tab.id ? "#FFFFFF" : colors.textSecondary,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 md:p-6">
        {activeTab === "blog" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                Assigned Blogs
              </h4>
              <Link
                href="/blog/add"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
                style={{ background: `linear-gradient(to right, ${colors.accent}, #00B39F)` }}
              >
                <Plus className="w-4 h-4" />
                Add Blog
              </Link>
            </div>

            {blogsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: colors.accent }} />
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-12" style={{ color: colors.textSecondary }}>
                No blogs assigned to this region yet.
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead>
                      <tr className="border-b text-left" style={{ borderColor: colors.cardBorder }}>
                        <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary, width: "60px" }}>
                          Image
                        </th>
                        <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>
                          Title
                        </th>
                        <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>
                          Slug
                        </th>
                        <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>
                          Status
                        </th>
                        <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }} />
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.map((blog) => (
                        <tr key={blog.id} className="border-b" style={{ borderColor: colors.cardBorder }}>
                          <td className="py-3">
                            {blog.primaryImage ? (
                              <div className="relative w-12 h-9 rounded overflow-hidden">
                                <Image src={blog.primaryImage} alt={blog.title ?? ""} fill className="object-cover" sizes="48px" />
                              </div>
                            ) : (
                              <div className="w-12 h-9 rounded flex items-center justify-center text-xs" style={{ backgroundColor: colors.hoverBg, color: colors.textSecondary }}>
                                —
                              </div>
                            )}
                          </td>
                          <td className="py-3 text-sm font-medium" style={{ color: colors.textPrimary }}>
                            {blog.title ?? "—"}
                          </td>
                          <td className="py-3 text-sm font-mono" style={{ color: colors.textSecondary }}>
                            {blog.slug}
                          </td>
                          <td className="py-3">
                            <span
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{
                                backgroundColor: blog.status === "published" ? `${colors.accent}20` : `${colors.textSecondary}20`,
                                color: blog.status === "published" ? colors.accent : colors.textSecondary,
                              }}
                            >
                              {blog.status === "published" ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="py-3">
                            <Link
                              href={`/blog/${blog.id}`}
                              className="p-2 rounded hover:opacity-70 transition-opacity inline-flex"
                              style={{ color: colors.textSecondary }}
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden space-y-3">
                  {blogs.map((blog) => (
                    <div
                      key={blog.id}
                      className="p-4 rounded-lg border flex items-center gap-3"
                      style={{ backgroundColor: colors.background, borderColor: colors.cardBorder }}
                    >
                      {blog.primaryImage ? (
                        <div className="relative w-14 h-12 rounded overflow-hidden shrink-0">
                          <Image src={blog.primaryImage} alt={blog.title ?? ""} fill className="object-cover" sizes="56px" />
                        </div>
                      ) : (
                        <div className="w-14 h-12 rounded shrink-0 flex items-center justify-center text-xs" style={{ backgroundColor: colors.hoverBg, color: colors.textSecondary }}>
                          —
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate" style={{ color: colors.textPrimary }}>
                          {blog.title ?? "—"}
                        </div>
                        <div className="text-xs font-mono truncate" style={{ color: colors.textSecondary }}>
                          {blog.slug}
                        </div>
                      </div>
                      <span
                        className="px-2 py-1 rounded text-xs font-medium shrink-0"
                        style={{
                          backgroundColor: blog.status === "published" ? `${colors.accent}20` : `${colors.textSecondary}20`,
                          color: blog.status === "published" ? colors.accent : colors.textSecondary,
                        }}
                      >
                        {blog.status === "published" ? "Published" : "Draft"}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "packages" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                Assigned Packages
              </h4>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
                style={{
                  background: `linear-gradient(to right, ${colors.accent}, #00B39F)`,
                }}
              >
                <Plus className="w-4 h-4" />
                Assign Package
              </button>
            </div>

            {packagesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: colors.accent }} />
              </div>
            ) : packages.length === 0 ? (
              <div className="text-center py-12" style={{ color: colors.textSecondary }}>
                No packages assigned to this region yet.
              </div>
            ) : (
              <>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead>
                      <tr
                        className="border-b text-left"
                        style={{ borderColor: colors.cardBorder }}
                      >
                        <th
                          className="pb-3 text-xs font-semibold"
                          style={{ color: colors.textSecondary, width: "40px" }}
                        />
                        <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>
                          Package Name
                        </th>
                        <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>
                          Duration
                        </th>
                        <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>
                          Price
                        </th>
                        <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>
                          Visibility
                        </th>
                        <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }} />
                      </tr>
                    </thead>
                    <tbody>
                      {packages.map((pkg) => {
                        const isVisible = pkg.visible ?? pkg.status === "active";
                        const displayPrice = pkg.price ?? pkg.basePrice ?? 0;
                        const displayName = pkg.name ?? pkg.title ?? "—";
                        return (
                          <tr
                            key={pkg.id}
                            className="border-b"
                            style={{ borderColor: colors.cardBorder }}
                          >
                            <td className="py-3">
                              <GripVertical
                                className="w-4 h-4 cursor-move"
                                style={{ color: colors.textSecondary }}
                              />
                            </td>
                            <td className="py-3 text-sm font-medium" style={{ color: colors.textPrimary }}>
                              {displayName}
                            </td>
                            <td className="py-3 text-sm" style={{ color: colors.textSecondary }}>
                              {pkg.duration ?? "—"}
                            </td>
                            <td className="py-3 text-sm font-mono font-semibold" style={{ color: colors.textPrimary }}>
                              {displayPrice ? `$${displayPrice.toLocaleString()}` : "—"}
                            </td>
                            <td className="py-3">
                              <span
                                className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium w-fit"
                                style={{
                                  backgroundColor: isVisible
                                    ? `${colors.accent}20`
                                    : `${colors.textSecondary}20`,
                                  color: isVisible ? colors.accent : colors.textSecondary,
                                }}
                              >
                                {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                {isVisible ? "Visible" : "Hidden"}
                              </span>
                            </td>
                            <td className="py-3">
                              <button
                                type="button"
                                onClick={() => removePackage.mutate(pkg.id)}
                                disabled={removePackage.isPending}
                                className="p-2 rounded hover:bg-opacity-10 transition-all"
                                style={{ color: colors.textSecondary }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden space-y-3">
                  {packages.map((pkg) => {
                    const isVisible = pkg.visible ?? pkg.status === "active";
                    const displayPrice = pkg.price ?? pkg.basePrice ?? 0;
                    const displayName = pkg.name ?? pkg.title ?? "—";
                    return (
                      <div
                        key={pkg.id}
                        className="p-4 rounded-lg border"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                              {displayName}
                            </div>
                            <div className="text-xs" style={{ color: colors.textSecondary }}>
                              {pkg.duration ?? "—"}
                            </div>
                          </div>
                          <GripVertical
                            className="w-4 h-4 cursor-move flex-shrink-0"
                            style={{ color: colors.textSecondary }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-mono font-bold" style={{ color: colors.textPrimary }}>
                            {displayPrice ? `$${displayPrice.toLocaleString()}` : "—"}
                          </span>
                          <div className="flex items-center gap-2">
                            <span
                              className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium"
                              style={{
                                backgroundColor: isVisible
                                  ? `${colors.accent}20`
                                  : `${colors.textSecondary}20`,
                                color: isVisible ? colors.accent : colors.textSecondary,
                              }}
                            >
                              {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            </span>
                            <button
                              type="button"
                              onClick={() => removePackage.mutate(pkg.id)}
                              disabled={removePackage.isPending}
                              className="p-2 rounded"
                              style={{
                                color: colors.textSecondary,
                                backgroundColor: `${colors.textSecondary}10`,
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "fleet" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                Assigned Yachts
              </h4>
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
                style={{
                  background: `linear-gradient(to right, ${colors.accent}, #00B39F)`,
                }}
              >
                <Plus className="w-4 h-4" />
                Assign Yacht
              </button>
            </div>

            {yachtsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: colors.accent }} />
              </div>
            ) : yachts.length === 0 ? (
              <div className="text-center py-12" style={{ color: colors.textSecondary }}>
                No yachts assigned to this region yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {yachts.map((yacht) => {
                  const coverImg = yacht.images?.find((img) => img.isPrimary || img.isCover) ?? yacht.images?.[0];
                  const primaryImageUrl = yacht.primaryImage ?? coverImg?.imageUrl ?? coverImg?.url;
                  const status = yacht.status ?? "available";
                  return (
                    <div
                      key={yacht.id}
                      className="rounded-lg border overflow-hidden"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.cardBorder,
                      }}
                    >
                      <div className="relative h-32 overflow-hidden bg-gray-200">
                        {primaryImageUrl ? (
                          <Image
                            src={primaryImageUrl}
                            alt={yacht.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-xs"
                            style={{ color: colors.textSecondary }}
                          >
                            No image
                          </div>
                        )}
                        <div
                          className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm"
                          style={{
                            backgroundColor: `${getAvailabilityColor(status)}90`,
                            color: "#FFFFFF",
                          }}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                          {yacht.name}
                        </div>
                        <div className="text-xs mb-3" style={{ color: colors.textSecondary }}>
                          {yacht.boatType ?? "—"}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeYacht.mutate(yacht.id)}
                          disabled={removeYacht.isPending}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
                          style={{
                            backgroundColor: `${colors.textSecondary}10`,
                            color: colors.textSecondary,
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <h4 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
              Site Configuration
            </h4>
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: colors.textPrimary }}>
                  Site Title
                </label>
                <input
                  type="text"
                  value={settingsMetaTitle}
                  onChange={(e) => setSettingsMetaTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                  style={{ backgroundColor: colors.background, borderColor: colors.cardBorder, color: colors.textPrimary }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: colors.textPrimary }}>
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={settingsMetaDesc}
                  onChange={(e) => setSettingsMetaDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 resize-none"
                  style={{ backgroundColor: colors.background, borderColor: colors.cardBorder, color: colors.textPrimary }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: colors.textPrimary }}>
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={settingsContactEmail}
                    onChange={(e) => setSettingsContactEmail(e.target.value)}
                    placeholder={`info@yachtcharter-${region.city.toLowerCase()}.com`}
                    className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                    style={{ backgroundColor: colors.background, borderColor: colors.cardBorder, color: colors.textPrimary }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: colors.textPrimary }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={settingsPhone}
                    onChange={(e) => setSettingsPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                    style={{ backgroundColor: colors.background, borderColor: colors.cardBorder, color: colors.textPrimary }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: colors.textPrimary }}>
                    Currency
                  </label>
                  <select
                    value={settingsCurrency}
                    onChange={(e) => setSettingsCurrency(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                    style={{ backgroundColor: colors.background, borderColor: colors.cardBorder, color: colors.textPrimary }}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AED">AED (د.إ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: colors.textPrimary }}>
                    Language
                  </label>
                  <select
                    value={settingsLanguage}
                    onChange={(e) => setSettingsLanguage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2"
                    style={{ backgroundColor: colors.background, borderColor: colors.cardBorder, color: colors.textPrimary }}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: colors.textPrimary }}>
                  Hero Banner Image
                </label>
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => handleBannerChange(e.target.files?.[0] ?? null)}
                />
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all hover:scale-[1.02] overflow-hidden"
                  style={{ borderColor: colors.cardBorder }}
                  onClick={() => bannerInputRef.current?.click()}
                  onDrop={(e) => { e.preventDefault(); handleBannerChange(e.dataTransfer.files?.[0] ?? null); }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {heroBannerPreview ? (
                    <div className="relative w-full h-40">
                      <Image src={heroBannerPreview} alt="Hero banner preview" fill className="object-cover rounded-lg" />
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: colors.textSecondary }} />
                      <div className="text-sm" style={{ color: colors.textPrimary }}>
                        Click to upload or drag and drop
                      </div>
                      <div className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                        PNG, JPG or WebP (max. 2MB)
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={updateRegion.isPending}
                  className="px-6 py-3 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: `linear-gradient(to right, ${colors.accent}, #00B39F)` }}
                >
                  {updateRegion.isPending ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegionDetailPanel;
