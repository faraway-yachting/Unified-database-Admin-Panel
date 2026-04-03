"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MdDeleteOutline, MdKeyboardArrowLeft } from "react-icons/md";
import { useTheme } from "@/context/ThemeContext";
import { useCreateBlogMutation, uploadBlogContentImageApi, useUpdateBlogMutation } from "@/lib/api/blog";
import { useRegionsListQuery } from "@/lib/api/regions";
import RichTextEditor from "@/common/TextEditor";
import CheckboxDropdown from "@/common/CheckboxDropdown";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default function AddNewBlog() {
  const router = useRouter();
  const { colors } = useTheme();
  const createMutation = useCreateBlogMutation();
  const updateMutation = useUpdateBlogMutation();
  const { data: regionsData, isLoading: regionsLoading } = useRegionsListQuery();
  const regions = regionsData?.regions ?? [];

  const [slug, setSlug] = useState("");
  const [regionIds, setRegionIds] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!slug.trim()) { toast.error("Slug is required"); return; }
    if (!title.trim()) { toast.error("Title is required"); return; }
    if (!shortDescription.trim()) { toast.error("Short description is required"); return; }

    try {
      // Strip base64 images from detailedDescription before initial create
      // to avoid sending large payloads; they will be uploaded to S3 after creation.
      let descriptionForCreate = detailedDescription.trim();
      const hasBase64Images = descriptionForCreate.includes("data:image");
      if (hasBase64Images) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(descriptionForCreate, "text/html");
        doc.querySelectorAll("img[src^='data:image']").forEach((imgEl) => {
          imgEl.setAttribute("src", "");
        });
        descriptionForCreate = doc.body.innerHTML;
      }

      const result = await createMutation.mutateAsync({
        slug: slug.trim(),
        title: title.trim(),
        regionIds,
        shortDescription: shortDescription.trim(),
        detailedDescription: descriptionForCreate,
        primaryImage: imageFile,
        locale: "en",
      });
      const newId = result?.id ?? result?.data?.id;

      // Replace any base64 content images with S3 uploads
      if (newId && hasBase64Images) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(detailedDescription, "text/html");
        const images = Array.from(doc.querySelectorAll("img[src^='data:image']"));
        await Promise.all(images.map(async (imgEl) => {
          try {
            const src = imgEl.getAttribute("src")!;
            const res = await fetch(src);
            const blob = await res.blob();
            const file = new File([blob], "content-image.jpg", { type: blob.type });
            const url = await uploadBlogContentImageApi(newId, file);
            imgEl.setAttribute("src", url);
          } catch { /* keep base64 if upload fails */ }
        }));
        const updatedDescription = doc.body.innerHTML;
        await updateMutation.mutateAsync({ id: newId, payload: { detailedDescription: updatedDescription, locale: "en" } });
      }

      toast.success("Blog created successfully");
      setTimeout(() => {
        router.push(newId ? `/blog/${newId}` : "/blog");
      }, 1000);
    } catch (err) {
      toast.error((err as Error)?.message ?? "Failed to create blog");
    }
  };

  const inputStyle = {
    backgroundColor: colors.hoverBg,
    borderColor: colors.cardBorder,
    color: colors.textPrimary,
  };

  return (
    <div className="w-full" style={{ backgroundColor: colors.background }}>
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
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg border"
              style={inputStyle}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="flex-1 text-xs outline-none bg-transparent"
                style={{ color: colors.textPrimary }}
              />
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="text-red-400 hover:text-red-500 shrink-0"
                  title="Remove image"
                >
                  <MdDeleteOutline className="w-4 h-4" />
                </button>
              )}
            </div>
            {imagePreview && (
              <div
                className="mt-2 rounded-lg overflow-hidden"
                style={{ border: `1px solid ${colors.cardBorder}` }}
              >
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={200}
                  height={100}
                  className="w-full h-[100px] object-cover"
                />
              </div>
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

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: colors.textSecondary }}>
              Description <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Enter description"
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

      {/* Blog Content (Rich Text) */}
      <div
        className="rounded-2xl px-5 py-5 mb-4"
        style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}
      >
        <p className="text-sm font-bold mb-4" style={{ color: colors.textPrimary }}>Blog Content</p>
        <RichTextEditor
          value={detailedDescription}
          onChange={setDetailedDescription}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.push("/blog")}
          className="rounded-full px-[16px] py-[7px] border flex items-center gap-1 font-medium text-sm transition-opacity hover:opacity-80"
          style={{ borderColor: colors.cardBorder, color: colors.textPrimary, backgroundColor: colors.hoverBg }}
        >
          <MdKeyboardArrowLeft /> Back
        </button>
        <button
          onClick={handleSave}
          disabled={createMutation.isPending}
          className="rounded-full px-[20px] py-[7px] flex items-center gap-2 font-medium text-sm transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{ backgroundColor: colors.accent, color: "#000" }}
        >
          {createMutation.isPending ? "Saving…" : "✓ Save"}
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
