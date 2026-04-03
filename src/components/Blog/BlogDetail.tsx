"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import { MdEdit, MdDelete, MdKeyboardArrowLeft } from "react-icons/md";
import { BookOpen, ChevronDown } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import {
  useBlogByIdQuery,
  useDeleteBlogMutation,
  useUpdateBlogStatusMutation,
  useUpdateBlogMutation,
  type BlogItem,
  type BlogTranslation,
} from "@/lib/api/blog";
import { useRegionsQuery } from "@/lib/api/regions";
import BlogEdit from "./BlogEdit";
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

const PURIFY_CONFIG = {
  ADD_ATTR: ["style", "class", "bgcolor", "color", "border", "cellpadding", "cellspacing",
    "width", "height", "align", "valign", "colspan", "rowspan", "target", "rel"],
  ADD_TAGS: ["table", "thead", "tbody", "tfoot", "tr", "th", "td", "colgroup", "col"],
};

interface BlogDetailProps {
  id: string;
  defaultEdit?: boolean;
}

export default function BlogDetail({ id, defaultEdit = false }: BlogDetailProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { colors } = useTheme();

  const [editing, setEditing] = useState(defaultEdit);
  const [locale, setLocale] = useState("en");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [sanitizedHtml, setSanitizedHtml] = useState<string>("");
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const [selectedRegionIds, setSelectedRegionIds] = useState<string[]>([]);
  const regionDropdownRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useBlogByIdQuery(id);
  const deleteMutation = useDeleteBlogMutation();
  const statusMutation = useUpdateBlogStatusMutation();
  const updateMutation = useUpdateBlogMutation();
  const { data: regionsData, isLoading: regionsLoading } = useRegionsQuery();

  const blog: BlogItem | null = data?.blog ?? null;

  const tr: BlogTranslation | undefined =
    blog?.translations?.find((t: BlogTranslation) => t.locale === locale) ??
    (locale !== "en" ? blog?.translations?.find((t: BlogTranslation) => t.locale === "en") : undefined);

  const title = tr?.title ?? blog?.title ?? blog?.slug ?? "Untitled";
  const shortDesc = tr?.shortDescription ?? blog?.shortDescription ?? "";
  const detailedDesc = tr?.detailedDescription ?? blog?.detailedDescription ?? "";

  useEffect(() => {
    if (!detailedDesc?.trim()) {
      setSanitizedHtml("");
      return;
    }
    import("dompurify").then(({ default: DOMPurify }) => {
      setSanitizedHtml(DOMPurify.sanitize(detailedDesc, PURIFY_CONFIG));
    });
  }, [detailedDesc]);

  // Sync selected regions from blog data
  useEffect(() => {
    if (blog?.regionVisibility) {
      setSelectedRegionIds(blog.regionVisibility.map((rv) => rv.regionId));
    }
  }, [blog?.regionVisibility]);

  // Close region dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(e.target as Node)) {
        setRegionDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleEdit = (on: boolean) => {
    setEditing(on);
    const params = new URLSearchParams(searchParams.toString());
    if (on) params.set("edit", "true");
    else params.delete("edit");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const handleSaveRegionsAndPublish = async () => {
    if (!blog) return;
    try {
      await updateMutation.mutateAsync({ id: blog.id, payload: { regionIds: selectedRegionIds } });
      await statusMutation.mutateAsync({ id: blog.id, status: "published" });
      setRegionDropdownOpen(false);
      toast.success("Blog published");
    } catch (err) {
      toast.error((err as Error)?.message ?? "Failed to publish blog");
    }
  };

  const toggleRegion = (regionId: string) => {
    setSelectedRegionIds((prev) =>
      prev.includes(regionId) ? prev.filter((r) => r !== regionId) : [...prev, regionId]
    );
  };

  const allRegions = regionsData ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-112px)]" style={{ backgroundColor: colors.background }}>
        <div className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin" style={{ borderColor: colors.accent }} />
      </div>
    );
  }

  if (editing) {
    return (
      <div className="mt-4" style={{ backgroundColor: colors.background }}>
        <div
          className="rounded-2xl px-5 py-5"
          style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}
        >
          <BlogEdit goBack={() => toggleEdit(false)} id={id} initialLocale={locale} />
        </div>
      </div>
    );
  }

  const divider = { borderColor: colors.cardBorder };

  return (
    <div className="w-full overflow-x-hidden" style={{ backgroundColor: colors.background }}>
      {/* Header card */}
      <div
        className="rounded-2xl px-4 py-4 mb-4"
        style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}
      >
        <div className="flex justify-between items-start sm:items-center gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <BookOpen className="shrink-0 w-5 h-5" style={{ color: colors.accent }} />
            <span
              className="font-bold text-[16px] sm:text-[20px] truncate"
              style={{ color: colors.textPrimary }}
            >
              {title}
            </span>
          </div>
          {blog && (
            <div ref={regionDropdownRef} className="relative shrink-0">
              {/* Dropdown trigger */}
              <button
                onClick={() => setRegionDropdownOpen((v) => !v)}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-opacity hover:opacity-80"
                style={{ backgroundColor: colors.accent, color: "#000" }}
              >
                Click to Publish
                <ChevronDown className="w-3.5 h-3.5 shrink-0" style={{ transform: regionDropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s" }} />
              </button>

              {/* Region dropdown */}
              {regionDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 z-50 rounded-xl shadow-xl w-64 py-2"
                  style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}
                >
                  <p className="px-3 pb-2 text-xs font-bold border-b mb-1" style={{ color: colors.textSecondary, borderColor: colors.cardBorder }}>
                    Select Regions
                  </p>
                  <div className="max-h-44 overflow-y-auto">
                    {regionsLoading ? (
                      <p className="px-3 py-2 text-xs" style={{ color: colors.textSecondary }}>Loading…</p>
                    ) : allRegions.length === 0 ? (
                      <p className="px-3 py-2 text-xs" style={{ color: colors.textSecondary }}>No regions available</p>
                    ) : (
                      allRegions.map((region) => {
                        const checked = selectedRegionIds.includes(region.id);
                        return (
                          <label
                            key={region.id}
                            className="flex items-center gap-2 px-3 py-2 cursor-pointer text-sm hover:opacity-80"
                            style={{ backgroundColor: checked ? `${colors.accent}15` : "transparent", color: colors.textPrimary }}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleRegion(region.id)}
                              className="w-3.5 h-3.5 rounded shrink-0"
                              style={{ accentColor: colors.accent }}
                            />
                            {region.name}
                          </label>
                        );
                      })
                    )}
                  </div>
                  <div className="px-3 pt-2 mt-1 border-t" style={{ borderColor: colors.cardBorder }}>
                    <button
                      onClick={handleSaveRegionsAndPublish}
                      disabled={updateMutation.isPending || statusMutation.isPending}
                      className="w-full py-1.5 rounded-full text-xs font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
                      style={{ backgroundColor: colors.accent, color: "#000" }}
                    >
                      {updateMutation.isPending || statusMutation.isPending ? "Publishing…" : "Save & Publish"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Locale switcher */}
        <div className="flex gap-1 flex-wrap">
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
      </div>

      <div className="flex flex-col lg:flex-row gap-4 min-w-0">
        {/* Left: info + content */}
        <div
          className="w-full lg:flex-1 min-w-0 rounded-2xl px-5 py-5"
          style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}
        >
          {/* Blog Information */}
          <div className="mb-5 pb-5 border-b" style={divider}>
            <p className="text-sm font-bold mb-4" style={{ color: colors.textPrimary }}>Blog Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <div className="text-xs font-bold mb-0.5" style={{ color: colors.textSecondary }}>Title</div>
                <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>{title}</div>
              </div>
              <div>
                <div className="text-xs font-bold mb-0.5" style={{ color: colors.textSecondary }}>Slug</div>
                <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>{blog?.slug}</div>
              </div>
              <div>
                <div className="text-xs font-bold mb-0.5" style={{ color: colors.textSecondary }}>Status</div>
                <div className="text-sm font-medium capitalize" style={{ color: colors.textPrimary }}>{blog?.status}</div>
              </div>
              {blog?.createdAt && (
                <div>
                  <div className="text-xs font-bold mb-0.5" style={{ color: colors.textSecondary }}>Created</div>
                  <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                </div>
              )}
              <div className="sm:col-span-2">
                <div className="text-xs font-bold mb-1" style={{ color: colors.textSecondary }}>Regions</div>
                {blog?.regionVisibility && blog.regionVisibility.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {blog.regionVisibility.map((rv) => (
                      <span
                        key={rv.regionId}
                        className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: `${colors.accent}15`, color: colors.accent, border: `1px solid ${colors.accent}30` }}
                      >
                        {rv.region.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm font-medium" style={{ color: colors.textSecondary }}>Not assigned to any region</div>
                )}
              </div>
            </div>
          </div>

          {/* Short Description */}
          {shortDesc && (
            <div className="mb-5 pb-5 border-b" style={divider}>
              <p className="text-sm font-bold mb-2" style={{ color: colors.textPrimary }}>Short Description</p>
              <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>{shortDesc}</p>
            </div>
          )}

          {/* Detailed Description */}
          {sanitizedHtml && (
            <div className="mb-5 pb-5 border-b last:border-0" style={divider}>
              <p className="text-sm font-bold mb-3" style={{ color: colors.textPrimary }}>Detailed Description</p>
              <div
                className="rich-html-content max-w-full text-sm overflow-x-hidden"
                style={{ color: colors.textPrimary }}
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-between pt-4 border-t mt-4" style={divider}>
            <button
              onClick={() => router.push("/blog")}
              className="rounded-full px-[16px] py-[7px] border flex items-center gap-1 cursor-pointer font-medium text-sm transition-opacity hover:opacity-80"
              style={{ borderColor: colors.cardBorder, color: colors.textPrimary, backgroundColor: colors.hoverBg }}
            >
              <MdKeyboardArrowLeft /> Back
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConfirmDelete(true)}
                className="rounded-full px-[16px] py-[7px] flex items-center gap-2 cursor-pointer font-medium text-sm transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#ef444420", color: "#ef4444", border: "1px solid #ef444440" }}
              >
                <MdDelete /> Delete
              </button>
              <button
                onClick={() => toggleEdit(true)}
                className="rounded-full px-[16px] py-[7px] flex items-center gap-2 cursor-pointer font-medium text-sm transition-opacity hover:opacity-80"
                style={{ backgroundColor: colors.accent, color: "#000" }}
              >
                <MdEdit /> Edit
              </button>
            </div>
          </div>
        </div>

        {/* Right: Blog Image */}
        <div className="w-full lg:w-[280px] xl:w-[300px] shrink-0">
          <div
            className="rounded-2xl px-3 py-3"
            style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}
          >
            <p
              className="font-bold text-[16px] mb-2 pb-2 border-b"
              style={{ color: colors.textPrimary, borderColor: colors.cardBorder }}
            >
              Blog Image
            </p>
            <div
              className="rounded-lg overflow-hidden flex justify-center"
              style={{ border: `1px solid ${colors.cardBorder}` }}
            >
              {blog?.primaryImage ? (
                <Image
                  src={blog.primaryImage}
                  alt={title}
                  width={296}
                  height={200}
                  className="object-cover w-full"
                />
              ) : (
                <div
                  className="w-full h-[200px] flex items-center justify-center"
                  style={{ backgroundColor: colors.hoverBg }}
                >
                  <BookOpen className="w-12 h-12" style={{ color: colors.textSecondary }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="rounded-2xl p-6 w-[320px] shadow-xl"
            style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}
          >
            <p className="text-base font-bold mb-2" style={{ color: colors.textPrimary }}>Delete Blog?</p>
            <p className="text-sm mb-5" style={{ color: colors.textSecondary }}>
              Are you sure you want to delete <strong>{title}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-full px-4 py-2 text-sm font-medium border transition-opacity hover:opacity-80"
                style={{ borderColor: colors.cardBorder, color: colors.textPrimary, backgroundColor: colors.hoverBg }}
              >
                Cancel
              </button>
              <button
                disabled={deleteMutation.isPending}
                onClick={() => {
                  deleteMutation.mutate(blog?.id ?? id, {
                    onSuccess: () => router.push("/blog"),
                  });
                }}
                className="rounded-full px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
                style={{ backgroundColor: "#ef4444", color: "#fff" }}
              >
                {deleteMutation.isPending ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
