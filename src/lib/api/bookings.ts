import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { config } from "../../../config";

export interface CreateBookingPayload {
  customerId: string;
  yachtId: string;
  packageId: string;
  regionId: string;
  startDate: string;
  endDate: string;
  guestCount: number;
  baseAmount: number;
  totalAmount: number;
  currencyCode: string;
  status?: string;
  specialRequests?: string;
  internalNotes?: string;
}

export interface BookingListItem {
  id: string;
  bookingRef: string;
  startDate: string;
  endDate: string;
  totalAmount: number | string;
  status: string;
  customer?: { firstName?: string; lastName?: string };
  yacht?: { name?: string };
  package?: { name?: string };
  region?: { name?: string };
  currency?: { code?: string; symbol?: string };
}

export interface BookingsListResponse {
  bookings: BookingListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BookingsListFilters {
  status?: string;
  regionId?: string;
  from?: string;
  to?: string;
  yachtId?: string;
}

export const bookingsKeys = {
  all: ["bookings"] as const,
  lists: () => [...bookingsKeys.all, "list"] as const,
  list: (page: number, limit: number, filters?: BookingsListFilters) =>
    [...bookingsKeys.lists(), page, limit, filters ?? {}] as const,
};

function buildListParams(page: number, limit: number, filters?: BookingsListFilters): string {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (filters?.status) params.set("status", filters.status);
  if (filters?.regionId) params.set("region", filters.regionId);
  if (filters?.from) params.set("from", filters.from);
  if (filters?.to) params.set("to", filters.to);
  if (filters?.yachtId) params.set("yacht", filters.yachtId);
  return params.toString();
}

async function listBookingsApi(
  page: number,
  limit: number,
  filters?: BookingsListFilters
): Promise<BookingsListResponse> {
  const query = buildListParams(page, limit, filters);
  const { data } = await apiClient.get(`${config.api.bookings.list}?${query}`);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data as BookingsListResponse;
}

export function useBookingsQuery(page: number, limit: number, filters?: BookingsListFilters) {
  return useQuery({
    queryKey: bookingsKeys.list(page, limit, filters),
    queryFn: () => listBookingsApi(page, limit, filters),
  });
}

export async function createBooking(payload: CreateBookingPayload) {
  const { data } = await apiClient.post(config.api.bookings.create, payload, {
    headers: { "Content-Type": "application/json" },
  });
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export async function cancelBooking(bookingId: string, cancellationReason?: string) {
  const { data } = await apiClient.post(config.api.bookings.cancelPost(bookingId), {
    cancellationReason,
  });
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

