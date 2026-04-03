"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MdDelete } from "react-icons/md";
import { BookOpen, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import {
  useBlogsQuery,
  useDeleteBlogMutation,
  type BlogItem,
  type BlogTranslation,
} from "@/lib/api/blog";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PAGE_SIZE = 9;

function getBlogTitle(blog: BlogItem): string {
  const enTr = blog.translations?.find((t: BlogTranslation) => t.locale === "en");
  return enTr?.title ?? blog.title ?? blog.slug ?? "Untitled";
}

function getBlogExcerpt(blog: BlogItem): string {
  const enTr = blog.translations?.find((t: BlogTranslation) => t.locale === "en");
  const raw = enTr?.shortDescription ?? blog.shortDescription ?? "";
  return raw.length > 120 ? raw.slice(0, 120) + "…" : raw;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

function truncateSlug(slug: string, max = 28): string {
  return slug.length > max ? slug.slice(0, max) + "…" : slug;
}

export default function BlogList() {
  const router = useRouter();
  const { colors } = useTheme();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useBlogsQuery(page, PAGE_SIZE);
  const deleteMutation = useDeleteBlogMutation();

  const blogs: BlogItem[] = data?.blogs ?? [];
  const totalPages = data?.totalPages ?? 1;

  const filtered = search.trim()
    ? blogs.filter((b) =>
        getBlogTitle(b).toLowerCase().includes(search.toLowerCase()) ||
        b.slug.toLowerCase().includes(search.toLowerCase())
      )
    : blogs;

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Blog deleted");
        setConfirmDeleteId(null);
      },
      onError: (err) => {
        toast.error((err as Error)?.message ?? "Failed to delete blog");
        setConfirmDeleteId(null);
      },
    });
  };

  return (
    <div className="w-full" style={{ backgroundColor: colors.background }}>
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-[280px]">
          <input
            type="text"
            placeholder="Search blogs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full text-sm outline-none border"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.cardBorder,
              color: colors.textPrimary,
            }}
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: colors.textSecondary }}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
        <button
          onClick={() => router.push("/blog/add")}
          className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-80 shrink-0"
          style={{ backgroundColor: colors.accent, color: "#000" }}
        >
          <Plus className="w-4 h-4" />
          Add New Blog
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center h-[300px]">
          <div
            className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: colors.accent }}
          />
        </div>
      )}

      {/* Empty */}
      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[300px] gap-3">
          <BookOpen className="w-12 h-12" style={{ color: colors.textSecondary }} />
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            {search ? "No blogs match your search." : "No blogs yet. Add your first one!"}
          </p>
        </div>
      )}

      {/* Cards Grid */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((blog) => {
            const title = getBlogTitle(blog);
            const excerpt = getBlogExcerpt(blog);

            return (
              <div
                key={blog.id}
                className="rounded-2xl overflow-hidden flex flex-col cursor-pointer group transition-shadow hover:shadow-lg"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.cardBorder}`,
                }}
              >
                {/* Image */}
                <div
                  className="relative w-full"
                  style={{ height: 200 }}
                  onClick={() => router.push(`/blog/${blog.id}`)}
                >
                  {blog.primaryImage ? (
                    <Image
                      src={blog.primaryImage}
                      alt={title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: colors.hoverBg }}
                    >
                      <BookOpen className="w-12 h-12" style={{ color: colors.textSecondary }} />
                    </div>
                  )}

                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 py-3"
                    style={{ background: "linear-gradient(transparent, rgba(10,20,40,0.85))" }}>
                    <p className="text-white font-bold text-sm leading-tight line-clamp-2">
                      {title.length > 40 ? title.slice(0, 40) + "…" : title}
                    </p>
                  </div>

                  {/* Delete button */}
                  <button
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full transition-opacity hover:opacity-80 z-10"
                    style={{ backgroundColor: colors.accent, color: "#000" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDeleteId(blog.id);
                    }}
                    title="Delete blog"
                  >
                    <MdDelete className="w-4 h-4" />
                  </button>
                </div>

                {/* Body */}
                <div
                  className="px-4 pt-3 pb-2 flex-1 flex flex-col"
                  onClick={() => router.push(`/blog/${blog.id}`)}
                >
                  <div className="flex items-center gap-2 mb-2 text-xs" style={{ color: colors.textSecondary }}>
                    <span>
                      <span className="font-semibold">Slug:</span>{" "}
                      {truncateSlug(blog.slug)}
                    </span>
                    <span className="mx-1">•</span>
                    <span>
                      <span className="font-semibold">Created:</span>{" "}
                      {formatDate(blog.createdAt)}
                    </span>
                  </div>
                  {excerpt && (
                    <p className="text-sm leading-relaxed line-clamp-3" style={{ color: colors.textSecondary }}>
                      {excerpt}
                    </p>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{ borderColor: colors.cardBorder, color: colors.textPrimary, backgroundColor: colors.cardBg }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{ borderColor: colors.cardBorder, color: colors.textPrimary, backgroundColor: colors.cardBg }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div
            className="rounded-2xl p-6 w-[320px] shadow-xl"
            style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}
          >
            <p className="text-base font-bold mb-2" style={{ color: colors.textPrimary }}>Delete Blog?</p>
            <p className="text-sm mb-5" style={{ color: colors.textSecondary }}>
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="rounded-full px-4 py-2 text-sm font-medium border transition-opacity hover:opacity-80"
                style={{ borderColor: colors.cardBorder, color: colors.textPrimary, backgroundColor: colors.hoverBg }}
              >
                Cancel
              </button>
              <button
                disabled={deleteMutation.isPending}
                onClick={() => handleDelete(confirmDeleteId)}
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
