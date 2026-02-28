import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { config } from "../../../config";

export interface CustomerSearchItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  whatsapp?: string | null;
}

export interface CustomersListResponse {
  customers: CustomerSearchItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function searchCustomersApi(
  search: string,
  page: number,
  limit: number
): Promise<CustomersListResponse> {
  const params = new URLSearchParams();
  params.set("search", search);
  params.set("page", String(page));
  params.set("limit", String(limit));
  const { data } = await apiClient.get(`${config.api.crm.customers.list}?${params.toString()}`);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data as CustomersListResponse;
}

export function useCustomerSearchQuery(options: {
  search: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}) {
  const { search, page = 1, limit = 10, enabled = true } = options;
  return useQuery({
    queryKey: ["customers", "search", search, page, limit],
    queryFn: () => searchCustomersApi(search, page, limit),
    enabled: enabled && search.trim().length >= 2,
  });
}
