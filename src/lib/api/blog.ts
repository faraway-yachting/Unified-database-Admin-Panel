import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { config } from "../../../config";

export interface Blog {
  _id?: string;
  title?: string;
  slug?: string;
  shortDescription?: string;
  detailDescription?: string;
  image?: File | string;
  status?: "draft" | "published";
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogResponse {
  blogs: Blog[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface AddBlogPayload {
  title: string;
  slug: string;
  status: string;
  shortDescription: string;
  detailDescription: string;
  image?: File;
}

export const blogKeys = {
  all: ["blog"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  list: (page: number, limit: number) =>
    [...blogKeys.lists(), page, limit] as const,
  details: () => [...blogKeys.all, "detail"] as const,
  detail: (id: string) => [...blogKeys.details(), id] as const,
};

async function getBlogsApi(
  page: number,
  limit: number
): Promise<BlogResponse> {
  const { data } = await apiClient.get(
    `${config.api.blog.list}?page=${page}&limit=${limit}`
  );
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data.data;
}

async function getBlogByIdApi(blogId: string): Promise<Blog> {
  const { data } = await apiClient.get(config.api.blog.byId(blogId));
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data.data;
}

async function addBlogApi(payload: AddBlogPayload) {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("slug", payload.slug);
  formData.append("status", payload.status);
  formData.append("shortDescription", payload.shortDescription);
  formData.append("detailDescription", payload.detailDescription);
  if (payload.image) {
    formData.append("image", payload.image);
  }
  const { data } = await apiClient.post(config.api.blog.create, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

async function updateBlogApi({
  blogId,
  data: updateData,
}: {
  blogId: string;
  data: Partial<Blog> & { image?: File | string };
}) {
  const formData = new FormData();
  Object.entries(updateData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (key === "image" && value && typeof value === "object" && "name" in value) {
        formData.append("image", value as File);
      } else if (typeof value === "string" && value.trim() !== "") {
        formData.append(key, value.trim());
      } else if (typeof value !== "string") {
        formData.append(key, String(value));
      }
    }
  });
  if (formData.entries().next().done) {
    throw new Error("No valid data to update");
  }
  const { data } = await apiClient.put(config.api.blog.update(blogId), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

async function deleteBlogApi(blogId: string) {
  await apiClient.delete(config.api.blog.delete(blogId));
  return { message: "ok" };
}

async function publishBlogApi({
  blogId,
  status,
}: {
  blogId: string;
  status: "draft" | "published";
}) {
  const { data } = await apiClient.patch(
    config.api.blog.updateStatus(blogId),
    { status },
    { headers: { "Content-Type": "application/json" } }
  );
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data?.data ?? data;
}

export function useBlogsQuery(page: number, limit: number) {
  return useQuery({
    queryKey: blogKeys.list(page, limit),
    queryFn: () => getBlogsApi(page, limit),
  });
}

export function useBlogByIdQuery(blogId: string | null) {
  return useQuery({
    queryKey: blogKeys.detail(blogId ?? ""),
    queryFn: () => getBlogByIdApi(blogId!),
    enabled: !!blogId,
  });
}

export function useAddBlogMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addBlogApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
}

export function useUpdateBlogMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBlogApi,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: blogKeys.detail(variables.blogId),
      });
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

export function usePublishBlogMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publishBlogApi,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: blogKeys.detail(variables.blogId),
      });
    },
  });
}
