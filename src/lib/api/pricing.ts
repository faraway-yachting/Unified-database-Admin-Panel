import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { config } from "../../../config";

export interface RevenueSummaryResponse {
  period: { from: string | null; to: string | null };
  summary: {
    totalRevenue: number;
    totalBase: number;
    totalAddons: number;
    totalDiscount: number;
    totalTax: number;
    bookingCount: number;
  };
}

export interface RevenueByRegionItem {
  region: { id?: string; name?: string } | null;
  totalRevenue: number;
  bookingCount: number;
}

export interface RevenueByRegionResponse {
  period: { from: string | null; to: string | null };
  byRegion: RevenueByRegionItem[];
}

export interface RevenueByPackageItem {
  package: { id?: string; name?: string } | null;
  totalRevenue: number;
  bookingCount: number;
}

export interface RevenueByPackageResponse {
  period: { from: string | null; to: string | null };
  byPackage: RevenueByPackageItem[];
}

export interface PendingCommissionsResponse {
  period: { from: string | null; to: string | null };
  summary: {
    totalPending: number;
    bookingCount: number;
  };
}

export interface PricingRuleItem {
  id: string;
  name: string;
  ruleType: string;
  multiplier?: number | string | null;
  fixedAdjustment?: number | string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  priority?: number | string | null;
  package?: { id?: string; name?: string } | null;
  region?: { id?: string; name?: string } | null;
}

