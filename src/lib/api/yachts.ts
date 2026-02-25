import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { config } from "../../../config";

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
  list: (page: number, limit: number) =>
    [...yachtsKeys.lists(), page, limit] as const,
  details: () => [...yachtsKeys.all, "detail"] as const,
  detail: (id: string) => [...yachtsKeys.details(), id] as const,
};

export interface YachtsResponse {
  yachts: YachtsApiResponse[];
  total: number;
  totalPages: number;
  currentPage: number;
}

async function getYachtsApi(
  page: number,
  limit: number
): Promise<YachtsResponse> {
  const { data } = await apiClient.get(
    `${config.api.yachts.list}?page=${page}&limit=${limit}`
  );
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data.data;
}

async function getYachtByIdApi(yachtId: string): Promise<{ yachts: YachtsApiResponse }> {
  const { data } = await apiClient.get(config.api.yachts.byId(yachtId));
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return { yachts: data.data };
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

export function useYachtsQuery(page: number, limit: number) {
  return useQuery({
    queryKey: yachtsKeys.list(page, limit),
    queryFn: () => getYachtsApi(page, limit),
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
