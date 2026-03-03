import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { config } from "../../../config";

const regionsKeys = {
  all: ["regions"] as const,
  list: () => [...regionsKeys.all, "list"] as const,
  detail: (id: string) => [...regionsKeys.all, "detail", id] as const,
  performance: () => [...regionsKeys.all, "performance"] as const,
};

export interface RegionOption {
  id: string;
  name: string;
}

export interface RegionListItem {
  id: string;
  name: string;
  slug?: string;
  siteUrl?: string | null;
  country?: string;
  status?: "live" | "draft" | string;
  updatedAt?: string;
  createdAt?: string;
}

export interface RegionsListResponse {
  regions: RegionListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RegionPerformanceItem {
  regionId: string;
  name: string;
  revenue: number;
  bookings: number;
}

export interface RegionPerformanceResponse {
  regions: RegionPerformanceItem[];
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

async function fetchRegionsListApi(): Promise<RegionsListResponse> {
  const { data } = await apiClient.get(config.api.regions.list);
  const raw = data?.data ?? data;
  if (Array.isArray(raw)) {
    return {
      regions: raw,
      total: raw.length,
      page: 1,
      limit: raw.length,
      totalPages: 1,
    } as RegionsListResponse;
  }
  return raw as RegionsListResponse;
}

async function getRegionByIdApi(regionId: string): Promise<RegionListItem> {
  const { data } = await apiClient.get(config.api.regions.byId(regionId));
  const raw = data?.data ?? data;
  return raw as RegionListItem;
}

export function useRegionsQuery() {
  return useQuery({
    queryKey: regionsKeys.list(),
    queryFn: fetchRegionsApi,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRegionsListQuery() {
  return useQuery({
    queryKey: [...regionsKeys.list(), "full"],
    queryFn: fetchRegionsListApi,
  });
}

async function fetchRegionPerformanceApi(): Promise<RegionPerformanceResponse> {
  const { data } = await apiClient.get(config.api.regions.performance);
  const raw = data?.data ?? data;
  return raw as RegionPerformanceResponse;
}

export function useRegionPerformanceQuery() {
  return useQuery({
    queryKey: regionsKeys.performance(),
    queryFn: fetchRegionPerformanceApi,
  });
}

export function useRegionDetailQuery(regionId: string | null) {
  return useQuery({
    queryKey: regionsKeys.detail(regionId ?? ""),
    queryFn: () => getRegionByIdApi(regionId!),
    enabled: !!regionId,
  });
}

export async function deleteRegion(regionId: string) {
  const { data } = await apiClient.delete(config.api.regions.delete(regionId));
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}
