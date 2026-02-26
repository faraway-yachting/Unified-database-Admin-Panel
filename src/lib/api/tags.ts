import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { config } from "../../../config";

const tagsKeys = {
  all: ["tags"] as const,
  list: () => [...tagsKeys.all, "list"] as const,
};

export interface TagOption {
  _id: string;
  Name: string;
}

async function fetchTagsApi(): Promise<{ tags: TagOption[] }> {
  const { data } = await axios.get(config.api.tags.list, {
    withCredentials: true,
  });
  const raw = data?.data ?? data;
  const tags = Array.isArray(raw?.tags) ? raw.tags : Array.isArray(raw) ? raw : [];
  return { tags };
}

/** Used by Yacht add/edit forms to populate the tags dropdown. */
export function useTagsQuery() {
  return useQuery({
    queryKey: tagsKeys.list(),
    queryFn: fetchTagsApi,
    staleTime: 2 * 60 * 1000,
  });
}
