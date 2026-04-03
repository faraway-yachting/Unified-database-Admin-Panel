import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { config } from "../../../config";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BlogTranslation {
  id: string;
  blogId: string;
  locale: string;
  title?: string | null;
  shortDescription?: string | null;
  detailedDescription?: string | null;
}

export interface BlogRegionVisibility {
  regionId: string;
  region: { id: string; name: string; slug: string };
}

export interface BlogItem {
  id: string;
  slug: string;
  title?: string | null;
  shortDescription?: string | null;
  detailedDescription?: string | null;
  primaryImage?: string | null;
  status: "draft" | "published";
  createdAt?: string;
  updatedAt?: string;
  translations?: BlogTranslation[];
  regionVisibility?: BlogRegionVisibility[];
}

export interface BlogListResponse {
  blogs: BlogItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateBlogPayload {
  slug: string;
  title: string;
  regionIds?: string[];
  shortDescription?: string;
  detailedDescription?: string;
  primaryImage?: File | null;
  locale?: string;
}

export interface UpdateBlogPayload extends Partial<CreateBlogPayload> {
  locale?: string;
}

// ─── Query Keys ───────────────────────────────────────────────────────────────

const blogKeys = {
  all: ["blogs"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  list: (page: number, limit: number) => [...blogKeys.lists(), page, limit] as const,
  details: () => [...blogKeys.all, "detail"] as const,
  detail: (id: string) => [...blogKeys.details(), id] as const,
};

// ─── API Functions ────────────────────────────────────────────────────────────

async function fetchBlogsApi(
  page: number,
  limit: number
): Promise<{ blogs: BlogItem[]; total: number; totalPages: number; currentPage: number }> {
  const { data } = await apiClient.get(
    `${config.api.blog.list}?page=${page}&limit=${limit}&includeTranslations=true`
  );
  if (data?.error) throw new Error(data?.error?.message || "Something went wrong");
  // Support both array and paginated object responses
  if (Array.isArray(data)) {
    return { blogs: data, total: data.length, totalPages: 1, currentPage: 1 };
  }
  const raw = data?.data ?? data;
  const blogs: BlogItem[] = Array.isArray(raw?.blogs)
    ? raw.blogs
    : Array.isArray(raw)
    ? raw
    : [];
  return {
    blogs,
    total: raw?.total ?? blogs.length,
    totalPages: raw?.totalPages ?? 1,
    currentPage: raw?.page ?? page,
  };
}

async function fetchBlogByIdApi(id: string): Promise<{ blog: BlogItem }> {
  const { data } = await apiClient.get(
    `${config.api.blog.byId(id)}?includeTranslations=true`
  );
  if (data?.error) throw new Error(data?.error?.message || "Something went wrong");
  const raw = data?.data ?? data;
  return { blog: raw };
}

async function createBlogApi(payload: CreateBlogPayload) {
  const form = new FormData();
  form.append("slug", payload.slug);
  form.append("title", payload.title);
  if (payload.regionIds) {
    payload.regionIds.forEach((id) => form.append("region_ids", id));
  }
  if (payload.shortDescription) form.append("short_description", payload.shortDescription);
  if (payload.detailedDescription) form.append("detailed_description", payload.detailedDescription);
  if (payload.locale) form.append("locale", payload.locale);
  if (payload.primaryImage instanceof File) form.append("primary_image", payload.primaryImage);

  const { data } = await apiClient.post(config.api.blog.create, form);
  if (data?.error) throw new Error(data?.error?.message || "Something went wrong");
  return data?.data ?? data;
}

async function updateBlogApi({ id, payload }: { id: string; payload: UpdateBlogPayload }) {
  const form = new FormData();
  if (payload.slug !== undefined) form.append("slug", payload.slug);
  if (payload.title !== undefined) form.append("title", payload.title);
  if (payload.regionIds !== undefined) {
    payload.regionIds.forEach((id) => form.append("region_ids", id));
    if (payload.regionIds.length === 0) form.append("region_ids", "");
  }
  if (payload.shortDescription !== undefined)
    form.append("short_description", payload.shortDescription);
  if (payload.detailedDescription !== undefined)
    form.append("detailed_description", payload.detailedDescription);
  if (payload.locale) form.append("locale", payload.locale);
  if (payload.primaryImage instanceof File) form.append("primary_image", payload.primaryImage);

  const { data } = await apiClient.patch(config.api.blog.update(id), form);
  if (data?.error) throw new Error(data?.error?.message || "Something went wrong");
  return data?.data ?? data;
}

export async function uploadBlogContentImageApi(id: string, file: File): Promise<string> {
  const form = new FormData();
  form.append("image", file);
  const { data } = await apiClient.post(config.api.blog.uploadImage(id), form);
  if (data?.error) throw new Error(data?.error?.message || "Image upload failed");
  return (data?.url ?? data?.data?.url) as string;
}

async function deleteBlogApi(id: string) {
  const { data } = await apiClient.delete(config.api.blog.delete(id));
  if (data?.error) throw new Error(data?.error?.message || "Something went wrong");
  return data;
}

async function updateBlogStatusApi({ id, status }: { id: string; status: "draft" | "published" }) {
  const { data } = await apiClient.patch(config.api.blog.updateStatus(id), { status });
  if (data?.error) throw new Error(data?.error?.message || "Something went wrong");
  return data?.data ?? data;
}

async function fetchRegionBlogsApi(regionId: string): Promise<BlogItem[]> {
  const { data } = await apiClient.get(
    `${config.api.blog.list}?regionId=${regionId}&limit=100&includeTranslations=false`
  );
  if (data?.error) throw new Error(data?.error?.message || "Something went wrong");
  const raw = data?.data ?? data;
  if (Array.isArray(raw)) return raw;
  return Array.isArray(raw?.blogs) ? raw.blogs : [];
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useRegionBlogsQuery(regionId: string) {
  return useQuery({
    queryKey: [...blogKeys.all, "region", regionId] as const,
    queryFn: () => fetchRegionBlogsApi(regionId),
    enabled: !!regionId,
    staleTime: 60 * 1000,
  });
}

export function useBlogsQuery(page = 1, limit = 12) {
  return useQuery({
    queryKey: blogKeys.list(page, limit),
    queryFn: () => fetchBlogsApi(page, limit),
    staleTime: 60 * 1000,
  });
}

export function useBlogByIdQuery(id: string) {
  return useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: () => fetchBlogByIdApi(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export function useCreateBlogMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBlogApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
}

export function useUpdateBlogMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBlogApi,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
}

export function useDeleteBlogMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBlogApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
}

export function useUpdateBlogStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBlogStatusApi,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
}