export interface PricingRulesResponse {
  rules: PricingRuleItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PromoCodeItem {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number | string;
  description?: string | null;
  usesCount: number;
  maxUses?: number | null;
  maxUsesPerCustomer?: number | null;
  minBookingValue?: number | null;
  region?: { id?: string; name?: string } | null;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

export interface PromoCodesResponse {
  promoCodes: PromoCodeItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AgentItem {
  id: string;
  name: string;
  email?: string;
  phone?: string | null;
  commissionRate: number | string;
  isActive: boolean;
  region?: { id?: string; name?: string } | null;
}

export interface AgentsResponse {
  agents: AgentItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const pricingKeys = {
  all: ["pricing"] as const,
  revenue: () => [...pricingKeys.all, "revenue"] as const,
  revenueSummary: (params?: { regionId?: string; from?: string; to?: string }) =>
    [...pricingKeys.revenue(), "summary", params ?? {}] as const,
  revenueByRegion: (params?: { from?: string; to?: string }) =>
    [...pricingKeys.revenue(), "by-region", params ?? {}] as const,
  revenueByPackage: (params?: { from?: string; to?: string }) =>
    [...pricingKeys.revenue(), "by-package", params ?? {}] as const,
  rules: (params?: { page?: number; limit?: number }) =>
    [...pricingKeys.all, "rules", params ?? {}] as const,
  ruleDetail: (id: string) => [...pricingKeys.all, "rules", "detail", id] as const,
  promoCodes: (params?: { page?: number; limit?: number }) =>
    [...pricingKeys.all, "promo-codes", params ?? {}] as const,
  agents: (params?: { page?: number; limit?: number }) =>
    [...pricingKeys.all, "agents", params ?? {}] as const,
  pendingCommissions: (params?: { from?: string; to?: string }) =>
    [...pricingKeys.all, "pending-commissions", params ?? {}] as const,
};

function buildRevenueParams(params?: { regionId?: string; from?: string; to?: string }) {
  const search = new URLSearchParams();
  if (params?.regionId) search.set("region", params.regionId);
  if (params?.from) search.set("from", params.from);
  if (params?.to) search.set("to", params.to);
  return search.toString();
}

function buildListParams(params?: { page?: number; limit?: number; isActive?: boolean }) {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.isActive !== undefined) search.set("isActive", params.isActive ? "true" : "false");
  return search.toString();
}

async function getRevenueSummaryApi(params?: {
  regionId?: string;
  from?: string;
  to?: string;
}): Promise<RevenueSummaryResponse> {
  const query = buildRevenueParams(params);
  const url = query
    ? `${config.api.pricing.revenue.summary}?${query}`
    : config.api.pricing.revenue.summary;
  const { data } = await apiClient.get(url);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data as RevenueSummaryResponse;
}

async function getRevenueByRegionApi(params?: {
  from?: string;
  to?: string;
}): Promise<RevenueByRegionResponse> {
  const query = buildRevenueParams(params);
  const url = query
    ? `${config.api.pricing.revenue.byRegion}?${query}`
    : config.api.pricing.revenue.byRegion;
  const { data } = await apiClient.get(url);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data as RevenueByRegionResponse;
}

async function getRevenueByPackageApi(params?: {
  from?: string;
  to?: string;
}): Promise<RevenueByPackageResponse> {
  const query = buildRevenueParams(params);
  const url = query
    ? `${config.api.pricing.revenue.byPackage}?${query}`
    : config.api.pricing.revenue.byPackage;
  const { data } = await apiClient.get(url);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data as RevenueByPackageResponse;
}

async function getPendingCommissionsApi(params?: {
  from?: string;
  to?: string;
}): Promise<PendingCommissionsResponse> {
  const query = buildRevenueParams(params);
  const url = query
    ? `${config.api.pricing.commissions.pending}?${query}`
    : config.api.pricing.commissions.pending;
  const { data } = await apiClient.get(url);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data as PendingCommissionsResponse;
}

async function getPricingRulesApi(params?: {
  page?: number;
  limit?: number;
}): Promise<PricingRulesResponse> {
  const query = buildListParams(params);
  const url = query ? `${config.api.pricing.rules.list}?${query}` : config.api.pricing.rules.list;
  const { data } = await apiClient.get(url);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data as PricingRulesResponse;
}

async function getPricingRuleApi(id: string): Promise<PricingRuleItem> {
  const { data } = await apiClient.get(config.api.pricing.rules.byId(id));
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data as PricingRuleItem;
}

async function getPromoCodesApi(params?: {
  page?: number;
  limit?: number;
  isActive?: boolean;
}): Promise<PromoCodesResponse> {
  const query = buildListParams(params);
  const url = query ? `${config.api.pricing.promoCodes.list}?${query}` : config.api.pricing.promoCodes.list;
  const { data } = await apiClient.get(url);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data as PromoCodesResponse;
}

async function getPromoCodeApi(id: string): Promise<PromoCodeItem> {
  const { data } = await apiClient.get(config.api.pricing.promoCodes.byId(id));
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data as PromoCodeItem;
}

async function getAgentsApi(params?: {
  page?: number;
  limit?: number;
}): Promise<AgentsResponse> {
  const query = buildListParams(params);
  const url = query ? `${config.api.pricing.agents.list}?${query}` : config.api.pricing.agents.list;
  const { data } = await apiClient.get(url);
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data as AgentsResponse;
}

async function getAgentApi(id: string): Promise<AgentItem> {
  const { data } = await apiClient.get(config.api.pricing.agents.byId(id));
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data as AgentItem;
}

export function useRevenueSummaryQuery(params?: {
  regionId?: string;
  from?: string;
  to?: string;
}) {
  return useQuery({
    queryKey: pricingKeys.revenueSummary(params),
    queryFn: () => getRevenueSummaryApi(params),
  });
}

export function useRevenueByRegionQuery(params?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: pricingKeys.revenueByRegion(params),
    queryFn: () => getRevenueByRegionApi(params),
  });
}

export function useRevenueByPackageQuery(params?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: pricingKeys.revenueByPackage(params),
    queryFn: () => getRevenueByPackageApi(params),
  });
}

export function usePricingRulesQuery(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: pricingKeys.rules(params),
    queryFn: () => getPricingRulesApi(params),
  });
}

export function usePricingRuleQuery(id: string | null) {
  return useQuery({
    queryKey: pricingKeys.ruleDetail(id ?? ""),
    queryFn: () => getPricingRuleApi(id!),
    enabled: !!id,
  });
}

