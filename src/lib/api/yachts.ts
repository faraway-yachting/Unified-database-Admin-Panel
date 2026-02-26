import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { config } from "../../../config";

// Backend list response shape (matches yachtService.listYachts)
export interface YachtListItemRegion {
  id: string;
  name: string;
  slug: string;
}

export interface YachtListItemCompany {
  id: string;
  name: string;
  logoUrl: string | null;
}

export interface YachtListItemImage {
  id: string;
  imageUrl: string;
  caption: string | null;
  isCover: boolean;
  sortOrder: number;
}

export interface YachtListItem {
  id: string;
  name: string;
  type: string;
  lengthM: number | string | null;
  capacityGuests: number;
  yearBuilt: number | null;
  status: string;
  isActive: boolean;
  regionId: string;
  companyId: string;
  region?: YachtListItemRegion;
  company?: YachtListItemCompany;
  images?: YachtListItemImage[];
}

export interface YachtsListResponse {
  yachts: YachtListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface YachtsListFilters {
  regionId?: string;
  type?: string;
  status?: string;
  minCapacity?: number;
  maxCapacity?: number;
  isActive?: boolean;
  includeCompany?: boolean;
  includeRegion?: boolean;
  includeImages?: boolean;
}

export interface AddYachtsPayload {
  boatType: string;
  price: string;
  capacity: string;
  length: string;
  lengthRange: string;
  cabins: string;
  bathrooms: string;
  passengerDayTrip: string;
  passengerOvernight: string;
  tags: string[];
  guests: string;
  guestsRange: string;
  dayTripPrice: string;
  overnightPrice: string;
  daytripPriceEuro: string;
  priceEditor?: string;
  tripDetailsEditor?: string;
  dayCharter?: string;
  overnightCharter?: string;
  aboutThisBoat?: string;
  specifications?: string;
  boatLayout?: string;
  videoLink?: string;
  videoLink2?: string;
  videoLink3?: string;
  badge?: string;
  slug: string;
  design: string;
  built: string;
  cruisingSpeed: string;
  lengthOverall: string;
  fuelCapacity: string;
  waterCapacity: string;
  code?: string;
  title: string;
  type: string;
  primaryImage: File;
  galleryImages: (File | string)[];
}

/** @deprecated Use YachtListItem for list. */
export interface YachtsApiResponse {
  _id: string;
  boatType: string;
  title: string;
  description: string;
  price: string;
  capacity: string;
  length: string;
  lengthRange: string;
  cabins: string;
  bathrooms: string;
  passengerDayTrip: string;
  passengerOvernight: string;
  guests: string;
  guestsRange: string;
  dayTripPrice: string;
  overnightPrice: string;
  daytripPriceEuro: string;
  primaryImage: string;
  galleryImages: string[];
  priceEditor?: string;
  tripDetailsEditor?: string;
  dayCharter?: string;
  overnightCharter?: string;
  aboutThisBoat?: string;
  specifications?: string;
  boatLayout?: string;
  videoLink?: string;
  videoLink2?: string;
  videoLink3?: string;
  badge?: string;
  slug: string;
  design: string;
  tags: string[];
  built: string;
  cruisingSpeed: string;
  lengthOverall: string;
  fuelCapacity: string;
  waterCapacity: string;
  type: string;
  code?: string;
  status: string;
  createdAt: string;
  __v: number;
}

export const yachtsKeys = {
  all: ["yachts"] as const,
  lists: () => [...yachtsKeys.all, "list"] as const,
  list: (page: number, limit: number, filters?: YachtsListFilters) =>
    [...yachtsKeys.lists(), page, limit, filters ?? {}] as const,
  details: () => [...yachtsKeys.all, "detail"] as const,
  detail: (id: string) => [...yachtsKeys.details(), id] as const,
};

export interface YachtsResponse {
  yachts: YachtListItem[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export const DEFAULT_YACHT_IMAGE =
  "https://images.unsplash.com/photo-1598555071897-42022f8bfca7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800";

function buildListParams(
  page: number,
  limit: number,
  filters?: YachtsListFilters
): string {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (filters?.regionId) params.set("regionId", filters.regionId);
  if (filters?.type) params.set("type", filters.type);
  if (filters?.status) params.set("status", filters.status);
  if (filters?.minCapacity != null) params.set("minCapacity", String(filters.minCapacity));
  if (filters?.maxCapacity != null) params.set("maxCapacity", String(filters.maxCapacity));
  if (filters?.isActive === true) params.set("isActive", "true");
  if (filters?.includeCompany === true) params.set("includeCompany", "true");
  if (filters?.includeRegion === true) params.set("includeRegion", "true");
  if (filters?.includeImages === true) params.set("includeImages", "true");
  return params.toString();
}

async function getYachtsApi(
  page: number,
  limit: number,
  filters?: YachtsListFilters
): Promise<YachtsResponse> {
  const query = buildListParams(page, limit, filters);
  const { data } = await apiClient.get(
    `${config.api.yachts.list}?${query}`
  );
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  const raw = data as YachtsListResponse;
  return {
    yachts: raw.yachts ?? [],
    total: raw.total ?? 0,
    totalPages: raw.totalPages ?? 0,
    currentPage: raw.page ?? 1,
  };
}

async function getYachtByIdApi(yachtId: string): Promise<{ yachts: YachtListItem }> {
  const { data } = await apiClient.get(config.api.yachts.byId(yachtId));
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  const raw = data as YachtListItem;
  return { yachts: raw };
}

async function addYachtApi(payload: AddYachtsPayload) {
  const { data } = await apiClient.post(config.api.yachts.create, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

async function updateYachtApi({
  payload,
  yachtsId,
}: {
  payload: AddYachtsPayload;
  yachtsId: string;
}) {
  const { data } = await apiClient.put(
    config.api.yachts.update(yachtsId),
    payload,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data.data;
}

async function deleteYachtApi(id: string): Promise<{ success: boolean; id: string }> {
  await apiClient.delete(config.api.yachts.delete(id));
  return { success: true, id };
}

async function publishYachtApi({
  yachtId,
  status,
}: {
  yachtId: string;
  status: string;
}) {
  const { data } = await apiClient.patch(
    config.api.yachts.status(yachtId),
    { status },
    { headers: { "Content-Type": "application/json" } }
  );
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data.data;
}

export function useYachtsQuery(
  page: number,
  limit: number,
  filters?: YachtsListFilters
) {
  return useQuery({
    queryKey: yachtsKeys.list(page, limit, filters),
    queryFn: () => getYachtsApi(page, limit, filters),
  });
}

export function useYachtByIdQuery(yachtId: string | null) {
  return useQuery({
    queryKey: yachtsKeys.detail(yachtId ?? ""),
    queryFn: () => getYachtByIdApi(yachtId!),
    enabled: !!yachtId,
  });
}

export function useAddYachtMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addYachtApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: yachtsKeys.lists() });
    },
  });
}

