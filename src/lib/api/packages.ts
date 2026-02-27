import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { config } from "../../../config";

export interface PackageListItemCurrency {
  code: string;
  name?: string;
  symbol?: string | null;
}

export interface PackageListItemYacht {
  id: string;
  name: string;
  type?: string | null;
}

export interface PackageListItem {
  id: string;
  name: string;
  description?: string | null;
  yachtId?: string | null;
  yachtCategory?: string | null;
  durationType: string;
  durationHours?: number | string | null;
  durationDays?: number | null;
  basePrice: number | string;
  currencyCode: string;
  status: string;
  currency?: PackageListItemCurrency;
  yacht?: PackageListItemYacht | null;
}

export interface PackageDetailRegionVisibility {
  id: string;
  isVisible: boolean;
  sortOrder: number;
  region: {
    id: string;
    name: string;
    slug?: string | null;
  };
}

export interface PackageDetailIncludedService {
  id: string;
  serviceName: string;
  isIncluded: boolean;
  notes?: string | null;
}

export interface PackageDetailAddon {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  priceType: string;
  isActive: boolean;
  sortOrder: number;
}

export interface PackageDetailMedia {
  id: string;
  mediaType: string;
  url: string;
  caption?: string | null;
  isCover: boolean;
  sortOrder: number;
}

export interface PackageDetail {
  id: string;
  name: string;
  description?: string | null;
  yachtId?: string | null;
  yachtCategory?: string | null;
  durationType: string;
  durationHours?: number | string | null;
  durationDays?: number | null;
  basePrice: number | string;
  currencyCode: string;
  maxCapacity?: number | null;
  status: string;
  isFeatured?: boolean;
  sortOrder?: number;
  currency?: PackageListItemCurrency;
  yacht?: PackageListItemYacht | null;
  regionVisibility?: PackageDetailRegionVisibility[];
  includedServices?: PackageDetailIncludedService[];
  addons?: PackageDetailAddon[];
  media?: PackageDetailMedia[];
}

