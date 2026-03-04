import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { config } from "../../../config";

export interface AuditLogAdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuditLogItem {
  id: string;
  adminUserId: string;
  action: string;
  module: string;
  entityType: string;
  entityId: string | null;
  description: string | null;
  ipAddress: string | null;
  createdAt: string;
  adminUser: AuditLogAdminUser;
}

export interface AuditLogsListResponse {
  auditLogs: AuditLogItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuditLogsListFilters {
  user?: string;
  action?: string;
  module?: string;
  from?: string;
  to?: string;
}

export const auditLogsKeys = {
  all: ["auditLogs"] as const,
  lists: () => [...auditLogsKeys.all, "list"] as const,
  list: (page: number, limit: number, filters?: AuditLogsListFilters) =>
    [...auditLogsKeys.lists(), page, limit, filters ?? {}] as const,
  details: () => [...auditLogsKeys.all, "detail"] as const,
  detail: (id: string) => [...auditLogsKeys.details(), id] as const,
};

function buildListParams(
  page: number,
  limit: number,
  filters?: AuditLogsListFilters
): string {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (filters?.user) params.set("user", filters.user);
  if (filters?.action) params.set("action", filters.action);
  if (filters?.module) params.set("module", filters.module);
  if (filters?.from) params.set("from", filters.from);
  if (filters?.to) params.set("to", filters.to);
  return params.toString();
}

async function listAuditLogsApi(
  page: number,
  limit: number,
  filters?: AuditLogsListFilters
): Promise<AuditLogsListResponse> {
  const query = buildListParams(page, limit, filters);
  const { data } = await apiClient.get(
    `${config.api.settings.auditLogs.list}?${query}`
  );
  if (data?.error) {
    throw new Error(data?.error?.message || "Failed to load audit logs");
  }
  return data as AuditLogsListResponse;
}

async function getAuditLogByIdApi(id: string): Promise<AuditLogItem> {
  const { data } = await apiClient.get(config.api.settings.auditLogs.byId(id));
  if (data?.error) {
    throw new Error(data?.error?.message || "Failed to load audit log");
  }
  return data as AuditLogItem;
}

export function useAuditLogsQuery(
  page: number,
  limit: number,
  filters?: AuditLogsListFilters
) {
  return useQuery({
    queryKey: auditLogsKeys.list(page, limit, filters),
    queryFn: () => listAuditLogsApi(page, limit, filters),
  });
}

export function useAuditLogByIdQuery(id: string | null) {
  return useQuery({
    queryKey: auditLogsKeys.detail(id ?? ""),
    queryFn: () => getAuditLogByIdApi(id!),
    enabled: !!id,
  });
}
