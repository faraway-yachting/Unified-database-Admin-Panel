"use client";

import { Ship, MapPin, Calendar, ChevronRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface Lead {
  id: string;
  name: string;
  yachtInterest: string;
  region: string;
  date: string;
  status: "new" | "contacted" | "quoted" | "converted";
}

interface LeadPipelineProps {
  leads: Lead[];
  onLeadClick?: (lead: Lead) => void;
}

export function LeadPipeline({ leads, onLeadClick }: LeadPipelineProps) {
  const { colors } = useTheme();

  const columns = [
    { id: "new", label: "New Inquiry", status: "new" as const },
    { id: "contacted", label: "Contacted", status: "contacted" as const },
    { id: "quoted", label: "Quoted", status: "quoted" as const },
    { id: "converted", label: "Converted", status: "converted" as const },
  ];

  const getLeadsByStatus = (status: string) =>
    leads.filter((lead) => lead.status === status);

  const getColumnColor = (status: string) => {
    switch (status) {
      case "new":
        return colors.accentGold;
      case "contacted":
        return colors.accent;
      case "quoted":
        return "#8B5CF6";
      case "converted":
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <div
      className="rounded-xl p-4 md:p-6 border backdrop-blur-sm"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder,
      }}
    >
      <div className="mb-4 md:mb-6">
        <h3
          className="text-base md:text-lg font-bold mb-1"
          style={{ color: colors.textPrimary }}
        >
          Lead Pipeline
        </h3>
        <p
          className="text-xs md:text-sm"
          style={{ color: colors.textSecondary }}
        >
          {leads.length} active leads
        </p>
      </div>

      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {columns.map((column) => {
          const columnLeads = getLeadsByStatus(column.status);
          const columnColor = getColumnColor(column.status);

          return (
            <div key={column.id}>
              <div
                className="flex items-center justify-between p-3 rounded-t-lg mb-2"
                style={{
                  backgroundColor: `${columnColor}15`,
                  borderBottom: `2px solid ${columnColor}`,
                }}
              >
                <span
                  className="text-xs font-semibold"
                  style={{ color: colors.textPrimary }}
                >
                  {column.label}
                </span>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: columnColor,
                    color: "#FFFFFF",
                  }}
                >
                  {columnLeads.length}
                </div>
              </div>
              <div className="space-y-2">
                {columnLeads.slice(0, 3).map((lead) => (
                  <div
                    key={lead.id}
                    role="button"
                    tabIndex={0}
                    className="p-3 rounded-lg border cursor-pointer transition-all"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.cardBorder,
                    }}
                    onClick={() => onLeadClick?.(lead)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") onLeadClick?.(lead);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = columnColor;
                      e.currentTarget.style.backgroundColor = colors.hoverBg;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = colors.cardBorder;
                      e.currentTarget.style.backgroundColor = colors.background;
                    }}
                  >
                    <div
                      className="text-sm font-semibold mb-2"
                      style={{ color: colors.textPrimary }}
                    >
                      {lead.name}
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div
                        className="flex items-center gap-2"
                        style={{ color: colors.textSecondary }}
                      >
                        <Ship className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{lead.yachtInterest}</span>
                      </div>
                      <div
                        className="flex items-center gap-2"
                        style={{ color: colors.textSecondary }}
                      >
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span>{lead.region}</span>
                      </div>
                      <div
                        className="flex items-center gap-2"
                        style={{ color: colors.textSecondary }}
                      >
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span>{lead.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {columnLeads.length > 3 && (
                  <div
                    className="text-xs text-center py-2"
                    style={{ color: colors.textSecondary }}
                  >
                    +{columnLeads.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="md:hidden space-y-3">
        {columns.map((column) => {
          const columnLeads = getLeadsByStatus(column.status);
          const columnColor = getColumnColor(column.status);

          return (
            <div key={column.id}>
              <div
                className="flex items-center justify-between p-3 rounded-lg mb-2"
                style={{ backgroundColor: `${columnColor}15` }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: colors.textPrimary }}
                >
                  {column.label}
                </span>
                <div
                  className="px-2 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: columnColor,
                    color: "#FFFFFF",
                  }}
                >
                  {columnLeads.length}
                </div>
              </div>
              {columnLeads.slice(0, 2).map((lead) => (
                <div
                  key={lead.id}
                  role="button"
                  tabIndex={0}
                  className="flex items-center gap-3 p-3 mb-2 rounded-lg border"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                  }}
                  onClick={() => onLeadClick?.(lead)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onLeadClick?.(lead);
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm font-semibold mb-1"
                      style={{ color: colors.textPrimary }}
                    >
                      {lead.name}
                    </div>
                    <div
                      className="text-xs mb-1"
                      style={{ color: colors.textSecondary }}
                    >
                      {lead.yachtInterest}
                    </div>
                    <div
                      className="flex items-center gap-3 text-xs"
                      style={{ color: colors.textSecondary }}
                    >
                      <span>{lead.region}</span>
                      <span>•</span>
                      <span>{lead.date}</span>
                    </div>
                  </div>
                  <ChevronRight
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: colors.textSecondary }}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LeadPipeline;
