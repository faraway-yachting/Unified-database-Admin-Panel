"use client";

import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Tag,
  Wallet,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PricingKPICard } from "./PricingKPICard";
import { RevenueChart } from "./RevenueChart";
import { RevenueByRegion } from "./RevenueByRegion";
import { PricingRulesTable, type PricingRule } from "./PricingRulesTable";
import { PromoCodesPanel, type PromoCode } from "./PromoCodesPanel";
import { CommissionPanel, type Commission } from "./CommissionPanel";
import { TopPerformingPackages, type TopPackage } from "./TopPerformingPackages";
import PricingRuleCreateDrawer from "./PricingRuleCreateDrawer";
import PricingRuleEditDrawer from "./PricingRuleEditDrawer";
import PromoCodeCreateDrawer from "./PromoCodeCreateDrawer";
import PromoCodeEditDrawer from "./PromoCodeEditDrawer";
import AgentCreateDrawer from "./AgentCreateDrawer";
import AgentEditDrawer from "./AgentEditDrawer";
import AgentDetailModal from "./AgentDetailModal";
import {
  useAgentsQuery,
  deleteAgent,
  deletePromoCode,
  pricingKeys,
  usePricingRulesQuery,
  usePromoCodesQuery,
  usePendingCommissionsQuery,
  useRevenueSummaryQuery,
  useRevenueByPackageQuery,
  useRevenueByRegionQuery,
} from "@/lib/api/pricing";
import { usePricing } from "@/context/PricingContext";
import { useTheme } from "@/context/ThemeContext";

const REGION_FLAGS: Record<string, string> = {
  mediterranean: "🇬🇷",
  caribbean: "🇧🇸",
  pacific: "🇵🇫",
  "indian ocean": "🇲🇻",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000000 ? 1 : 0,
  }).format(value);

const formatCompactCurrency = (value: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const formatDateOnly = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
};

