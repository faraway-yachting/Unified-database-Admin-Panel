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

export interface YachtDetailImage {
  id: string;
  imageUrl: string;
  caption: string | null;
  isCover: boolean;
  sortOrder: number;
}

export interface YachtDetailAmenity {
  id: string;
  category: string;
  name: string;
  isAvailable: boolean;
}

export interface YachtDetailDocument {
  id: string;
  documentType: string;
  documentUrl: string;
  issuedDate: string | null;
  expiryDate: string | null;
  isExpired: boolean;
  notes: string | null;
}

export interface YachtDetailBooking {
  id: string;
  bookingRef: string;
  startDate: string;
  endDate: string;
  guestCount: number;
  status: string;
  totalAmount: number | string;
  currencyCode: string;
}

export interface YachtDetailAvailabilityBlock {
  id: string;
  startDate: string;
  endDate: string;
  reason: string | null;
  notes: string | null;
}

export interface AddAmenityPayload {
  category: string;
  name: string;
  isAvailable?: boolean;
}

export interface AddDocumentPayload {
  file: File;
  documentType: string;
  issuedDate?: string;
  expiryDate?: string;
  notes?: string;
}

export interface AddAvailabilityBlockPayload {
  startDate: string;
  endDate: string;
  reason?: string;
  notes?: string;
}

export interface YachtDetail {
  id: string;
  name: string;
  type: string;
  lengthM: number | string | null;
  beamM: number | string | null;
  capacityGuests: number;
  capacityCrew: number | null;
  yearBuilt: number | null;
  engineType: string | null;
  engineHp: number | null;
  cruiseSpeedKnots: number | string | null;
  fuelCapacityL: number | null;
  homePort: string | null;
  status: string;
  region?: YachtListItemRegion;
  images?: YachtDetailImage[];
  amenities?: YachtDetailAmenity[];
  documents?: YachtDetailDocument[];
  bookings?: YachtDetailBooking[];
  availabilityBlocks?: YachtDetailAvailabilityBlock[];
}

export interface YachtGalleryImage {
  id: string;
  yachtId: string;
  imageUrl: string;
  isCover: boolean;
  sortOrder: number;
  caption?: string | null;
}

export interface YachtTag {
  id: string;
  yachtId: string;
  tag: string;
  locale?: string | null;
}

export interface YachtTranslation {
  id: string;
  yachtId: string;
  locale: string;
  title?: string | null;
  slug?: string | null;
  dayCharter?: string | null;
  overnightCharter?: string | null;
  aboutThisBoat?: string | null;
  specifications?: string | null;
  boatLayout?: string | null;
}

export interface YachtListItem {
  id: string;
  name: string;
  slug?: string | null;
  type: string;
  boatType?: string | null;
  charterType?: string | null;
  price?: string | null;
  capacity?: string | null;
  guestsRange?: string | null;
  lengthRange?: string | null;
  length?: string | null;
  cabins?: string | null;
  bathrooms?: string | null;
  passengerDayTrip?: string | null;
  passengerOvernight?: string | null;
  guests?: string | null;
  dayTripPrice?: string | null;
  overnightPrice?: string | null;
  daytripPriceEuro?: string | null;
  videoLink?: string | null;
  badge?: string | null;
  design?: string | null;
  built?: string | null;
  cruisingSpeed?: string | null;
  lengthOverall?: string | null;
  fuelCapacity?: string | null;
  waterCapacity?: string | null;
  code?: string | null;
  displayOrder?: number | null;
  primaryImage?: string | null;
  publicationStatus?: string | null;
  status: string;
  isActive: boolean;
  lengthM?: number | null;
  beamM?: number | null;
  capacityGuests?: number;
  capacityCrew?: number | null;
  yearBuilt?: number | null;
  engineType?: string | null;
  engineHp?: number | null;
  cruiseSpeedKnots?: number | null;
  fuelCapacityL?: number | null;
  homePort?: string | null;
  regionId?: string;
  companyId?: string;
  createdAt?: string;
  updatedAt?: string;
  images?: YachtGalleryImage[];
  tags?: YachtTag[];
  translations?: YachtTranslation[];
  region?: YachtListItemRegion;
  company?: YachtListItemCompany;
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
  includeTranslations?: boolean;
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
  displayOrder?: number | null;
  primaryImage: File;
  galleryImages: (File | string)[];
  locale?: string;
  regionId?: string;
}

