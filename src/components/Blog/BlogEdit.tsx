"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MdDeleteOutline, MdKeyboardArrowLeft } from "react-icons/md";
import { useTheme } from "@/context/ThemeContext";
import {
  useBlogByIdQuery,
  useUpdateBlogMutation,
  uploadBlogContentImageApi,
  type BlogTranslation,
} from "@/lib/api/blog";
import { useRegionsListQuery } from "@/lib/api/regions";
import RichTextEditor from "@/common/TextEditor";
import CheckboxDropdown from "@/common/CheckboxDropdown";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SUPPORTED_LOCALES = [
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
  { code: "de", label: "DE" },
  { code: "fr", label: "FR" },
  { code: "ru", label: "RU" },
  { code: "th", label: "TH" },
  { code: "zh", label: "ZH" },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

interface BlogEditProps {
  goBack: () => void;
  id: string;
  initialLocale?: string;
}

export default function BlogEdit({ goBack, id, initialLocale = "en" }: BlogEditProps) {
  const { colors } = useTheme();
  const [locale, setLocale] = useState(initialLocale);

  const { data, isLoading } = useBlogByIdQuery(id);
  const updateMutation = useUpdateBlogMutation();
  const { data: regionsData, isLoading: regionsLoading } = useRegionsListQuery();
  const regions = regionsData?.regions ?? [];

  const blog = data?.blog ?? null;

  // Per-locale form state
  const [slug, setSlug] = useState("");
  const [regionIds, setRegionIds] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");

  // Image state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageCleared, setImageCleared] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form when blog data loads or locale switches
  useEffect(() => {
    if (!blog) return;
    setSlug(blog.slug ?? "");
    setRegionIds(blog.regionVisibility?.map((v) => v.regionId) ?? []);

    const tr: BlogTranslation | undefined =
      blog.translations?.find((t: BlogTranslation) => t.locale === locale) ??
      (locale !== "en" ? blog.translations?.find((t: BlogTranslation) => t.locale === "en") : undefined);

    setTitle(tr?.title ?? blog.title ?? "");
    setShortDescription(tr?.shortDescription ?? blog.shortDescription ?? "");
    setDetailedDescription(tr?.detailedDescription ?? blog.detailedDescription ?? "");

    if (!imageFile && !imageCleared && blog.primaryImage) {
      setImagePreview(blog.primaryImage);
    }
  }, [blog, locale]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be under 10 MB");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPEG, PNG, or WebP images are supported");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageCleared(false);
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageCleared(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!slug.trim()) { toast.error("Slug is required"); return; }
    if (!title.trim()) { toast.error("Title is required"); return; }

    try {
      await updateMutation.mutateAsync({
        id,
        payload: {
          slug: slug.trim(),
          title: title.trim(),
          regionIds,
          shortDescription: shortDescription.trim(),
          detailedDescription: detailedDescription.trim(),
          locale,
          primaryImage: imageFile ?? undefined,
        },
      });
      toast.success("Blog saved successfully");
      setTimeout(() => goBack(), 1000);
    } catch (err) {
      toast.error((err as Error)?.message ?? "Failed to save blog");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div
          className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: colors.accent }}
        />
      </div>
    );
  }

  const inputStyle = {
    backgroundColor: colors.hoverBg,
    borderColor: colors.cardBorder,
    color: colors.textPrimary,
  };

  return (
    <div className="w-full" style={{ backgroundColor: colors.background }}>
      {/* Locale switcher */}
      <div className="flex gap-1 flex-wrap mb-5">
        {SUPPORTED_LOCALES.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => setLocale(code)}
            className="px-2 py-0.5 rounded text-xs font-semibold uppercase transition-opacity hover:opacity-80"
            style={{
              backgroundColor: locale === code ? colors.accent : colors.hoverBg,
              color: locale === code ? "#000" : colors.textSecondary,
              border: `1px solid ${colors.cardBorder}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Blog Information */}
      <div
        className="rounded-2xl px-5 py-5 mb-4"
        style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}
      >
        <p className="text-sm font-bold mb-4" style={{ color: colors.textPrimary }}>Blog Information</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Primary Image */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: colors.textSecondary }}>
              Primary Image <span style={{ color: "#ef4444" }}>*</span>
            </label>
            {imagePreview ? (
              <div className="rounded-lg overflow-hidden relative" style={{ border: `1px solid ${colors.cardBorder}` }}>
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={200}
                  height={100}
                  className="w-full h-[100px] object-cover"
                />
                <div
                  className="flex items-center justify-between gap-2 px-3 py-1.5"
                  style={{ backgroundColor: colors.hoverBg, borderTop: `1px solid ${colors.cardBorder}` }}
                >
                  <span className="text-xs truncate" style={{ color: colors.textSecondary }}>
                    {imageFile ? imageFile.name : imagePreview.split("/").pop()}
                  </span>
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="text-red-400 hover:text-red-500 shrink-0"
                    title="Remove image"
                  >
                    <MdDeleteOutline className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                style={{ ...inputStyle }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="flex-1 text-xs outline-none bg-transparent"
                  style={{ color: colors.textPrimary }}
                />
              </div>
            )}
            {imagePreview && (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: colors.textSecondary }}>
              Slug <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Enter slug"
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={inputStyle}
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: colors.textSecondary }}>
              Title <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={inputStyle}
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: colors.textSecondary }}>
              Short Description <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Enter short description"
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={inputStyle}
            />
          </div>

          {/* Region */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: colors.textSecondary }}>
              Region
            </label>
            <CheckboxDropdown
              options={regions}
              selected={regionIds}
              onChange={setRegionIds}
              placeholder="All Regions"
              isLoading={regionsLoading}
            />
          </div>
        </div>
      </div>

      {/* Detail Description (Rich Text) */}
      <div
        className="rounded-2xl px-5 py-5 mb-4"
        style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}
      >
        <p className="text-sm font-bold mb-4" style={{ color: colors.textPrimary }}>Detail Description</p>
        <RichTextEditor
          value={detailedDescription}
          onChange={setDetailedDescription}
          onImageUpload={(file) => uploadBlogContentImageApi(id, file)}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={goBack}
          className="rounded-full px-[16px] py-[7px] border flex items-center gap-1 font-medium text-sm transition-opacity hover:opacity-80"
          style={{ borderColor: colors.cardBorder, color: colors.textPrimary, backgroundColor: colors.hoverBg }}
        >
          <MdKeyboardArrowLeft /> Back
        </button>
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="rounded-full px-[20px] py-[7px] flex items-center gap-2 font-medium text-sm transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{ backgroundColor: colors.accent, color: "#000" }}
        >
          {updateMutation.isPending ? "Saving…" : "✓ Save"}
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
