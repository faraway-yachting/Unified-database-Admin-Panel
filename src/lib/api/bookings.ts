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

export interface UpdateBookingPayload {
  customerId?: string;
  yachtId?: string;
  packageId?: string;
  regionId?: string;
  agentId?: string | null;
  startDate?: string;
  endDate?: string;
  startTime?: string | null;
  guestCount?: number;
  status?: string;
  baseAmount?: number;
  addonsAmount?: number;
  discountAmount?: number;
  taxAmount?: number;
  totalAmount?: number;
  currencyCode?: string;
  promoCodeId?: string | null;
  cancellationPolicy?: string | null;
  cancellationReason?: string | null;
  specialRequests?: string | null;
  internalNotes?: string | null;
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

export interface BookingCalendarEvent {
  id: string;
  bookingRef?: string;
  startDate: string;
  endDate: string;
  status: string;
  customer?: { firstName?: string; lastName?: string };
  yacht?: { id?: string; name?: string };
  package?: { id?: string; name?: string };
  region?: { id?: string; name?: string };
  guestCount?: number;
}

export interface BookingCalendarResponse {
  from: string;
  to: string;
  events: BookingCalendarEvent[];
}

export interface BookingAvailabilityBooking {
  id: string;
  bookingRef?: string;
  startDate: string;
  endDate: string;
  status?: string;
}

export interface BookingAvailabilityBlock {
  id: string;
  startDate: string;
  endDate: string;
  reason?: string | null;
}

export interface BookingAvailabilityResponse {
  yachtId: string;
  from: string;
  to: string;
  available: boolean;
  conflictingBookings?: BookingAvailabilityBooking[];
  conflictingBlocks?: BookingAvailabilityBlock[];
}

export interface BookingDetail extends BookingListItem {
  customerId?: string;
  yachtId?: string;
  packageId?: string;
  regionId?: string;
  guestCount?: number;
  baseAmount?: number | string;
  addonsAmount?: number | string;
  discountAmount?: number | string;
  taxAmount?: number | string;
  totalAmount: number | string;
  currencyCode?: string;
  status: string;
  startTime?: string | null;
  cancellationPolicy?: string | null;
  cancellationReason?: string | null;
  cancelledAt?: string | null;
  specialRequests?: string | null;
  internalNotes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  yacht?: { name?: string; type?: string };
  package?: { name?: string };
  region?: { name?: string; slug?: string };
  currency?: { code?: string; symbol?: string };
}

export interface BookingsListResponse {
  bookings: BookingListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpcomingBookingsResponse {
  bookings: BookingListItem[];
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
  details: () => [...bookingsKeys.all, "detail"] as const,
  detail: (id: string) => [...bookingsKeys.details(), id] as const,
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

async function getUpcomingBookingsApi(): Promise<UpcomingBookingsResponse> {
  const { data } = await apiClient.get(config.api.bookings.upcoming);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data as UpcomingBookingsResponse;
}

async function getBookingDetailApi(bookingId: string): Promise<BookingDetail> {
  const { data } = await apiClient.get(config.api.bookings.byId(bookingId));
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data as BookingDetail;
}

async function getBookingCalendarApi(params: {
  month: string;
  regionId?: string;
  yachtId?: string;
}): Promise<BookingCalendarResponse> {
  const search = new URLSearchParams();
  search.set("month", params.month);
  if (params.regionId) search.set("region", params.regionId);
  if (params.yachtId) search.set("yacht", params.yachtId);
  const { data } = await apiClient.get(`${config.api.bookings.calendar}?${search.toString()}`);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data as BookingCalendarResponse;
}

async function checkBookingAvailabilityApi(params: {
  yachtId: string;
  from: string;
  to: string;
}): Promise<BookingAvailabilityResponse> {
  const search = new URLSearchParams();
  search.set("yacht", params.yachtId);
  search.set("from", params.from);
  search.set("to", params.to);
  const { data } = await apiClient.get(`${config.api.bookings.availability}?${search.toString()}`);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data as BookingAvailabilityResponse;
}

export function useBookingsQuery(page: number, limit: number, filters?: BookingsListFilters) {
  return useQuery({
    queryKey: bookingsKeys.list(page, limit, filters),
    queryFn: () => listBookingsApi(page, limit, filters),
  });
}

export function useBookingDetailQuery(bookingId: string | null) {
  return useQuery({
    queryKey: bookingsKeys.detail(bookingId ?? ""),
    queryFn: () => getBookingDetailApi(bookingId!),
    enabled: !!bookingId,
  });
}

export function useBookingCalendarQuery(params: {
  month: string;
  regionId?: string;
  yachtId?: string;
}) {
  return useQuery({
    queryKey: [...bookingsKeys.all, "calendar", params],
    queryFn: () => getBookingCalendarApi(params),
  });
}

export function useUpcomingBookingsQuery() {
  return useQuery({
    queryKey: [...bookingsKeys.all, "upcoming"],
    queryFn: () => getUpcomingBookingsApi(),
  });
}

export function useBookingAvailabilityQuery(params: {
  yachtId?: string;
  from?: string;
  to?: string;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: [...bookingsKeys.all, "availability", params],
    queryFn: () =>
      checkBookingAvailabilityApi({
        yachtId: params.yachtId!,
        from: params.from!,
        to: params.to!,
      }),
    enabled: !!params.enabled && !!params.yachtId && !!params.from && !!params.to,
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

export async function updateBooking(bookingId: string, payload: UpdateBookingPayload) {
  const { data } = await apiClient.patch(config.api.bookings.update(bookingId), payload, {
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

export async function deleteBooking(bookingId: string) {
  const { data } = await apiClient.delete(config.api.bookings.cancel(bookingId));
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