export function usePromoCodesQuery(params?: { page?: number; limit?: number; isActive?: boolean }) {
  return useQuery({
    queryKey: pricingKeys.promoCodes(params),
    queryFn: () => getPromoCodesApi(params),
  });
}

export function usePromoCodeQuery(id: string | null) {
  return useQuery({
    queryKey: [...pricingKeys.all, "promo-codes", "detail", id ?? ""],
    queryFn: () => getPromoCodeApi(id!),
    enabled: !!id,
  });
}

export function useAgentsQuery(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: pricingKeys.agents(params),
    queryFn: () => getAgentsApi(params),
  });
}

export function useAgentQuery(id: string | null) {
  return useQuery({
    queryKey: [...pricingKeys.all, "agents", "detail", id ?? ""],
    queryFn: () => getAgentApi(id!),
    enabled: !!id,
  });
}

export function usePendingCommissionsQuery(params?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: pricingKeys.pendingCommissions(params),
    queryFn: () => getPendingCommissionsApi(params),
  });
}

export async function createPricingRule(payload: {
  name: string;
  packageId?: string;
  regionId?: string;
  ruleType: string;
  multiplier?: number;
  fixedAdjustment?: number;
  startDate: string;
  endDate: string;
  priority?: number;
  isActive?: boolean;
}) {
  const { data } = await apiClient.post(config.api.pricing.rules.create, payload, {
    headers: { "Content-Type": "application/json" },
  });
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export async function createPromoCode(payload: {
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minBookingValue?: number;
  maxUses?: number;
  maxUsesPerCustomer?: number;
  regionId?: string;
  validFrom: string;
  validUntil: string;
  isActive?: boolean;
}) {
  const { data } = await apiClient.post(config.api.pricing.promoCodes.create, payload, {
    headers: { "Content-Type": "application/json" },
  });
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export async function updatePromoCode(
  id: string,
  payload: {
    description?: string;
    discountType?: "percentage" | "fixed";
    discountValue?: number;
    minBookingValue?: number;
    maxUses?: number;
    maxUsesPerCustomer?: number;
    regionId?: string;
    validFrom?: string;
    validUntil?: string;
    isActive?: boolean;
  }
) {
  const { data } = await apiClient.patch(config.api.pricing.promoCodes.update(id), payload, {
    headers: { "Content-Type": "application/json" },
  });
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export async function deletePromoCode(id: string) {
  const { data } = await apiClient.delete(config.api.pricing.promoCodes.delete(id));
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export async function createAgent(payload: {
  name: string;
  email: string;
  phone?: string;
  regionId: string;
  commissionRate: number;
  isActive?: boolean;
}) {
  const { data } = await apiClient.post(config.api.pricing.agents.create, payload, {
    headers: { "Content-Type": "application/json" },
  });
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export async function updateAgent(
  id: string,
  payload: {
    name?: string;
    email?: string;
    phone?: string;
    regionId?: string;
    commissionRate?: number;
    isActive?: boolean;
  }
) {
  const { data } = await apiClient.patch(config.api.pricing.agents.update(id), payload, {
    headers: { "Content-Type": "application/json" },
  });
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export async function deleteAgent(id: string) {
  const { data } = await apiClient.delete(config.api.pricing.agents.delete(id));
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}

export async function updatePricingRule(
  id: string,
  payload: {
    name?: string;
    packageId?: string;
    regionId?: string;
    ruleType?: string;
    multiplier?: number;
    fixedAdjustment?: number;
    startDate?: string;
    endDate?: string;
    priority?: number;
    isActive?: boolean;
  }
) {
  const { data } = await apiClient.patch(config.api.pricing.rules.update(id), payload, {
    headers: { "Content-Type": "application/json" },
  });
  if (data?.error) {
    throw new Error(data?.error?.message || "Something went wrong");
  }
  return data;
}
