"use client";

import { useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface RegionLocation {
  id: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  packages: number;
  yachts: number;
  status: "live" | "draft";
}

interface WorldMapProps {
  locations: RegionLocation[];
  selectedRegion: string | null;
  onRegionSelect: (regionId: string) => void;
}

export function WorldMap({
  locations,
  selectedRegion,
  onRegionSelect,
}: WorldMapProps) {
  const { colors } = useTheme();
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const latLngToXY = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 800;
    const y = ((90 - lat) / 180) * 400;
    return { x, y };
  };

  const liveColor = colors.accentGold ?? colors.accent;

  return (
    <div
      className="relative rounded-lg border overflow-hidden"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder,
        height: "400px",
      }}
    >
      <div className="relative w-full h-full overflow-hidden">
        <svg
          viewBox="0 0 800 400"
          className="w-full h-full"
          style={{
            transform: `scale(${zoom})`,
            transition: "transform 0.3s ease",
          }}
        >
          <rect
            width="800"
            height="400"
            fill={colors.background}
            opacity="0.5"
          />
          <g opacity="0.3" fill={colors.textSecondary}>
            <path d="M 380 120 Q 390 110, 410 115 T 440 125 L 445 135 Q 440 145, 425 150 L 410 145 Q 395 140, 385 135 Z" />
            <path d="M 390 200 Q 400 180, 420 185 L 430 220 Q 425 250, 410 260 L 395 255 Q 385 235, 390 210 Z" />
            <path d="M 180 120 Q 200 100, 230 110 L 260 130 Q 265 160, 250 180 L 220 190 Q 195 175, 185 150 Z" />
            <path d="M 240 220 Q 255 200, 270 210 L 275 250 Q 265 280, 250 290 L 235 285 Q 230 260, 235 235 Z" />
            <path d="M 480 140 Q 520 130, 560 145 L 580 170 Q 575 195, 550 205 L 520 200 Q 490 185, 485 165 Z" />
            <path d="M 600 280 Q 620 270, 640 275 L 645 295 Q 635 305, 615 300 L 605 290 Z" />
          </g>
          <g stroke={colors.cardBorder} strokeWidth="0.5" opacity="0.3">
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="400" />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 100} x2="800" y2={i * 100} />
            ))}
          </g>
          {locations.map((location) => {
            const { x, y } = latLngToXY(location.lat, location.lng);
            const isSelected = selectedRegion === location.id;
            const isHovered = hoveredRegion === location.id;

            return (
              <g
                key={location.id}
                onMouseEnter={() => setHoveredRegion(location.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                onClick={() => onRegionSelect(location.id)}
                style={{ cursor: "pointer" }}
              >
                {(isSelected || isHovered) && (
                  <circle
                    cx={x}
                    cy={y}
                    r="20"
                    fill={colors.accent}
                    opacity="0.2"
                    className="animate-pulse"
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? "8" : isHovered ? "7" : "6"}
                  fill={
                    isSelected
                      ? colors.accent
                      : location.status === "live"
                        ? liveColor
                        : colors.textSecondary
                  }
                  className="transition-all"
                />
                {location.status === "live" && (
                  <circle
                    cx={x}
                    cy={y}
                    r="10"
                    fill="none"
                    stroke={colors.accent}
                    strokeWidth="2"
                    opacity="0.5"
                    className="animate-ping"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {hoveredRegion && (
          <div
            className="absolute top-4 left-4 p-3 rounded-lg border shadow-lg z-10 pointer-events-none"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.cardBorder,
            }}
          >
            {(() => {
              const region = locations.find((l) => l.id === hoveredRegion);
              if (!region) return null;
              return (
                <>
                  <div
                    className="text-sm font-semibold mb-1"
                    style={{ color: colors.textPrimary }}
                  >
                    {region.city}, {region.country}
                  </div>
                  <div
                    className="text-xs space-y-0.5"
                    style={{ color: colors.textSecondary }}
                  >
                    <div>{region.packages} packages</div>
                    <div>{region.yachts} yachts</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor:
                            region.status === "live"
                              ? colors.accent
                              : colors.textSecondary,
                        }}
                      />
                      <span className="capitalize">{region.status}</span>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
          className="p-2 rounded-lg border backdrop-blur-sm transition-all hover:scale-110"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.cardBorder,
            color: colors.textPrimary,
          }}
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))}
          className="p-2 rounded-lg border backdrop-blur-sm transition-all hover:scale-110"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.cardBorder,
            color: colors.textPrimary,
          }}
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      <div
        className="absolute top-4 right-4 p-3 rounded-lg border backdrop-blur-sm"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder,
        }}
      >
        <div
          className="text-xs space-y-2"
          style={{ color: colors.textSecondary }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.accent }}
            />
            <span>Live</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.textSecondary }}
            />
            <span>Draft</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorldMap;