export function useUpdateYachtMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateYachtApi,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: yachtsKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: yachtsKeys.detail(variables.yachtsId),
      });
    },
  });
}

export function useDeleteYachtMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteYachtApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: yachtsKeys.lists() });
    },
  });
}

export function usePublishYachtMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publishYachtApi,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: yachtsKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: yachtsKeys.detail(variables.yachtId),
      });
    },
  });
}

/** Map backend type to display label (sailboat | motor | catamaran | gulet). */
export function yachtTypeToDisplay(type: string): string {
  const t = type?.toLowerCase() ?? "";
  if (t === "sailboat") return "Sailboat";
  if (t === "motor") return "Motor Yacht";
  if (t === "catamaran") return "Catamaran";
  if (t === "gulet") return "Gulet";
  return type || "Yacht";
}

/** Map backend status to display label. */
export function yachtStatusToDisplay(status: string): string {
  const s = status?.toLowerCase() ?? "";
  if (s === "available") return "Available";
  if (s === "booked") return "Booked";
  if (s === "maintenance") return "Maintenance";
  if (s === "retired") return "Retired";
  return status || "—";
}

/** Parse length from backend (may be number or Decimal string). */
export function parseLength(lengthM: number | string | null): number {
  if (lengthM == null) return 0;
  if (typeof lengthM === "number") return Math.round(lengthM);
  const n = parseFloat(String(lengthM));
  return Number.isFinite(n) ? Math.round(n) : 0;
}
