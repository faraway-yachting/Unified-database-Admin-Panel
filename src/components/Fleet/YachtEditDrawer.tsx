import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  X,
  Plus,
  Trash2,
  FileText,
  Shield,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import {
  addYachtAmenity,
  addYachtAvailabilityBlock,
  deleteYachtAmenity,
  deleteYachtAvailabilityBlock,
  deleteYachtDocument,
  deleteYachtImage,
  uploadYachtDocument,
  uploadYachtImages,
  useYachtDetailQuery,
  yachtsKeys,
} from "@/lib/api/yachts";
import { cancelBooking, createBooking } from "@/lib/api/bookings";
import { useQueryClient } from "@tanstack/react-query";
import type { Yacht } from "./YachtCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface YachtEditDrawerProps {
  yacht: Yacht | null;
  onClose: () => void;
}

type ModalType = "images" | "amenity" | "document" | "availability" | "booking" | null;

interface ConfirmState {
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
}

const AMENITY_CATEGORIES = [
  { label: "Navigation", value: "navigation" },
  { label: "Safety", value: "safety" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Water Sports", value: "water_sports" },
  { label: "Comfort", value: "comfort" },
];

const DOCUMENT_TYPES = ["insurance", "registration", "certificate", "inspection"];

export function YachtEditDrawer({ yacht, onClose }: YachtEditDrawerProps) {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useYachtDetailQuery(yacht?.id ?? null);
  const detail = data?.yacht;

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [amenityName, setAmenityName] = useState("");
  const [amenityCategory, setAmenityCategory] = useState(AMENITY_CATEGORIES[0].value);
  const [amenityAvailable, setAmenityAvailable] = useState(true);

  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState(DOCUMENT_TYPES[0]);
  const [issuedDate, setIssuedDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [documentNotes, setDocumentNotes] = useState("");

  const [blockStartDate, setBlockStartDate] = useState("");
  const [blockEndDate, setBlockEndDate] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [blockNotes, setBlockNotes] = useState("");

  const [bookingCustomerId, setBookingCustomerId] = useState("");
  const [bookingPackageId, setBookingPackageId] = useState("");
  const [bookingRegionId, setBookingRegionId] = useState("");
  const [bookingStartDate, setBookingStartDate] = useState("");
  const [bookingEndDate, setBookingEndDate] = useState("");
  const [bookingGuestCount, setBookingGuestCount] = useState("");
  const [bookingBaseAmount, setBookingBaseAmount] = useState("");
  const [bookingTotalAmount, setBookingTotalAmount] = useState("");
  const [bookingCurrencyCode, setBookingCurrencyCode] = useState("USD");

  useEffect(() => {
    if (detail?.region?.id) {
      setBookingRegionId(detail.region.id);
    }
  }, [detail?.region?.id]);

  if (!yacht) return null;

  const images = useMemo(() => {
    const detailImages = detail?.images ?? [];
    return detailImages;
  }, [detail?.images]);

  const amenities = detail?.amenities ?? [];
  const documents = detail?.documents ?? [];
  const bookings = detail?.bookings ?? [];
  const availabilityBlocks = detail?.availabilityBlocks ?? [];

  const refreshDetail = () =>
    queryClient.invalidateQueries({ queryKey: yachtsKeys.detail(yacht.id) });

  const formatDate = (value?: string | null) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString();
  };

  const handleConfirm = async () => {
    if (!confirmState) return;
    setIsSubmitting(true);
    try {
      await confirmState.onConfirm();
      await refreshDetail();
      setConfirmState(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddImages = async () => {
    if (!imageFiles.length) return;
    setIsSubmitting(true);
    try {
      await uploadYachtImages(yacht.id, imageFiles);
      await refreshDetail();
      setImageFiles([]);
      setActiveModal(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAmenity = async () => {
    if (!amenityName.trim()) return;
    setIsSubmitting(true);
    try {
      await addYachtAmenity(yacht.id, {
        category: amenityCategory,
        name: amenityName.trim(),
        isAvailable: amenityAvailable,
      });
      await refreshDetail();
      setAmenityName("");
      setAmenityCategory(AMENITY_CATEGORIES[0].value);
      setAmenityAvailable(true);
      setActiveModal(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddDocument = async () => {
    if (!documentFile || !documentType) return;
    setIsSubmitting(true);
    try {
      await uploadYachtDocument(yacht.id, {
        file: documentFile,
        documentType,
        issuedDate: issuedDate || undefined,
        expiryDate: expiryDate || undefined,
        notes: documentNotes || undefined,
      });
      await refreshDetail();
      setDocumentFile(null);
      setIssuedDate("");
      setExpiryDate("");
      setDocumentNotes("");
      setDocumentType(DOCUMENT_TYPES[0]);
      setActiveModal(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAvailability = async () => {
    if (!blockStartDate || !blockEndDate) return;
    setIsSubmitting(true);
    try {
      await addYachtAvailabilityBlock(yacht.id, {
        startDate: blockStartDate,
        endDate: blockEndDate,
        reason: blockReason || undefined,
        notes: blockNotes || undefined,
      });
      await refreshDetail();
      setBlockStartDate("");
      setBlockEndDate("");
      setBlockReason("");
      setBlockNotes("");
      setActiveModal(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddBooking = async () => {
    if (
      !bookingCustomerId ||
      !bookingPackageId ||
      !bookingRegionId ||
      !bookingStartDate ||
      !bookingEndDate ||
      !bookingGuestCount ||
      !bookingBaseAmount ||
      !bookingTotalAmount ||
      !bookingCurrencyCode
    ) {
      return;
    }
    setIsSubmitting(true);
    try {
      await createBooking({
        customerId: bookingCustomerId,
        yachtId: yacht.id,
        packageId: bookingPackageId,
        regionId: bookingRegionId,
        startDate: bookingStartDate,
        endDate: bookingEndDate,
        guestCount: Number.parseInt(bookingGuestCount, 10),
        baseAmount: Number.parseFloat(bookingBaseAmount),
        totalAmount: Number.parseFloat(bookingTotalAmount),
        currencyCode: bookingCurrencyCode,
      });
      await refreshDetail();
      setBookingCustomerId("");
      setBookingPackageId("");
      setBookingStartDate("");
      setBookingEndDate("");
      setBookingGuestCount("");
      setBookingBaseAmount("");
      setBookingTotalAmount("");
      setActiveModal(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
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
            <h2 className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
              Edit {yacht.name}
            </h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Manage yacht assets and related data.
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
              <LoadingSpinner size="md" text="Loading yacht data..." />
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

          <div
            className="rounded-xl p-6 border"
            style={{ backgroundColor: colors.background, borderColor: colors.cardBorder }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                Images
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal("images")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: `${colors.accent}15`,
                  color: colors.accent,
                }}
              >
                <Plus className="w-4 h-4" />
                Add Images
              </button>
            </div>
            {images.length === 0 ? (
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                No images uploaded yet.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="relative rounded-lg overflow-hidden border"
                    style={{ borderColor: colors.cardBorder }}
                  >
                    <Image
                      src={img.imageUrl}
                      alt={img.caption ?? "Yacht image"}
                      width={300}
                      height={200}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 p-1.5 rounded-full"
                      style={{ backgroundColor: colors.cardBg }}
                      onClick={() =>
                        setConfirmState({
                          title: "Delete image?",
                          description: "This will remove the image from the yacht gallery.",
                          onConfirm: () => deleteYachtImage(yacht.id, img.id),
                        })
                      }
                    >
                      <Trash2 className="w-4 h-4" style={{ color: colors.danger }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className="rounded-xl p-6 border"
            style={{ backgroundColor: colors.background, borderColor: colors.cardBorder }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                Amenities
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal("amenity")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: `${colors.accent}15`,
                  color: colors.accent,
                }}
              >
                <Plus className="w-4 h-4" />
                Add Amenity
              </button>
            </div>
            {amenities.length === 0 ? (
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                No amenities added yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {amenities.map((amenity) => (
                  <div
                    key={amenity.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                    style={{ borderColor: colors.cardBorder, backgroundColor: colors.cardBg }}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" style={{ color: colors.accent }} />
                      <div>
                        <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                          {amenity.name}
                        </div>
                        <div className="text-xs" style={{ color: colors.textSecondary }}>
                          {amenity.category}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmState({
                          title: "Remove amenity?",
                          description: "This will remove the amenity from the yacht.",
                          onConfirm: () => deleteYachtAmenity(yacht.id, amenity.id),
                        })
                      }
                    >
                      <Trash2 className="w-4 h-4" style={{ color: colors.danger }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className="rounded-xl p-6 border"
            style={{ backgroundColor: colors.background, borderColor: colors.cardBorder }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                Documents
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal("document")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: `${colors.accent}15`,
                  color: colors.accent,
                }}
              >
                <Plus className="w-4 h-4" />
                Add Document
              </button>
            </div>
            {documents.length === 0 ? (
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                No documents uploaded yet.
              </p>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => {
                  const isExpired =
                    doc.isExpired ||
                    (doc.expiryDate ? new Date(doc.expiryDate).getTime() < Date.now() : false);
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                      style={{ borderColor: colors.cardBorder, backgroundColor: colors.cardBg }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{
                            backgroundColor: !isExpired ? `${colors.accent}15` : `${colors.warning}15`,
                          }}
                        >
                          {doc.documentType?.toLowerCase().includes("insurance") ? (
                            <Shield className="w-4 h-4" style={{ color: colors.accent }} />
                          ) : (
                            <FileText className="w-4 h-4" style={{ color: colors.accent }} />
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
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmState({
                            title: "Delete document?",
                            description: "This will permanently delete the document.",
                            onConfirm: () => deleteYachtDocument(yacht.id, doc.id),
                          })
                        }
                      >
                        <Trash2 className="w-4 h-4" style={{ color: colors.danger }} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div
            className="rounded-xl p-6 border"
            style={{ backgroundColor: colors.background, borderColor: colors.cardBorder }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                Availability Blocks
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal("availability")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: `${colors.accent}15`,
                  color: colors.accent,
                }}
              >
                <Plus className="w-4 h-4" />
                Add Block
              </button>
            </div>
            {availabilityBlocks.length === 0 ? (
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                No blocks added yet.
              </p>
            ) : (
              <div className="space-y-3">
                {availabilityBlocks.map((block) => (
                  <div
                    key={block.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                    style={{ borderColor: colors.cardBorder, backgroundColor: colors.cardBg }}
                  >
                    <div>
                      <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                        {block.reason || "Blocked"}
                      </div>
                      <div className="text-xs" style={{ color: colors.textSecondary }}>
                        {formatDate(block.startDate)} - {formatDate(block.endDate)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmState({
                          title: "Remove block?",
                          description: "This will remove the availability block.",
                          onConfirm: () => deleteYachtAvailabilityBlock(yacht.id, block.id),
                        })
                      }
                    >
                      <Trash2 className="w-4 h-4" style={{ color: colors.danger }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className="rounded-xl p-6 border"
            style={{ backgroundColor: colors.background, borderColor: colors.cardBorder }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                Bookings
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal("booking")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: `${colors.accent}15`,
                  color: colors.accent,
                }}
              >
                <Plus className="w-4 h-4" />
                Add Booking
              </button>
            </div>
            {bookings.length === 0 ? (
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                No bookings yet.
              </p>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                    style={{ borderColor: colors.cardBorder, backgroundColor: colors.cardBg }}
                  >
                    <div>
                      <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                        #{booking.bookingRef} • {booking.status}
                      </div>
                      <div className="text-xs" style={{ color: colors.textSecondary }}>
                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)} • {booking.guestCount} guests
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmState({
                          title: "Cancel booking?",
                          description: "This will cancel the booking for this yacht.",
                          onConfirm: () => cancelBooking(booking.id),
                        })
                      }
                    >
                      <Trash2 className="w-4 h-4" style={{ color: colors.danger }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {activeModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border p-6"
            style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                {activeModal === "images" && "Add Images"}
                {activeModal === "amenity" && "Add Amenity"}
                {activeModal === "document" && "Add Document"}
                {activeModal === "availability" && "Add Availability Block"}
                {activeModal === "booking" && "Add Booking"}
              </h3>
              <button type="button" onClick={() => setActiveModal(null)}>
                <X className="w-5 h-5" style={{ color: colors.textSecondary }} />
              </button>
            </div>

            {activeModal === "images" && (
              <div className="space-y-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImageFiles(Array.from(e.target.files ?? []))}
                  onClick={(e) => e.stopPropagation()}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-lg border text-sm"
                    style={{ borderColor: colors.cardBorder, color: colors.textPrimary }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddImages}
                    disabled={isSubmitting || imageFiles.length === 0}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                    style={{ background: `linear-gradient(to right, ${colors.accent}, #00B39F)` }}
                  >
                    {isSubmitting ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>
            )}

            {activeModal === "amenity" && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Amenity name"
                  value={amenityName}
                  onChange={(e) => setAmenityName(e.target.value)}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                />
                <select
                  value={amenityCategory}
                  onChange={(e) => setAmenityCategory(e.target.value)}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                >
                  {AMENITY_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-2 text-sm" style={{ color: colors.textPrimary }}>
                  <input
                    type="checkbox"
                    checked={amenityAvailable}
                    onChange={(e) => setAmenityAvailable(e.target.checked)}
                  />
                  Available
                </label>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-lg border text-sm"
                    style={{ borderColor: colors.cardBorder, color: colors.textPrimary }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddAmenity}
                    disabled={isSubmitting || !amenityName.trim()}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                    style={{ background: `linear-gradient(to right, ${colors.accent}, #00B39F)` }}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            )}

            {activeModal === "document" && (
              <div className="space-y-4">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setDocumentFile(e.target.files?.[0] ?? null)}
                  onClick={(e) => e.stopPropagation()}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                />
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                >
                  {DOCUMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={issuedDate}
                    onChange={(e) => setIssuedDate(e.target.value)}
                    className={inputClass}
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.cardBorder,
                      color: colors.textPrimary,
                    }}
                  />
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className={inputClass}
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.cardBorder,
                      color: colors.textPrimary,
                    }}
                  />
                </div>
                <textarea
                  rows={3}
                  placeholder="Notes"
                  value={documentNotes}
                  onChange={(e) => setDocumentNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border text-sm"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-lg border text-sm"
                    style={{ borderColor: colors.cardBorder, color: colors.textPrimary }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddDocument}
                    disabled={isSubmitting || !documentFile}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                    style={{ background: `linear-gradient(to right, ${colors.accent}, #00B39F)` }}
                  >
                    {isSubmitting ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>
            )}

            {activeModal === "availability" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={blockStartDate}
                    onChange={(e) => setBlockStartDate(e.target.value)}
                    className={inputClass}
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.cardBorder,
                      color: colors.textPrimary,
                    }}
                  />
                  <input
                    type="date"
                    value={blockEndDate}
                    onChange={(e) => setBlockEndDate(e.target.value)}
                    className={inputClass}
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.cardBorder,
                      color: colors.textPrimary,
                    }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Reason"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                />
                <textarea
                  rows={3}
                  placeholder="Notes"
                  value={blockNotes}
                  onChange={(e) => setBlockNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border text-sm"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-lg border text-sm"
                    style={{ borderColor: colors.cardBorder, color: colors.textPrimary }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddAvailability}
                    disabled={isSubmitting || !blockStartDate || !blockEndDate}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                    style={{ background: `linear-gradient(to right, ${colors.accent}, #00B39F)` }}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            )}

            {activeModal === "booking" && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Customer ID"
                  value={bookingCustomerId}
                  onChange={(e) => setBookingCustomerId(e.target.value)}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                />
                <input
                  type="text"
                  placeholder="Package ID"
                  value={bookingPackageId}
                  onChange={(e) => setBookingPackageId(e.target.value)}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                />
                <input
                  type="text"
                  placeholder="Region ID"
                  value={bookingRegionId}
                  onChange={(e) => setBookingRegionId(e.target.value)}
                  className={inputClass}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={bookingStartDate}
                    onChange={(e) => setBookingStartDate(e.target.value)}
                    className={inputClass}
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.cardBorder,
                      color: colors.textPrimary,
                    }}
                  />
                  <input
                    type="date"
                    value={bookingEndDate}
                    onChange={(e) => setBookingEndDate(e.target.value)}
                    className={inputClass}
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
                    min={1}
                    placeholder="Guest count"
                    value={bookingGuestCount}
                    onChange={(e) => setBookingGuestCount(e.target.value)}
                    className={inputClass}
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.cardBorder,
                      color: colors.textPrimary,
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Currency (e.g. USD)"
                    value={bookingCurrencyCode}
                    onChange={(e) => setBookingCurrencyCode(e.target.value)}
                    className={inputClass}
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
                    placeholder="Base amount"
                    value={bookingBaseAmount}
                    onChange={(e) => setBookingBaseAmount(e.target.value)}
                    className={inputClass}
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
                    value={bookingTotalAmount}
                    onChange={(e) => setBookingTotalAmount(e.target.value)}
                    className={inputClass}
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.cardBorder,
                      color: colors.textPrimary,
                    }}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-lg border text-sm"
                    style={{ borderColor: colors.cardBorder, color: colors.textPrimary }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddBooking}
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                    style={{ background: `linear-gradient(to right, ${colors.accent}, #00B39F)` }}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {confirmState && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div
            className="w-full max-w-md rounded-2xl border p-6"
            style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}
          >
            <h3 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
              {confirmState.title}
            </h3>
            <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
              {confirmState.description}
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmState(null)}
                className="px-4 py-2 rounded-lg border text-sm"
                style={{ borderColor: colors.cardBorder, color: colors.textPrimary }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ backgroundColor: colors.danger }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Working..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default YachtEditDrawer;
