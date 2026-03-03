"use client";

import { useEffect, useMemo, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useRegionsQuery } from "@/lib/api/regions";
import { pricingKeys, updateAgent, useAgentQuery } from "@/lib/api/pricing";
import { useQueryClient } from "@tanstack/react-query";

interface AgentEditDrawerProps {
  agentId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

type FormState = {
  name: string;
  email: string;
  phone: string;
  regionId: string;
  commissionRate: string;
  isActive: boolean;
};

export function AgentEditDrawer({ agentId, isOpen, onClose }: AgentEditDrawerProps) {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const { data: regionsData } = useRegionsQuery();
  const { data: agent, isLoading } = useAgentQuery(agentId);
  const regions = regionsData ?? [];

  const initialForm = useMemo<FormState>(() => {
    return {
      name: agent?.name ?? "",
      email: agent?.email ?? "",
      phone: agent?.phone ?? "",
      regionId: agent?.region?.id ?? "",
      commissionRate:
        agent?.commissionRate != null ? String(Number(agent.commissionRate) * 100) : "",
      isActive: agent?.isActive ?? true,
    };
  }, [agent]);

  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(initialForm);
    }
  }, [initialForm, isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const updateField = (key: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!agentId || !form.name || !form.email || !form.regionId || !form.commissionRate) return;
    const rateValue = Number(form.commissionRate);
    if (Number.isNaN(rateValue)) return;
    setIsSubmitting(true);
    try {
      await updateAgent(agentId, {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || undefined,
        regionId: form.regionId,
        commissionRate: rateValue / 100,
        isActive: form.isActive,
      });
      await queryClient.invalidateQueries({ queryKey: pricingKeys.agents() });
      await queryClient.invalidateQueries({ queryKey: ["pricing", "agents", "detail", agentId] });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" aria-hidden onClick={onClose} />
      <div
        className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden"
        style={{
          backgroundColor: colors.background,
          borderLeft: `1px solid ${colors.cardBorder}`,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="agent-edit-title"
      >
        <div className="flex items-center justify-between h-14 px-4 border-b shrink-0" style={{ borderColor: colors.cardBorder }}>
          <h2 id="agent-edit-title" className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
            Edit Agent
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg transition-all flex-shrink-0"
            style={{
              backgroundColor: colors.cardBg,
              color: colors.textSecondary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${colors.danger}15`;
              e.currentTarget.style.color = colors.danger;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.cardBg;
              e.currentTarget.style.color = colors.textSecondary;
            }}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            <div className="rounded-xl p-6 border" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: colors.textPrimary }}>
                Agent Details
              </h4>
              {isLoading ? (
                <div className="text-sm" style={{ color: colors.textSecondary }}>
                  Loading agent...
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Agent name"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border text-sm"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.cardBorder,
                        color: colors.textPrimary,
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="agent@example.com"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                        Phone
                      </label>
                      <input
                        type="text"
                        placeholder="+1 555 000 0000"
                        value={form.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="relative">
                      <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                        Region
                      </label>
                      <select
                        value={form.regionId}
                        onChange={(e) => updateField("regionId", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm appearance-none cursor-pointer"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      >
                        <option value="">Select region</option>
                        {regions.map((region) => (
                          <option key={region.id} value={region.id}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-[42px] w-4 h-4 pointer-events-none" style={{ color: colors.textSecondary }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                        Commission rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="10"
                        value={form.commissionRate}
                        onChange={(e) => updateField("commissionRate", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border text-sm"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-3 text-sm" style={{ color: colors.textSecondary }}>
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => updateField("isActive", e.target.checked)}
                        className="w-4 h-4"
                      />
                      Active agent
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t" style={{ borderColor: colors.cardBorder }}>
            <button
              type="button"
              className="px-6 py-2.5 rounded-lg border text-sm font-medium transition-all"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder,
                color: colors.textPrimary,
              }}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
              style={{
                background: `linear-gradient(to right, ${colors.accent}, #00B39F)`,
                boxShadow: `0 10px 25px -5px ${colors.accent}30`,
              }}
              onClick={handleSubmit}
              disabled={isSubmitting || !form.name || !form.email || !form.regionId || !form.commissionRate}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AgentEditDrawer;