export default function PricingRevenue() {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const { isCreateRuleOpen, setIsCreateRuleOpen } = usePricing();
  const [timeFilter, setTimeFilter] = useState("1Y");
  const [editRuleId, setEditRuleId] = useState<string | null>(null);
  const [isCreatePromoOpen, setIsCreatePromoOpen] = useState(false);
  const [editPromoId, setEditPromoId] = useState<string | null>(null);
  const [isCreateAgentOpen, setIsCreateAgentOpen] = useState(false);
  const [viewAgentId, setViewAgentId] = useState<string | null>(null);
  const [editAgentId, setEditAgentId] = useState<string | null>(null);
  const [pendingPromoDelete, setPendingPromoDelete] = useState<PromoCode | null>(null);
  const [pendingAgentDelete, setPendingAgentDelete] = useState<Commission | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pricingRuleSearch, setPricingRuleSearch] = useState("");
  const [promoSearch, setPromoSearch] = useState("");
  const [agentSearch, setAgentSearch] = useState("");

  const monthRange = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const format = (value: Date) => value.toISOString().slice(0, 10);
    return { from: format(start), to: format(now) };
  }, []);

  const { from, to } = useMemo(() => {
    const end = new Date();
    const start = new Date(end);
    const monthsBack = timeFilter === "1M" ? 1 : timeFilter === "3M" ? 3 : timeFilter === "6M" ? 6 : 12;
    start.setMonth(start.getMonth() - monthsBack);
    const format = (value: Date) => value.toISOString().slice(0, 10);
    return { from: format(start), to: format(end) };
  }, [timeFilter]);

  const {
    data: revenueByRegionData,
    isLoading: isRevenueByRegionLoading,
    isError: isRevenueByRegionError,
    error: revenueByRegionError,
  } = useRevenueByRegionQuery({ from, to });

  const { data: revenueSummaryData } = useRevenueSummaryQuery();
  const { data: revenueSummaryMonth } = useRevenueSummaryQuery(monthRange);
  const { data: pendingCommissionsData } = usePendingCommissionsQuery();
  const { data: revenueByPackageData } = useRevenueByPackageQuery({ from, to });
  const { data: pricingRulesData } = usePricingRulesQuery({ page: 1, limit: 50 });
  const { data: promoCodesData } = usePromoCodesQuery({ page: 1, limit: 1, isActive: true });
  const { data: agentsData } = useAgentsQuery({ page: 1, limit: 50 });

  const regionSummary = revenueByRegionData?.byRegion ?? [];
  const regionTotalRevenue = regionSummary.reduce((sum, item) => sum + Number(item.totalRevenue || 0), 0);

  const regionRevenue = useMemo(() => {
    return [...regionSummary]
      .sort((a, b) => Number(b.totalRevenue || 0) - Number(a.totalRevenue || 0))
      .map((item) => {
        const name = item.region?.name || "Unknown";
        const slug = name.toLowerCase();
        const percentage = regionTotalRevenue
          ? Math.round((Number(item.totalRevenue || 0) / regionTotalRevenue) * 100)
          : 0;
        return {
          name,
          flag: REGION_FLAGS[slug] || "🌍",
          revenue: Number(item.totalRevenue || 0),
          bookings: Number(item.bookingCount || 0),
          percentage,
        };
      });
  }, [regionSummary, regionTotalRevenue]);

  const revenueChartData = useMemo(() => {
    const base = {
      month: timeFilter,
      mediterranean: 0,
      caribbean: 0,
      pacific: 0,
      indianOcean: 0,
    };
    regionSummary.forEach((item) => {
      const name = (item.region?.name || "").toLowerCase();
      const value = Number(item.totalRevenue || 0) / 1000;
      if (name === "mediterranean") base.mediterranean = value;
      if (name === "caribbean") base.caribbean = value;
      if (name === "pacific") base.pacific = value;
      if (name === "indian ocean") base.indianOcean = value;
    });
    return [base];
  }, [regionSummary, timeFilter]);

  const pricingRules = useMemo<PricingRule[]>(() => {
    const rules = pricingRulesData?.rules ?? [];
    return rules.map((rule) => {
      const start = formatDateOnly(rule.startDate);
      const end = formatDateOnly(rule.endDate);
      const dateRange = start === end ? start : `${start} - ${end}`;
      const multiplierValue = rule.multiplier != null ? Number(rule.multiplier) : null;
      const adjustmentValue = rule.fixedAdjustment != null ? Number(rule.fixedAdjustment) : null;
      const multiplierLabel =
        multiplierValue != null && !Number.isNaN(multiplierValue)
          ? `${multiplierValue}x`
          : adjustmentValue != null && !Number.isNaN(adjustmentValue)
            ? `${adjustmentValue >= 0 ? "+" : ""}$${Math.abs(adjustmentValue)}`
            : "—";
      const mappedType =
        rule.ruleType === "peak"
          ? "peak"
          : rule.ruleType === "holiday"
            ? "holiday"
            : rule.ruleType === "last_minute"
              ? "lastminute"
              : "discount";
      return {
        id: rule.id,
        name: rule.name,
        package: rule.package?.name || "All Packages",
        region: rule.region?.name || "All Regions",
        dateRange,
        multiplier: multiplierLabel,
        type: mappedType,
        status: rule.isActive ? "active" : "inactive",
      };
    });
  }, [pricingRulesData?.rules]);

  const filteredPricingRules = useMemo(() => {
    const query = pricingRuleSearch.trim().toLowerCase();
    if (!query) return pricingRules;
    return pricingRules.filter((rule) => {
      const haystack = `${rule.name} ${rule.package} ${rule.region} ${rule.type}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [pricingRuleSearch, pricingRules]);

  const promoCodes = useMemo<PromoCode[]>(() => {
    const promos = promoCodesData?.promoCodes ?? [];
    return promos.map((promo) => {
      const validUntil = new Date(promo.validUntil);
      const isExpired = Number.isNaN(validUntil.getTime()) ? false : validUntil < new Date();
      return {
        id: promo.id,
        code: promo.code,
        discountType: promo.discountType,
        value: Number(promo.discountValue),
        usageCount: promo.usesCount,
        expiryDate: formatDateOnly(promo.validUntil),
        status: promo.isActive && !isExpired ? "active" : "expired",
      };
    });
  }, [promoCodesData?.promoCodes]);

  const filteredPromoCodes = useMemo(() => {
    const query = promoSearch.trim().toLowerCase();
    if (!query) return promoCodes;
    return promoCodes.filter((promo) => {
      const haystack = `${promo.code} ${promo.discountType}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [promoCodes, promoSearch]);

  const commissions = useMemo<Commission[]>(() => {
    const agents = agentsData?.agents ?? [];
    return agents.map((agent) => ({
      id: agent.id,
      agentName: agent.name,
      region: agent.region?.name || "All Regions",
      commissionRate: Math.round(Number(agent.commissionRate) * 100),
      bookingsThisMonth: 0,
      totalEarned: 0,
      payoutStatus: "pending",
    }));
  }, [agentsData?.agents]);

  const filteredCommissions = useMemo(() => {
    const query = agentSearch.trim().toLowerCase();
    if (!query) return commissions;
    return commissions.filter((agent) => {
      const haystack = `${agent.agentName} ${agent.region}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [agentSearch, commissions]);

  const totalRevenue = Number(revenueSummaryData?.summary.totalRevenue || 0);
  const bookingCount = Number(revenueSummaryData?.summary.bookingCount || 0);
  const avgBookingValue = bookingCount > 0 ? totalRevenue / bookingCount : 0;
  const revenueThisMonth = Number(revenueSummaryMonth?.summary.totalRevenue || 0);
  const activePromoCodes = promoCodesData?.total ?? 0;
  const pendingCommissions = Number(pendingCommissionsData?.summary.totalPending || 0);

  const topPackages = useMemo<TopPackage[]>(() => {
    const packages = revenueByPackageData?.byPackage ?? [];
    return [...packages]
      .sort((a, b) => Number(b.totalRevenue || 0) - Number(a.totalRevenue || 0))
      .map((item, index) => {
        const totalRevenue = Number(item.totalRevenue || 0);
        const totalBookings = Number(item.bookingCount || 0);
        return {
          rank: index + 1,
          name: item.package?.name || "Unknown Package",
          totalBookings,
          totalRevenue,
          avgBookingValue: totalBookings > 0 ? totalRevenue / totalBookings : 0,
        };
      });
  }, [revenueByPackageData?.byPackage]);

  const handleEditRule = (rule: PricingRule) => {
    setEditRuleId(rule.id);
  };

  const handleDeleteRule = (rule: PricingRule) => {
    console.log("Delete rule:", rule.id);
  };

  const handleToggleRuleStatus = (rule: PricingRule) => {
    console.log("Toggle rule status:", rule.id);
  };

  const handleCopyPromo = (promo: PromoCode) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(promo.code)
        .then(() => {
          toast.success("Promo code copied.");
        })
        .catch(() => {
          toast.error("Failed to copy promo code.");
        });
    } else {
      toast.error("Clipboard access unavailable.");
    }
  };

  const handleEditPromo = (promo: PromoCode) => {
    setEditPromoId(promo.id);
  };

  const handleDeletePromo = (promo: PromoCode) => {
    setPendingPromoDelete(promo);
  };

  const handleCreatePromo = () => {
    setIsCreatePromoOpen(true);
  };

  const handleViewCommission = (commission: Commission) => {
    setViewAgentId(commission.id);
  };

  const handleEditCommission = (commission: Commission) => {
    setEditAgentId(commission.id);
  };

  const handleDeleteCommission = (commission: Commission) => {
    setPendingAgentDelete(commission);
  };

  const handleAddAgent = () => {
    setIsCreateAgentOpen(true);
  };

  const confirmDeletePromo = async () => {
    if (!pendingPromoDelete) return;
    setIsDeleting(true);
    try {
      await deletePromoCode(pendingPromoDelete.id);
      await queryClient.invalidateQueries({ queryKey: pricingKeys.promoCodes() });
    } finally {
      setIsDeleting(false);
      setPendingPromoDelete(null);
    }
  };

  const confirmDeleteAgent = async () => {
    if (!pendingAgentDelete) return;
    setIsDeleting(true);
    try {
      await deleteAgent(pendingAgentDelete.id);
      await queryClient.invalidateQueries({ queryKey: pricingKeys.agents() });
    } finally {
      setIsDeleting(false);
      setPendingAgentDelete(null);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Row 1 - KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
        <PricingKPICard
          icon={DollarSign}
          label="Total Revenue"
          value={formatCompactCurrency(totalRevenue)}
          change={0}
          sparklineData={[
            { value: 145 },
            { value: 162 },
            { value: 158 },
            { value: 181 },
            { value: 175 },
            { value: 197 },
            { value: 212 },
            { value: 208 },
            { value: 225 },
            { value: 240 },
          ]}
        />
        <PricingKPICard
          icon={TrendingUp}
          label="Revenue This Month"
          value={formatCompactCurrency(revenueThisMonth)}
          change={0}
          sparklineData={[
            { value: 25 },
            { value: 32 },
            { value: 28 },
            { value: 38 },
            { value: 35 },
            { value: 42 },
            { value: 48 },
            { value: 52 },
            { value: 58 },
            { value: 62 },
          ]}
        />
        <PricingKPICard
          icon={CreditCard}
          label="Avg. Booking Value"
          value={formatCompactCurrency(avgBookingValue)}
          change={0}
          sparklineData={[
            { value: 3800 },
            { value: 4100 },
            { value: 3900 },
            { value: 4400 },
            { value: 4200 },
            { value: 4700 },
            { value: 5100 },
            { value: 4900 },
            { value: 5200 },
            { value: 4800 },
          ]}
        />
        <PricingKPICard
          icon={Tag}
          label="Active Promo Codes"
          value={String(activePromoCodes)}
          change={0}
          sparklineData={[
            { value: 8 },
            { value: 7 },
            { value: 6 },
            { value: 7 },
            { value: 6 },
            { value: 5 },
            { value: 5 },
            { value: 4 },
            { value: 5 },
            { value: 4 },
          ]}
        />
        <PricingKPICard
          icon={Wallet}
          label="Pending Commissions"
          value={formatCurrency(pendingCommissions)}
          change={0}
          sparklineData={[
            { value: 28 },
            { value: 32 },
            { value: 35 },
            { value: 38 },
            { value: 42 },
            { value: 45 },
            { value: 48 },
            { value: 51 },
            { value: 54 },
            { value: 51 },
          ]}
        />
      </div>

      {/* Row 2 - Revenue Chart + Revenue by Region */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_460px] gap-4 md:gap-6 mb-6 md:mb-8">
        <RevenueChart
          data={revenueChartData}
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
          isLoading={isRevenueByRegionLoading}
          errorMessage={
            isRevenueByRegionError
              ? revenueByRegionError instanceof Error
                ? revenueByRegionError.message
                : "Failed to load revenue data."
              : undefined
          }
        />
        <RevenueByRegion regions={regionRevenue} />
      </div>

      {/* Row 3 - Pricing Rules Table */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 mb-6 md:mb-8">
        <div
          className="rounded-xl p-4 md:p-6 border backdrop-blur-sm"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.cardBorder,
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="w-5 h-5" style={{ color: colors.accent }} />
            <h3 className="text-base md:text-lg font-bold" style={{ color: colors.textPrimary }}>
              Quick Filters
            </h3>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <div className="min-w-[220px] flex-1">
              <label
                className="text-xs font-semibold uppercase tracking-wide mb-2 block"
                style={{ color: colors.textSecondary }}
              >
                Search Pricing Rules
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: colors.textSecondary }}
                  aria-hidden
                />
                <input
                  type="text"
                  value={pricingRuleSearch}
                  onChange={(e) => setPricingRuleSearch(e.target.value)}
                  placeholder="Search by name, package, region..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = `${colors.accent}50`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.cardBorder;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <PricingRulesTable
          rules={filteredPricingRules}
          onEdit={handleEditRule}
          onDelete={handleDeleteRule}
          onToggleStatus={handleToggleRuleStatus}
        />
      </div>

      {/* Row 4 - Promo Codes + Commission Management */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 mb-6 md:mb-8">
        <div
          className="rounded-xl p-4 md:p-6 border backdrop-blur-sm"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.cardBorder,
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="w-5 h-5" style={{ color: colors.accent }} />
            <h3 className="text-base md:text-lg font-bold" style={{ color: colors.textPrimary }}>
              Quick Filters
            </h3>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <div className="min-w-[220px] flex-1">
              <label
                className="text-xs font-semibold uppercase tracking-wide mb-2 block"
                style={{ color: colors.textSecondary }}
              >
                Search Promo Codes
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: colors.textSecondary }}
                  aria-hidden
                />
                <input
                  type="text"
                  value={promoSearch}
                  onChange={(e) => setPromoSearch(e.target.value)}
                  placeholder="Search by code..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = `${colors.accent}50`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.cardBorder;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <PromoCodesPanel
          promoCodes={filteredPromoCodes}
          onCopy={handleCopyPromo}
          onEdit={handleEditPromo}
          onDelete={handleDeletePromo}
          onCreate={handleCreatePromo}
        />
        <div
          className="rounded-xl p-4 md:p-6 border backdrop-blur-sm"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.cardBorder,
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="w-5 h-5" style={{ color: colors.accent }} />
            <h3 className="text-base md:text-lg font-bold" style={{ color: colors.textPrimary }}>
              Quick Filters
            </h3>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <div className="min-w-[220px] flex-1">
              <label
                className="text-xs font-semibold uppercase tracking-wide mb-2 block"
                style={{ color: colors.textSecondary }}
              >
                Search Agents
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: colors.textSecondary }}
                  aria-hidden
                />
                <input
                  type="text"
                  value={agentSearch}
                  onChange={(e) => setAgentSearch(e.target.value)}
                  placeholder="Search by agent name..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = `${colors.accent}50`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.cardBorder;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <CommissionPanel
          commissions={filteredCommissions}
          onView={handleViewCommission}
          onEdit={handleEditCommission}
          onDelete={handleDeleteCommission}
          onAddAgent={handleAddAgent}
        />
      </div>

      {/* Row 5 - Top Performing Packages */}
      <TopPerformingPackages packages={topPackages} />
      <PricingRuleCreateDrawer
        isOpen={isCreateRuleOpen}
        onClose={() => setIsCreateRuleOpen(false)}
      />
      <PricingRuleEditDrawer
        ruleId={editRuleId}
        isOpen={!!editRuleId}
        onClose={() => setEditRuleId(null)}
      />
      <PromoCodeCreateDrawer
        isOpen={isCreatePromoOpen}
        onClose={() => setIsCreatePromoOpen(false)}
      />
      <PromoCodeEditDrawer
        promoId={editPromoId}
        isOpen={!!editPromoId}
        onClose={() => setEditPromoId(null)}
      />
      <AgentCreateDrawer
        isOpen={isCreateAgentOpen}
        onClose={() => setIsCreateAgentOpen(false)}
      />
      <AgentEditDrawer
        agentId={editAgentId}
        isOpen={!!editAgentId}
        onClose={() => setEditAgentId(null)}
      />
      <AgentDetailModal
        agentId={viewAgentId}
        isOpen={!!viewAgentId}
        onClose={() => setViewAgentId(null)}
      />
      {pendingPromoDelete && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div
            className="w-full max-w-md rounded-2xl border p-6"
            style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}
          >
            <h3 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
              Delete promo code?
            </h3>
            <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
              This will permanently delete &quot;{pendingPromoDelete.code}&quot;.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingPromoDelete(null)}
                className="px-4 py-2 rounded-lg border text-sm"
                style={{ borderColor: colors.cardBorder, color: colors.textPrimary }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeletePromo}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ backgroundColor: colors.danger }}
              >
                {isDeleting ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
      {pendingAgentDelete && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div
            className="w-full max-w-md rounded-2xl border p-6"
            style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}
          >
            <h3 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>
              Delete agent?
            </h3>
            <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
              This will permanently delete &quot;{pendingAgentDelete.agentName}&quot;.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingAgentDelete(null)}
                className="px-4 py-2 rounded-lg border text-sm"
                style={{ borderColor: colors.cardBorder, color: colors.textPrimary }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteAgent}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ backgroundColor: colors.danger }}
              >
                {isDeleting ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