export interface CreateYachtPayload {
  companyId: string;
  name: string;
  type: string;
  capacityGuests: number;
  regionId: string;
  lengthM?: number | null;
  beamM?: number | null;
  capacityCrew?: number | null;
  yearBuilt?: number | null;
  engineType?: string | null;
  engineHp?: number | null;
  cruiseSpeedKnots?: number | null;
  fuelCapacityL?: number | null;
  homePort?: string | null;
  status?: string;
  isActive?: boolean;
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
  if (filters?.includeTranslations === true) params.set("includeTranslations", "true");
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
  const { data } = await apiClient.get(
    `${config.api.yachts.byId(yachtId)}?includeTranslations=true&includeTags=true&includeImages=true`
  );
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  const raw = data as YachtListItem;
  return { yachts: raw };
}

async function getYachtDetailApi(yachtId: string): Promise<{ yacht: YachtDetail }> {
  const { data } = await apiClient.get(config.api.yachts.detail(yachtId));
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  const raw = data as YachtDetail;
  return { yacht: raw };
}

async function addYachtApi(payload: AddYachtsPayload) {
  const { data } = await apiClient.post(config.api.yachts.create, payload);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

async function createYachtApi(payload: CreateYachtPayload) {
  const { data } = await apiClient.post(config.api.yachts.create, payload, {
    headers: { "Content-Type": "application/json" },
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
  const form = new FormData();
  const snakeMap: Record<string, string> = {
    boatType: "boat_type",
    price: "price_category",
    lengthRange: "length_range",
    passengerDayTrip: "passenger_day_trip",
    passengerOvernight: "passenger_overnight",
    guestsRange: "guests_range",
    dayTripPrice: "day_trip_price",
    overnightPrice: "overnight_price",
    daytripPriceEuro: "daytrip_price_euro",
    cruisingSpeed: "cruising_speed",
    lengthOverall: "length_overall",
    fuelCapacity: "fuel_capacity",
    waterCapacity: "water_capacity",
    videoLink: "video_link",
    displayOrder: "display_order",
    primaryImage: "primary_image",
    dayCharter: "day_charter",
    overnightCharter: "overnight_charter",
    aboutThisBoat: "about_this_boat",
    boatLayout: "boat_layout",
  };

  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue;
    const snakeKey = snakeMap[key] ?? key;
    if (key === "primaryImage") {
      if (value instanceof File) form.append(snakeKey, value);
    } else if (key === "galleryImages" && Array.isArray(value)) {
      form.append("gallery_images_managed", "true");
      for (const img of value) {
        if (img instanceof File) form.append("gallery_images", img);
        else if (typeof img === "string") form.append("gallery_image_urls", img);
      }
    } else if (key === "tags" && Array.isArray(value)) {
      for (const tag of value) form.append("tags[]", tag);
    } else if (typeof value !== "object") {
      form.append(snakeKey, String(value));
    }
  }

  const { data } = await apiClient.patch(
    config.api.yachts.update(yachtsId),
    form
  );
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

async function deleteYachtApi(id: string): Promise<{ success: boolean; id: string }> {
  // Fetch all images (primary + gallery) and delete them from S3 via backend before deleting the yacht
  try {
    const { data: imagesData } = await apiClient.get(config.api.yachts.images(id));
    const images: Array<{ id: string }> = Array.isArray(imagesData)
      ? imagesData
      : imagesData?.data ?? imagesData?.images ?? [];
    await Promise.all(
      images.map((img) =>
        apiClient.delete(config.api.yachts.image(id, img.id)).catch(() => {
          // continue even if a single image delete fails
        })
      )
    );
  } catch {
    // If fetching images fails, proceed with yacht deletion anyway
  }
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

export function useYachtDetailQuery(yachtId: string | null) {
  return useQuery({
    queryKey: [...yachtsKeys.detail(yachtId ?? ""), "detail"],
    queryFn: () => getYachtDetailApi(yachtId!),
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

export function useCreateYachtMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createYachtApi,
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

export async function uploadYachtImages(yachtId: string, files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  const { data } = await apiClient.post(config.api.yachts.uploadImages(yachtId), formData);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export async function deleteYachtImage(yachtId: string, imageId: string) {
  const { data } = await apiClient.delete(config.api.yachts.image(yachtId, imageId));
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export async function addYachtAmenity(yachtId: string, payload: AddAmenityPayload) {
  const { data } = await apiClient.post(config.api.yachts.addAmenity(yachtId), payload);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export async function deleteYachtAmenity(yachtId: string, amenityId: string) {
  const { data } = await apiClient.delete(config.api.yachts.amenity(yachtId, amenityId));
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export async function uploadYachtDocument(yachtId: string, payload: AddDocumentPayload) {
  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("documentType", payload.documentType);
  if (payload.issuedDate) formData.append("issuedDate", payload.issuedDate);
  if (payload.expiryDate) formData.append("expiryDate", payload.expiryDate);
  if (payload.notes) formData.append("notes", payload.notes);
  const { data } = await apiClient.post(config.api.yachts.uploadDocument(yachtId), formData);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export async function deleteYachtDocument(yachtId: string, docId: string) {
  const { data } = await apiClient.delete(config.api.yachts.document(yachtId, docId));
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export async function addYachtAvailabilityBlock(yachtId: string, payload: AddAvailabilityBlockPayload) {
  const { data } = await apiClient.post(config.api.yachts.availabilityBlock(yachtId), payload);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export async function deleteYachtAvailabilityBlock(yachtId: string, blockId: string) {
  const { data } = await apiClient.delete(config.api.yachts.removeBlock(yachtId, blockId));
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

// --- Website Visibility ---

export interface WebsiteVisibilityEntry {
  id: string;
  yachtId: string;
  regionId: string;
  isVisible: boolean;
  sortOrder: number;
  region: {
    id: string;
    name: string;
    slug: string;
    siteUrl: string | null;
    status: string;
  };
}

export async function getYachtWebsiteVisibility(yachtId: string): Promise<WebsiteVisibilityEntry[]> {
  const { data } = await apiClient.get(config.api.yachts.websiteVisibility(yachtId));
  if (data?.error) throw new Error(data?.error?.message || "Something went wrong");
  return data?.data ?? [];
}

export async function setYachtWebsiteVisibility(
  yachtId: string,
  entries: { regionId: string; isVisible?: boolean; sortOrder?: number }[]
): Promise<WebsiteVisibilityEntry[]> {
  const { data } = await apiClient.put(config.api.yachts.websiteVisibility(yachtId), { entries });
  if (data?.error) throw new Error(data?.error?.message || "Something went wrong");
  return data?.data ?? [];
}

export function useYachtWebsiteVisibilityQuery(yachtId: string | null) {
  return useQuery({
    queryKey: [...yachtsKeys.detail(yachtId ?? ""), "website-visibility"],
    queryFn: () => getYachtWebsiteVisibility(yachtId!),
    enabled: !!yachtId,
  });
}

export function useSetYachtWebsiteVisibilityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ yachtId, entries }: { yachtId: string; entries: { regionId: string; isVisible?: boolean }[] }) =>
      setYachtWebsiteVisibility(yachtId, entries),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...yachtsKeys.detail(variables.yachtId), "website-visibility"],
      });
    },
  });
}

/** Map backend type to display label (bareboat | crewed). */
export function yachtTypeToDisplay(type: string): string {
  const t = type?.toLowerCase() ?? "";
  if (t === "bareboat") return "Bareboat";
  if (t === "crewed") return "Crewed";
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

// --- Website Visibility ---

export interface YachtVisibilityEntry {
  id: string;
  yachtId: string;
  regionId: string;
  isVisible: boolean;
  sortOrder: number;
  region: {
    id: string;
    name: string;
    slug: string;
    siteUrl: string | null;
    status: string;
  };
}

export function useYachtVisibilityQuery(yachtId: string | null) {
  return useQuery({
    queryKey: ["yachts", yachtId, "visibility"],
    queryFn: async () => {
      const { data } = await apiClient.get(config.api.yachts.websiteVisibility(yachtId!));
      const raw = data?.data ?? data;
      return (Array.isArray(raw) ? raw : []) as YachtVisibilityEntry[];
    },
    enabled: !!yachtId,
  });
}

export function useSetYachtVisibilityMutation(yachtId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (entries: { regionId: string; isVisible: boolean }[]) => {
      const { data } = await apiClient.put(config.api.yachts.websiteVisibility(yachtId), { entries });
      if (data?.error) throw new Error(data.error.message || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["yachts", yachtId, "visibility"] });
    },
  });
}

/** Parse length from backend (may be number or Decimal string). */
export function parseLength(lengthM: number | string | null): number {
  if (lengthM == null) return 0;
  if (typeof lengthM === "number") return Math.round(lengthM);
  const n = parseFloat(String(lengthM));
  return Number.isFinite(n) ? Math.round(n) : 0;
}
