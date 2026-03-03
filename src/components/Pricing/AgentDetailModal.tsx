"use client";

import { X } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAgentQuery } from "@/lib/api/pricing";

interface AgentDetailModalProps {
  agentId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AgentDetailModal({ agentId, isOpen, onClose }: AgentDetailModalProps) {
  const { colors } = useTheme();
  const { data: agent, isLoading } = useAgentQuery(agentId);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <div
        className="w-full max-w-lg rounded-2xl border p-6"
        style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
            Agent Details
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg transition-all"
            style={{ backgroundColor: colors.background, color: colors.textSecondary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${colors.danger}15`;
              e.currentTarget.style.color = colors.danger;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.background;
              e.currentTarget.style.color = colors.textSecondary;
            }}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="text-sm" style={{ color: colors.textSecondary }}>
            Loading agent details...
          </div>
        ) : agent ? (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span style={{ color: colors.textSecondary }}>Name</span>
              <span style={{ color: colors.textPrimary }}>{agent.name}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: colors.textSecondary }}>Email</span>
              <span style={{ color: colors.textPrimary }}>{agent.email}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: colors.textSecondary }}>Phone</span>
              <span style={{ color: colors.textPrimary }}>{agent.phone || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: colors.textSecondary }}>Region</span>
              <span style={{ color: colors.textPrimary }}>{agent.region?.name || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: colors.textSecondary }}>Commission Rate</span>
              <span style={{ color: colors.textPrimary }}>
                {agent.commissionRate != null ? `${Number(agent.commissionRate) * 100}%` : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: colors.textSecondary }}>Status</span>
              <span style={{ color: colors.textPrimary }}>{agent.isActive ? "Active" : "Inactive"}</span>
            </div>
          </div>
        ) : (
          <div className="text-sm" style={{ color: colors.textSecondary }}>
            Agent not found.
          </div>
        )}
      </div>
    </div>
  );
}

export default AgentDetailModal;
