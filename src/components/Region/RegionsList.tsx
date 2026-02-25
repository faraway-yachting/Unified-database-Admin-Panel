"use client";

import { Globe, Eye, Settings, ExternalLink } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface Region {
  id: string;
  city: string;
  country: string;
  flag: string;
  siteUrl: string;
  status: "live" | "draft";
  packages: number;
  yachts: number;
  lastUpdated: string;
}

interface RegionsListProps {
  regions: Region[];
  selectedRegion: string | null;
  onSelectRegion: (regionId: string) => void;
  onManage: (region: Region) => void;
  onPreview: (region: Region) => void;
  onSettings: (region: Region) => void;
}

export function RegionsList({
  regions,
  selectedRegion,
  onSelectRegion,
  onManage,
  onPreview,
  onSettings,
}: RegionsListProps) {
  const { colors } = useTheme();

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder,
        maxHeight: "400px",
      }}
    >
      <div
        className="p-4 border-b sticky top-0 backdrop-blur-sm z-10"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder,
        }}
      >
        <h3
          className="text-lg font-bold"
          style={{ color: colors.textPrimary }}
        >
          Active Regions
        </h3>
      </div>

      <div
        className="overflow-y-auto"
        style={{ maxHeight: "calc(400px - 60px)" }}
      >
        <div className="p-3 space-y-3">
          {regions.map((region) => {
            const isSelected = selectedRegion === region.id;

            return (
              <div
                key={region.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectRegion(region.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    onSelectRegion(region.id);
                }}
                className="p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: isSelected
                    ? `${colors.accent}10`
                    : colors.background,
                  borderColor: isSelected ? colors.accent : colors.cardBorder,
                  borderWidth: isSelected ? "2px" : "1px",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{region.flag}</span>
                    <div>
                      <h4
                        className="text-sm md:text-base font-semibold"
                        style={{ color: colors.textPrimary }}
                      >
                        {region.city}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Globe
                          className="w-3 h-3 flex-shrink-0"
                          style={{ color: colors.textSecondary }}
                        />
                        <span
                          className="text-xs"
                          style={{ color: colors.textSecondary }}
                        >
                          {region.siteUrl}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="px-2 py-1 rounded text-xs font-semibold"
                    style={{
                      backgroundColor:
                        region.status === "live"
                          ? `${colors.accent}20`
                          : `${colors.textSecondary}20`,
                      color:
                        region.status === "live"
                          ? colors.accent
                          : colors.textSecondary,
                    }}
                  >
                    {region.status.toUpperCase()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div
                      className="text-xs mb-0.5"
                      style={{ color: colors.textSecondary }}
                    >
                      Packages
                    </div>
                    <div
                      className="text-lg font-bold font-mono"
                      style={{ color: colors.textPrimary }}
                    >
                      {region.packages}
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-xs mb-0.5"
                      style={{ color: colors.textSecondary }}
                    >
                      Yachts
                    </div>
                    <div
                      className="text-lg font-bold font-mono"
                      style={{ color: colors.textPrimary }}
                    >
                      {region.yachts}
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center justify-between pt-3 border-t"
                  style={{ borderColor: colors.cardBorder }}
                >
                  <span
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    Updated {region.lastUpdated}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onManage(region);
                      }}
                      className="p-1.5 rounded hover:bg-opacity-10 transition-all"
                      style={{
                        color: colors.accent,
                        backgroundColor: "transparent",
                      }}
                      title="Manage"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreview(region);
                      }}
                      className="p-1.5 rounded hover:bg-opacity-10 transition-all"
                      style={{
                        color: colors.textSecondary,
                        backgroundColor: "transparent",
                      }}
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSettings(region);
                      }}
                      className="p-1.5 rounded hover:bg-opacity-10 transition-all"
                      style={{
                        color: colors.textSecondary,
                        backgroundColor: "transparent",
                      }}
                      title="Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RegionsList;
