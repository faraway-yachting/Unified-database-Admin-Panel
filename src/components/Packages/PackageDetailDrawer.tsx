"use client";

import { useMemo } from "react";
import Image from "next/image";
import { X, FileText, ImageIcon, Film, Star } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { usePackageDetailQuery } from "@/lib/api/packages";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface PackageDetailDrawerProps {
  packageId: string | null;
  onClose: () => void;
}

export function PackageDetailDrawer({ packageId, onClose }: PackageDetailDrawerProps) {
  const { colors } = useTheme();
  const { data, isLoading, isError, error } = usePackageDetailQuery(packageId);

  const pkg = data;

  const durationLabel = useMemo(() => {
    if (!pkg) return "—";
    if (pkg.durationHours) {
      const hours = parseFloat(String(pkg.durationHours));
      if (Number.isFinite(hours)) return `${hours} hours`;
    }
    if (pkg.durationDays) return `${pkg.durationDays} days`;
    const t = pkg.durationType?.toLowerCase();
    if (t === "half_day") return "Half-day";
    if (t === "full_day") return "Full-day";
    if (t === "weekly") return "Weekly";
    return "Custom";
  }, [pkg]);

  if (!packageId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="package-detail-title"
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
            <h2
              id="package-detail-title"
              className="text-2xl font-bold mb-1"
              style={{ color: colors.textPrimary }}
            >
              {pkg?.name ?? "Package Details"}
            </h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {pkg?.status?.toUpperCase() ?? "—"} • {durationLabel}
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
              <LoadingSpinner size="md" text="Loading package details..." />
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
              {error instanceof Error ? error.message : "Failed to load package details."}
            </div>
          )}

          {pkg && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div
                  className="rounded-xl p-6 border"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                  }}
                >
                  <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                    Overview
                  </h3>
                  <div className="space-y-3 text-sm" style={{ color: colors.textSecondary }}>
                    <div>
                      <span style={{ color: colors.textPrimary }}>Description: </span>
                      {pkg.description || "—"}
                    </div>
                    <div>
                      <span style={{ color: colors.textPrimary }}>Yacht: </span>
                      {pkg.yacht?.name ?? "—"}
                    </div>
                    <div>
                      <span style={{ color: colors.textPrimary }}>Yacht Category: </span>
                      {pkg.yachtCategory || "—"}
                    </div>
                    <div>
                      <span style={{ color: colors.textPrimary }}>Duration: </span>
                      {durationLabel}
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-xl p-6 border"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                  }}
                >
                  <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                    Pricing & Capacity
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                        Base Price
                      </div>
                      <div className="text-sm font-mono font-bold" style={{ color: colors.textPrimary }}>
                        {pkg.currency?.symbol ?? pkg.currencyCode} {pkg.basePrice}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                        Max Capacity
                      </div>
                      <div className="text-sm font-mono font-bold" style={{ color: colors.textPrimary }}>
                        {pkg.maxCapacity ?? "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                        Status
                      </div>
                      <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                        {pkg.status}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                        Featured
                      </div>
                      <div className="flex items-center gap-1 text-sm" style={{ color: colors.textPrimary }}>
                        <Star className="w-4 h-4" style={{ color: colors.accent }} />
                        {pkg.isFeatured ? "Yes" : "No"}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-xl p-6 border"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                  }}
                >
                  <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                    Regions
                  </h3>
                  <div className="space-y-2 text-sm" style={{ color: colors.textSecondary }}>
                    {pkg.regionVisibility?.length ? (
                      pkg.regionVisibility.map((r) => (
                        <div key={r.id}>
                          {r.region?.name ?? "—"} {r.isVisible ? "(Visible)" : "(Hidden)"}
                        </div>
                      ))
                    ) : (
                      <div>No region visibility configured.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div
                  className="rounded-xl p-6 border"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                  }}
                >
                  <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                    Included Services
                  </h3>
                  <div className="space-y-2 text-sm" style={{ color: colors.textSecondary }}>
                    {pkg.includedServices?.length ? (
                      pkg.includedServices.map((s) => (
                        <div key={s.id}>
                          {s.serviceName} {s.isIncluded ? "" : "(Not included)"}
                        </div>
                      ))
                    ) : (
                      <div>No included services.</div>
                    )}
                  </div>
                </div>

                <div
                  className="rounded-xl p-6 border"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                  }}
                >
                  <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                    Add-ons
                  </h3>
                  <div className="space-y-2 text-sm" style={{ color: colors.textSecondary }}>
                    {pkg.addons?.length ? (
                      pkg.addons.map((a) => (
                        <div key={a.id}>
                          {a.name} • {a.priceType} • {pkg.currency?.symbol ?? pkg.currencyCode} {a.price}
                        </div>
                      ))
                    ) : (
                      <div>No add-ons configured.</div>
                    )}
                  </div>
                </div>

                <div
                  className="rounded-xl p-6 border"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                  }}
                >
                  <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                    Media
                  </h3>
                  {pkg.media?.length ? (
                    <div className="grid grid-cols-2 gap-3">
                      {pkg.media.map((m) => (
                        <div
                          key={m.id}
                          className="rounded-lg border overflow-hidden"
                          style={{ borderColor: colors.cardBorder }}
                        >
                          {m.mediaType === "image" ? (
                            <Image src={m.url} alt={m.caption ?? "media"} width={300} height={200} className="w-full h-28 object-cover" />
                          ) : (
                            <div className="flex items-center gap-2 p-3 text-sm" style={{ color: colors.textSecondary }}>
                              {m.mediaType === "video" ? <Film className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                              <span>{m.caption ?? m.mediaType}</span>
                            </div>
                          )}
                          {m.isCover && (
                            <div className="px-2 py-1 text-xs" style={{ color: colors.accent }}>
                              Cover
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm" style={{ color: colors.textSecondary }}>
                      No media uploaded.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PackageDetailDrawer;
