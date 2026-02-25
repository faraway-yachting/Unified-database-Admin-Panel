"use client";

import { Eye, Send, Users } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface Segment {
  id: string;
  name: string;
  customerCount: number;
  avgSpend: number;
  topRegion: string;
  lastCampaign: string;
  color: string;
}

interface SegmentationPanelProps {
  segments: Segment[];
  onViewCustomers: (segment: Segment) => void;
  onSendCampaign: (segment: Segment) => void;
}

export function SegmentationPanel({
  segments,
  onViewCustomers,
  onSendCampaign,
}: SegmentationPanelProps) {
  const { colors } = useTheme();

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
          Segmentation & Tagging
        </h3>
        <p
          className="text-xs md:text-sm"
          style={{ color: colors.textSecondary }}
        >
          Manage customer segments and campaigns
        </p>
      </div>

      <div
        className="p-4 md:p-6 rounded-lg mb-6"
        style={{
          backgroundColor: colors.background,
          border: `1px solid ${colors.cardBorder}`,
        }}
      >
        <h4
          className="text-xs md:text-sm font-bold uppercase tracking-wide mb-4"
          style={{ color: colors.textPrimary }}
        >
          Active Segments
        </h4>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {segments.map((segment) => (
            <button
              key={segment.id}
              type="button"
              className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-full border-2 transition-all"
              style={{
                backgroundColor: `${segment.color}15`,
                borderColor: segment.color,
                color: segment.color,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${segment.color}25`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${segment.color}15`;
              }}
            >
              <Users className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
              <span className="text-xs md:text-sm font-semibold">
                {segment.name}
              </span>
              <div
                className="px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold"
                style={{
                  backgroundColor: segment.color,
                  color: "#FFFFFF",
                }}
              >
                {segment.customerCount}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                <th
                  className="text-left text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                  style={{ color: colors.textSecondary }}
                >
                  Segment Name
                </th>
                <th
                  className="text-center text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                  style={{ color: colors.textSecondary }}
                >
                  Customers
                </th>
                <th
                  className="text-right text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                  style={{ color: colors.textSecondary }}
                >
                  Avg. Spend
                </th>
                <th
                  className="text-left text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                  style={{ color: colors.textSecondary }}
                >
                  Top Region
                </th>
                <th
                  className="text-left text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                  style={{ color: colors.textSecondary }}
                >
                  Last Campaign
                </th>
                <th
                  className="text-center text-xs font-semibold uppercase tracking-wide pb-4 px-2"
                  style={{ color: colors.textSecondary }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {segments.map((segment) => (
                <tr
                  key={segment.id}
                  className="transition-colors"
                  style={{ borderBottom: `1px solid ${colors.cardBorder}` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.hoverBg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: segment.color }}
                      />
                      <span
                        className="text-sm font-semibold"
                        style={{ color: colors.textPrimary }}
                      >
                        {segment.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <div
                      className="text-sm font-mono font-bold"
                      style={{ color: colors.textPrimary }}
                    >
                      {segment.customerCount}
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div
                      className="text-sm font-mono font-bold"
                      style={{ color: colors.textPrimary }}
                    >
                      ${segment.avgSpend.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div
                      className="text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      {segment.topRegion}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div
                      className="text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      {segment.lastCampaign}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onViewCustomers(segment)}
                        className="p-2 rounded-lg transition-all"
                        style={{
                          backgroundColor: colors.background,
                          color: colors.textSecondary,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${colors.accent}15`;
                          e.currentTarget.style.color = colors.accent;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = colors.background;
                          e.currentTarget.style.color = colors.textSecondary;
                        }}
                        title="View Customers"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onSendCampaign(segment)}
                        className="p-2 rounded-lg transition-all"
                        style={{
                          backgroundColor: colors.background,
                          color: colors.textSecondary,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${colors.accentGold}15`;
                          e.currentTarget.style.color = colors.accentGold;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = colors.background;
                          e.currentTarget.style.color = colors.textSecondary;
                        }}
                        title="Send Campaign"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-3">
          {segments.map((segment) => (
            <div
              key={segment.id}
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: segment.color }}
                />
                <div
                  className="text-sm font-semibold"
                  style={{ color: colors.textPrimary }}
                >
                  {segment.name}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                <div>
                  <div style={{ color: colors.textSecondary }}>Customers</div>
                  <div
                    className="font-mono font-bold"
                    style={{ color: colors.textPrimary }}
                  >
                    {segment.customerCount}
                  </div>
                </div>
                <div>
                  <div style={{ color: colors.textSecondary }}>Avg. Spend</div>
                  <div
                    className="font-mono font-bold"
                    style={{ color: colors.textPrimary }}
                  >
                    ${segment.avgSpend.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ color: colors.textSecondary }}>Top Region</div>
                  <div style={{ color: colors.textPrimary }}>
                    {segment.topRegion}
                  </div>
                </div>
                <div>
                  <div style={{ color: colors.textSecondary }}>
                    Last Campaign
                  </div>
                  <div style={{ color: colors.textPrimary }}>
                    {segment.lastCampaign}
                  </div>
                </div>
              </div>

              <div
                className="flex gap-2 pt-3 border-t"
                style={{ borderColor: colors.cardBorder }}
              >
                <button
                  type="button"
                  onClick={() => onViewCustomers(segment)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    backgroundColor: `${colors.accent}15`,
                    color: colors.accent,
                  }}
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSendCampaign(segment)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    backgroundColor: colors.background,
                    color: colors.textSecondary,
                    border: `1px solid ${colors.cardBorder}`,
                  }}
                >
                  <Send className="w-4 h-4" />
                  <span>Campaign</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SegmentationPanel;
