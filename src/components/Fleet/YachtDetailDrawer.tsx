"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  Shield,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { parseLength, useYachtDetailQuery } from "@/lib/api/yachts";
import type { Yacht } from "./YachtCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface YachtDetailDrawerProps {
  yacht: Yacht | null;
  onClose: () => void;
}

export function YachtDetailDrawer({ yacht, onClose }: YachtDetailDrawerProps) {
  const { colors } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const { data, isLoading, isError, error } = useYachtDetailQuery(yacht?.id ?? null);
  const detail = data?.yacht;

  const images = useMemo(() => {
    if (!yacht) return [];
    const detailImages = detail?.images?.map((img) => img.imageUrl).filter(Boolean) ?? [];
    const list =
      detailImages.length > 0
        ? detailImages
        : yacht.images?.length
          ? yacht.images
          : [yacht.image];
    return list.filter(Boolean);
  }, [detail?.images, yacht]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        setActiveIndex((idx) => (images.length ? (idx - 1 + images.length) % images.length : 0));
      }
      if (e.key === "ArrowRight") {
        setActiveIndex((idx) => (images.length ? (idx + 1) % images.length : 0));
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose, images.length]);

  useEffect(() => {
    if (yacht?.id) setActiveIndex(0);
  }, [yacht?.id]);

  if (!yacht) return null;

  const hasMultipleImages = images.length > 1;
  const activeImage = images[activeIndex] || yacht.image;

  const lengthM = parseLength(detail?.lengthM ?? null);
  const lengthFt = lengthM ? Math.round(lengthM * 3.28084) : 0;
  const displayLengthFt = lengthFt || yacht.length || 0;
  const beamM = detail?.beamM != null ? parseFloat(String(detail.beamM)) : null;
  const cruiseSpeed = detail?.cruiseSpeedKnots != null ? parseFloat(String(detail.cruiseSpeedKnots)) : null;
  const fuelCapacity = detail?.fuelCapacityL ?? null;

  const specs = [
    { label: "Length Overall", value: displayLengthFt ? `${displayLengthFt} ft` : "—" },
    { label: "Beam", value: beamM != null && Number.isFinite(beamM) ? `${beamM} m` : "—" },
    { label: "Cruising Speed", value: cruiseSpeed != null && Number.isFinite(cruiseSpeed) ? `${cruiseSpeed} knots` : "—" },
    { label: "Fuel Capacity", value: fuelCapacity ? `${fuelCapacity} L` : "—" },
    { label: "Engine", value: detail?.engineType || "—" },
    { label: "Engine HP", value: detail?.engineHp ? `${detail.engineHp} hp` : "—" },
    { label: "Year Built", value: detail?.yearBuilt ? String(detail.yearBuilt) : "—" },
    { label: "Home Port", value: detail?.homePort || "—" },
  ];

  const amenities = (detail?.amenities ?? []).filter((amenity) => amenity.isAvailable);

  const documents = detail?.documents ?? [];

  const bookings = detail?.bookings ?? [];

  const availabilityBlocks = detail?.availabilityBlocks ?? [];

  const formatDate = (value?: string | null) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString();
  };

  const formatAmount = (amount: number | string) => {
    const n = typeof amount === "number" ? amount : parseFloat(String(amount));
    if (!Number.isFinite(n)) return "—";
    return n.toLocaleString();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="yacht-drawer-title"
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
              id="yacht-drawer-title"
              className="text-2xl font-bold mb-1"
              style={{ color: colors.textPrimary }}
            >
              {yacht.name}
            </h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {yacht.type} • {yacht.region}
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

        <div className="p-6">
          <div className="mb-8">
            <div className="relative h-80 rounded-xl overflow-hidden mb-4">
              <Image
                src={activeImage}
                alt={yacht.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1400px"
                quality={90}
              />
              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full backdrop-blur-sm"
                    style={{
                      backgroundColor: `${colors.cardBg}CC`,
                      color: colors.textPrimary,
                    }}
                    aria-label="Previous image"
                    onClick={() => setActiveIndex((idx) => (idx - 1 + images.length) % images.length)}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full backdrop-blur-sm"
                    style={{
                      backgroundColor: `${colors.cardBg}CC`,
                      color: colors.textPrimary,
                    }}
                    aria-label="Next image"
                    onClick={() => setActiveIndex((idx) => (idx + 1) % images.length)}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all"
                  style={{
                    borderColor: idx === activeIndex ? colors.accent : "transparent",
                  }}
                  onClick={() => setActiveIndex(idx)}
                >
                  <Image src={img} alt="" width={200} height={96} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {isLoading && (
            <div className="flex justify-center py-6">
              <LoadingSpinner size="md" text="Loading yacht details..." />
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
              {error instanceof Error ? error.message : "Failed to load yacht details."}
            </div>
          )}

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
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {specs.map((spec, idx) => (
                    <div key={idx}>
                      <div className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                        {spec.label}
                      </div>
                      <div className="text-sm font-mono font-bold" style={{ color: colors.textPrimary }}>
                        {spec.value}
                      </div>
                    </div>
                  ))}
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
                  Amenities & Features
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {amenities.length === 0 && (
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      No amenities listed.
                    </span>
                  )}
                  {amenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: colors.accent }} />
                      <span className="text-sm" style={{ color: colors.textPrimary }}>
                        {amenity.name}
                      </span>
                    </div>
                  ))}
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
                  Documents & Certificates
                </h3>
                <div className="space-y-3">
                  {documents.length === 0 && (
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      No documents uploaded.
                    </span>
                  )}
                  {documents.map((doc) => {
                    const isExpired =
                      doc.isExpired ||
                      (doc.expiryDate ? new Date(doc.expiryDate).getTime() < Date.now() : false);
                    return (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                      style={{
                        backgroundColor: colors.cardBg,
                        borderColor: colors.cardBorder,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{
                            backgroundColor:
                              !isExpired ? `${colors.accent}15` : `${colors.accentGold}15`,
                          }}
                        >
                          {doc.documentType?.toLowerCase().includes("insurance") ? (
                            <Shield
                              className="w-4 h-4"
                              style={{
                                color: !isExpired ? colors.accent : colors.accentGold,
                              }}
                            />
                          ) : (
                            <FileText
                              className="w-4 h-4"
                              style={{
                                color: !isExpired ? colors.accent : colors.accentGold,
                              }}
                            />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                            {doc.documentType}
                          </div>
                          <div className="text-xs" style={{ color: colors.textSecondary }}>
                            Expires: {formatDate(doc.expiryDate)}
                          </div>
                        </div>
                      </div>
                      <div
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor:
                            !isExpired ? `${colors.success}15` : `${colors.warning}15`,
                          color: !isExpired ? colors.success : colors.warning,
                        }}
                      >
                        {!isExpired ? "Valid" : "Expired"}
                      </div>
                    </div>
                  )})}
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
                  Upcoming Bookings
                </h3>
                <div className="space-y-3">
                  {bookings.length === 0 && (
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      No bookings found.
                    </span>
                  )}
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 rounded-lg border"
                      style={{
                        backgroundColor: colors.cardBg,
                        borderColor: colors.cardBorder,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-mono" style={{ color: colors.accent }}>
                          #{booking.bookingRef}
                        </span>
                        <span className="text-sm font-mono font-bold" style={{ color: colors.textPrimary }}>
                          {booking.currencyCode} {formatAmount(booking.totalAmount)}
                        </span>
                      </div>
                      <div className="text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>
                        {booking.status}
                      </div>
                      <div className="flex items-center gap-2 text-xs" style={{ color: colors.textSecondary }}>
                        <Calendar className="w-3 h-3" />
                        <span>
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)} • {booking.guestCount} guests
                        </span>
                      </div>
                    </div>
                  ))}
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
                  Availability Blocks
                </h3>
                <div className="space-y-3">
                  {availabilityBlocks.length === 0 && (
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      No availability blocks.
                    </span>
                  )}
                  {availabilityBlocks.map((block) => (
                    <div
                      key={block.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                      style={{
                        backgroundColor: colors.cardBg,
                        borderColor: colors.cardBorder,
                      }}
                    >
                      <div>
                        <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                          {block.reason || "Blocked"}
                        </div>
                        <div className="text-xs" style={{ color: colors.textSecondary }}>
                          {formatDate(block.startDate)} - {formatDate(block.endDate)}
                        </div>
                      </div>
                      {block.notes && (
                        <div className="text-xs" style={{ color: colors.textSecondary }}>
                          {block.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default YachtDetailDrawer;
