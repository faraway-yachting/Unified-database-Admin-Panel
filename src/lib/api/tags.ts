import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { config } from "../../../config";

export interface AddTagsPayload {
  name: string;
  slug: string;
  description: string;
}

export interface TagsApiResponse {
  _id: string;
  Name: string;
  Slug: string;
  Description: string;
}

export const tagsKeys = {
  all: ["tags"] as const,
  lists: () => [...tagsKeys.all, "list"] as const,
  list: (params?: { page?: number; limit?: number }) =>
    [...tagsKeys.lists(), params] as const,
  details: () => [...tagsKeys.all, "detail"] as const,
  detail: (id: string) => [...tagsKeys.details(), id] as const,
};

export interface TagsResponse {
  tags: TagsApiResponse[];
  total: number;
  totalPages: number;
  currentPage: number;
}

async function getTagsApi(
  params?: { page?: number; limit?: number }
): Promise<TagsResponse> {
  let url = config.api.tags.list;
  if (params && (params.page || params.limit)) {
    const search = new URLSearchParams();
    if (params.page) search.append("page", String(params.page));
    if (params.limit) search.append("limit", String(params.limit));
    url += `?${search.toString()}`;
  }
  const { data } = await apiClient.get(url);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data.data;
}

async function getTagByIdApi(tagId: string): Promise<{ tags: TagsApiResponse }> {
  const { data } = await apiClient.get(config.api.tags.byId(tagId));
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return { tags: data.data };
}

async function addTagApi(payload: AddTagsPayload) {
  const { data } = await apiClient.post(config.api.tags.create, payload);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

async function updateTagApi({
  payload,
  tagsId,
}: {
  payload: AddTagsPayload;
  tagsId: string;
}) {
  const { data } = await apiClient.put(
    config.api.tags.update(tagsId),
    payload
  );
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data.data;
}

async function deleteTagApi(id: string): Promise<{ success: boolean; id: string }> {
  await apiClient.delete(config.api.tags.delete(id));
  return { success: true, id };
}

export function useTagsQuery(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: tagsKeys.list(params),
    queryFn: () => getTagsApi(params),
  });
}

export function useTagByIdQuery(tagId: string | null) {
  return useQuery({
    queryKey: tagsKeys.detail(tagId ?? ""),
    queryFn: () => getTagByIdApi(tagId!),
    enabled: !!tagId,
  });
}

export function useAddTagMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addTagApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagsKeys.lists() });
    },
  });
}

export function useUpdateTagMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTagApi,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: tagsKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: tagsKeys.detail(variables.tagsId),
      });
    },
  });
}

export function useDeleteTagMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTagApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagsKeys.lists() });
    },
  });
}
