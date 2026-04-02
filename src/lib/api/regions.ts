import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  contactEmail?: string | null;
  contactPhone?: string | null;
  currencyCode?: string | null;
  languageCode?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  heroBannerUrl?: string | null;
  // count fields — backend may use any of these naming conventions
  yachtsCount?: number;
  yachtCount?: number;
  totalYachts?: number;
  packagesCount?: number;
  packageCount?: number;
  totalPackages?: number;
  _count?: { yachts?: number; packages?: number; packageRegionVisibility?: number };
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

// --- Region Yachts ---

export interface RegionYacht {
  id: string;
  name: string;
  boatType?: string;
  status?: string;
  primaryImage?: string | null;
  images?: { url?: string; imageUrl?: string; isPrimary?: boolean; isCover?: boolean }[];
}

async function fetchRegionYachtsApi(regionId: string): Promise<RegionYacht[]> {
  const { data } = await apiClient.get(config.api.regions.yachts(regionId));
  const raw = data?.data ?? data;
  return Array.isArray(raw) ? raw : Array.isArray(raw?.yachts) ? raw.yachts : [];
}

export function useRegionYachtsQuery(regionId: string | null) {
  return useQuery({
    queryKey: [...regionsKeys.detail(regionId ?? ""), "yachts"],
    queryFn: () => fetchRegionYachtsApi(regionId!),
    enabled: !!regionId,
    retry: false,
    staleTime: 30 * 1000,
  });
}

export async function assignYachtToRegionApi(regionId: string, yachtId: string) {
  const { data } = await apiClient.post(config.api.regions.assignYacht(regionId), { yachtId });
  if (data?.error) throw new Error(data?.error?.message || "Something went wrong");
  return data;
}

export async function removeYachtFromRegionApi(regionId: string, yachtId: string) {
  const { data } = await apiClient.delete(`${config.api.regions.yachts(regionId)}/${yachtId}`);
  if (data?.error) throw new Error(data?.error?.message || "Something went wrong");
  return data;
}

export function useAssignYachtMutation(regionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (yachtId: string) => assignYachtToRegionApi(regionId, yachtId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...regionsKeys.detail(regionId), "yachts"] });
    },
  });
}

export function useRemoveYachtMutation(regionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (yachtId: string) => removeYachtFromRegionApi(regionId, yachtId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...regionsKeys.detail(regionId), "yachts"] });
    },
  });
}

// --- Region Packages ---

export interface RegionPackage {
  id: string;
  name?: string;
  title?: string;
  duration?: string;
  price?: number;
  basePrice?: number;
  visible?: boolean;
  status?: string;
}

async function fetchRegionPackagesApi(regionId: string): Promise<RegionPackage[]> {
  const { data } = await apiClient.get(config.api.regions.packages(regionId));
  const raw = data?.data ?? data;
  return Array.isArray(raw) ? raw : Array.isArray(raw?.packages) ? raw.packages : [];
}

export function useRegionPackagesQuery(regionId: string | null) {
  return useQuery({
    queryKey: [...regionsKeys.detail(regionId ?? ""), "packages"],
    queryFn: () => fetchRegionPackagesApi(regionId!),
    enabled: !!regionId,
    retry: false,
    staleTime: 30 * 1000,
  });
}

export async function removePackageFromRegionApi(regionId: string, packageId: string) {
  const { data } = await apiClient.delete(config.api.regions.removePackage(regionId, packageId));
  if (data?.error) throw new Error(data?.error?.message || "Something went wrong");
  return data;
}

export function useRemovePackageMutation(regionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (packageId: string) => removePackageFromRegionApi(regionId, packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...regionsKeys.detail(regionId), "packages"] });
    },
  });
}

// ---

// --- Audit Logs (Recent Activity) ---

export interface AuditLogItem {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  admin?: { name?: string; email?: string };
  region?: { name?: string };
  user?: { name?: string; email?: string };
}

export interface AuditLogsResponse {
  logs: AuditLogItem[];
  total?: number;
}

async function fetchAuditLogsApi(): Promise<AuditLogsResponse> {
  const { data } = await apiClient.get(config.api.settings.auditLogs.list);
  const raw = data?.data ?? data;
  if (Array.isArray(raw)) {
    return { logs: raw, total: raw.length };
  }
  return raw as AuditLogsResponse;
}

export function useAuditLogsQuery() {
  return useQuery({
    queryKey: ["auditLogs"],
    queryFn: fetchAuditLogsApi,
    staleTime: 60 * 1000,
  });
}

export async function deleteRegion(regionId: string) {
  const { data } = await apiClient.delete(config.api.regions.delete(regionId));
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export interface CreateRegionPayload {
  name: string;
  siteUrl?: string;
  country: string;
  currencyCode?: string;
  languageCode?: string;
  contactEmail?: string;
  contactPhone?: string;
  metaTitle?: string;
  metaDescription?: string;
  status?: "live" | "draft";
}

async function createRegionApi(payload: CreateRegionPayload): Promise<RegionListItem> {
  const { data } = await apiClient.post(config.api.regions.create, payload);
  if (data?.error) throw new Error(data?.error?.message || "Something went wrong");
  return (data?.data ?? data) as RegionListItem;
}

export function useCreateRegionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRegionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: regionsKeys.list() });
    },
  });
}

export interface UpdateRegionPayload {
  name?: string;
  siteUrl?: string;
  country?: string;
  status?: "live" | "draft";
  contactEmail?: string;
  contactPhone?: string;
  currencyCode?: string;
  languageCode?: string;
  metaTitle?: string;
  metaDescription?: string;
  heroBannerImage?: File;
}

async function updateRegionApi({ id, payload }: { id: string; payload: UpdateRegionPayload }): Promise<RegionListItem> {
  const hasFile = payload.heroBannerImage instanceof File;

  let body: FormData | Record<string, unknown>;
  let headers: Record<string, string> = {};

  if (hasFile) {
    const form = new FormData();
    for (const [key, value] of Object.entries(payload)) {
      if (value === undefined || value === null) continue;
      if (value instanceof File) form.append(key, value);
      else form.append(key, String(value));
    }
    body = form;
  } else {
    const json: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(payload)) {
      if (value === undefined || value === null) continue;
      json[key] = value;
    }
    body = json;
    headers = { "Content-Type": "application/json" };
  }

  const { data } = await apiClient.patch(config.api.regions.update(id), body, { headers });
  if (data?.error) throw new Error(data?.error?.message || "Something went wrong");
  return (data?.data ?? data) as RegionListItem;
}

export function useUpdateRegionMutation(regionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateRegionPayload) => updateRegionApi({ id: regionId, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: regionsKeys.list() });
      queryClient.invalidateQueries({ queryKey: regionsKeys.detail(regionId) });
    },
  });
}
