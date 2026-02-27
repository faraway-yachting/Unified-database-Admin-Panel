import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { config } from "../../../config";

const charterCompaniesKeys = {
  all: ["charter-companies"] as const,
  list: () => [...charterCompaniesKeys.all, "list"] as const,
};

export interface CharterCompanyOption {
  id: string;
  name: string;
}

async function fetchCharterCompaniesApi(): Promise<CharterCompanyOption[]> {
  const { data } = await apiClient.get(config.api.charterCompanies.list);
  const raw = data?.data ?? data;
  const list = Array.isArray(raw?.companies)
    ? raw.companies
    : Array.isArray(raw)
      ? raw
      : [];
  return list.map((company: { id?: string; _id?: string; name?: string }) => ({
    id: company.id ?? company._id ?? "",
    name: company.name ?? "",
  }));
}

export function useCharterCompaniesQuery() {
  return useQuery({
    queryKey: charterCompaniesKeys.list(),
    queryFn: fetchCharterCompaniesApi,
    staleTime: 5 * 60 * 1000,
  });
}

