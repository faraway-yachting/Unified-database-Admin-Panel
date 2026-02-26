import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { config } from "../../../config";

const regionsKeys = {
  all: ["regions"] as const,
  list: () => [...regionsKeys.all, "list"] as const,
};

export interface RegionOption {
  id: string;
  name: string;
}

async function fetchRegionsApi(): Promise<RegionOption[]> {
  const { data } = await apiClient.get(config.api.regions.list);
  const raw = data?.data ?? data;
  const list = Array.isArray(raw) ? raw : Array.isArray(raw?.regions) ? raw.regions : [];
  return list.map((r: { id?: string; _id?: string; name?: string }) => ({
    id: r.id ?? r._id ?? "",
    name: r.name ?? "",
  }));
}

export function useRegionsQuery() {
  return useQuery({
    queryKey: regionsKeys.list(),
    queryFn: fetchRegionsApi,
    staleTime: 5 * 60 * 1000,
  });
}