export interface PackagesListResponse {
  packages: PackageListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PackagesListFilters {
  regionId?: string;
  durationType?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface CreatePackagePayload {
  name: string;
  description?: string;
  yachtId?: string;
  yachtCategory?: string;
  durationType: string;
  durationHours?: number;
  durationDays?: number;
  basePrice: number;
  currencyCode: string;
  maxCapacity?: number;
  status?: string;
  isFeatured?: boolean;
  sortOrder?: number;
  media?: File[];
}

export interface UpdatePackagePayload {
  id: string;
  name?: string;
  description?: string;
  yachtId?: string | null;
  yachtCategory?: string | null;
  durationType?: string;
  durationHours?: number | null;
  durationDays?: number | null;
  basePrice?: number;
  currencyCode?: string;
  maxCapacity?: number | null;
  status?: string;
  isFeatured?: boolean;
  sortOrder?: number;
}

export interface UpdateRegionVisibilityPayload {
  regions: Array<{
    regionId: string;
    isVisible?: boolean;
    sortOrder?: number;
  }>;
}

export interface AddIncludedServicePayload {
  serviceName: string;
  isIncluded?: boolean;
  notes?: string;
}

export interface UpdateIncludedServicePayload {
  serviceName?: string;
  isIncluded?: boolean;
  notes?: string;
}

export interface CreateAddonPayload {
  name: string;
  description?: string;
  price: number;
  priceType?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateAddonPayload {
  name?: string;
  description?: string;
  price?: number;
  priceType?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export const packagesKeys = {
  all: ["packages"] as const,
  lists: () => [...packagesKeys.all, "list"] as const,
  list: (page: number, limit: number, filters?: PackagesListFilters) =>
    [...packagesKeys.lists(), page, limit, filters ?? {}] as const,
  details: () => [...packagesKeys.all, "detail"] as const,
  detail: (id: string) => [...packagesKeys.details(), id] as const,
};

function buildListParams(page: number, limit: number, filters?: PackagesListFilters): string {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (filters?.regionId) params.set("region", filters.regionId);
  if (filters?.durationType) params.set("durationType", filters.durationType);
  if (filters?.status) params.set("status", filters.status);
  if (filters?.minPrice != null) params.set("minPrice", String(filters.minPrice));
  if (filters?.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
  return params.toString();
}

async function getPackagesApi(
  page: number,
  limit: number,
  filters?: PackagesListFilters
): Promise<PackagesListResponse> {
  const query = buildListParams(page, limit, filters);
  const { data } = await apiClient.get(`${config.api.packages.list}?${query}`);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data as PackagesListResponse;
}

async function getPackageDetailApi(packageId: string): Promise<PackageDetail> {
  const { data } = await apiClient.get(config.api.packages.byId(packageId));
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data as PackageDetail;
}

export function usePackagesQuery(page: number, limit: number, filters?: PackagesListFilters) {
  return useQuery({
    queryKey: packagesKeys.list(page, limit, filters),
    queryFn: () => getPackagesApi(page, limit, filters),
  });
}

export function usePackageDetailQuery(packageId: string | null) {
  return useQuery({
    queryKey: packagesKeys.detail(packageId ?? ""),
    queryFn: () => getPackageDetailApi(packageId!),
    enabled: !!packageId,
  });
}

async function createPackageApi(payload: CreatePackagePayload) {
  const formData = new FormData();
  formData.append("name", payload.name);
  if (payload.description) formData.append("description", payload.description);
  if (payload.yachtId) formData.append("yachtId", payload.yachtId);
  if (payload.yachtCategory) formData.append("yachtCategory", payload.yachtCategory);
  formData.append("durationType", payload.durationType);
  if (payload.durationHours != null) formData.append("durationHours", String(payload.durationHours));
  if (payload.durationDays != null) formData.append("durationDays", String(payload.durationDays));
  formData.append("basePrice", String(payload.basePrice));
  formData.append("currencyCode", payload.currencyCode);
  if (payload.maxCapacity != null) formData.append("maxCapacity", String(payload.maxCapacity));
  if (payload.status) formData.append("status", payload.status);
  if (payload.isFeatured != null) formData.append("isFeatured", String(payload.isFeatured));
  if (payload.sortOrder != null) formData.append("sortOrder", String(payload.sortOrder));
  if (payload.media?.length) {
    payload.media.forEach((file) => formData.append("media", file));
  }

  const { data } = await apiClient.post(config.api.packages.create, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export function useCreatePackageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPackageApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: packagesKeys.lists() });
    },
  });
}

async function updatePackageApi(payload: UpdatePackagePayload) {
  const { id, ...body } = payload;
  const { data } = await apiClient.patch(config.api.packages.update(id), body, {
    headers: { "Content-Type": "application/json" },
  });
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export function useUpdatePackageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePackageApi,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: packagesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: packagesKeys.detail(variables.id) });
    },
  });
}

export async function updatePackageRegions(packageId: string, payload: UpdateRegionVisibilityPayload) {
  const { data } = await apiClient.patch(config.api.packages.updateRegions(packageId), payload, {
    headers: { "Content-Type": "application/json" },
  });
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export async function addIncludedService(packageId: string, payload: AddIncludedServicePayload) {
  const { data } = await apiClient.post(config.api.packages.addService(packageId), payload, {
    headers: { "Content-Type": "application/json" },
  });
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export async function updateIncludedService(
  packageId: string,
  serviceId: string,
  payload: UpdateIncludedServicePayload
) {
  const { data } = await apiClient.patch(config.api.packages.service(packageId, serviceId), payload, {
    headers: { "Content-Type": "application/json" },
  });
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export async function removeIncludedService(packageId: string, serviceId: string) {
  const { data } = await apiClient.delete(config.api.packages.service(packageId, serviceId));
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export async function createAddon(packageId: string, payload: CreateAddonPayload) {
  const { data } = await apiClient.post(config.api.packages.createAddon(packageId), payload, {
    headers: { "Content-Type": "application/json" },
  });
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export async function updateAddon(packageId: string, addonId: string, payload: UpdateAddonPayload) {
  const { data } = await apiClient.patch(config.api.packages.addon(packageId, addonId), payload, {
    headers: { "Content-Type": "application/json" },
  });
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export async function deleteAddon(packageId: string, addonId: string) {
  const { data } = await apiClient.delete(config.api.packages.addon(packageId, addonId));
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export async function uploadPackageMedia(packageId: string, files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("media", file));
  const { data } = await apiClient.post(config.api.packages.uploadMedia(packageId), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export async function deletePackageMedia(packageId: string, mediaId: string) {
  const { data } = await apiClient.delete(config.api.packages.mediaItem(packageId, mediaId));
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export async function deletePackage(packageId: string) {
  const { data } = await apiClient.delete(config.api.packages.delete(packageId));
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

