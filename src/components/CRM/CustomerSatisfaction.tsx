"use client";

import { Star, Ship } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface SurveyResponse {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  yachtPackage: string;
  date: string;
}

interface CustomerSatisfactionProps {
  avgRating: number;
  responses: SurveyResponse[];
}

export function CustomerSatisfaction({
  avgRating,
  responses,
}: CustomerSatisfactionProps) {
  const { colors } = useTheme();

  const ratingDistribution = [
    { stars: 5, count: 45, percentage: 65 },
    { stars: 4, count: 18, percentage: 26 },
    { stars: 3, count: 4, percentage: 6 },
    { stars: 2, count: 2, percentage: 3 },
    { stars: 1, count: 0, percentage: 0 },
  ];

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
          Customer Satisfaction
        </h3>
        <p
          className="text-xs md:text-sm"
          style={{ color: colors.textSecondary }}
        >
          {responses.length} survey responses
        </p>
      </div>

      <div className="flex flex-col items-center mb-6">
        <div
          className="relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center mb-4"
          style={{
            background: `conic-gradient(
              ${colors.accentGold} 0deg ${(avgRating / 5) * 360}deg,
              ${colors.cardBorder} ${(avgRating / 5) * 360}deg 360deg
            )`,
          }}
        >
          <div
            className="w-24 h-24 md:w-32 md:h-32 rounded-full flex flex-col items-center justify-center"
            style={{ backgroundColor: colors.background }}
          >
            <div
              className="text-3xl md:text-4xl font-bold font-mono"
              style={{ color: colors.textPrimary }}
            >
              {avgRating.toFixed(1)}
            </div>
            <div className="flex items-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-3 h-3 md:w-4 md:h-4"
                  style={{
                    color:
                      star <= Math.floor(avgRating)
                        ? colors.accentGold
                        : colors.cardBorder,
                    fill:
                      star <= Math.floor(avgRating)
                        ? colors.accentGold
                        : "none",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-xs space-y-2">
          {ratingDistribution.map((dist) => (
            <div key={dist.stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12">
                <span
                  className="text-xs font-medium"
                  style={{ color: colors.textPrimary }}
                >
                  {dist.stars}
                </span>
                <Star
                  className="w-3 h-3"
                  style={{
                    color: colors.accentGold,
                    fill: colors.accentGold,
                  }}
                />
              </div>
              <div
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: colors.cardBorder }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${dist.percentage}%`,
                    backgroundColor: colors.accentGold,
                  }}
                />
              </div>
              <span
                className="text-xs font-mono w-8 text-right"
                style={{ color: colors.textSecondary }}
              >
                {dist.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4
          className="text-sm font-bold uppercase tracking-wide mb-3"
          style={{ color: colors.textPrimary }}
        >
          Recent Feedback
        </h4>
        <div className="space-y-3">
          {responses.map((response) => (
            <div
              key={response.id}
              className="p-3 md:p-4 rounded-lg border"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder,
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-semibold mb-1"
                    style={{ color: colors.textPrimary }}
                  >
                    {response.customerName}
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-3 h-3"
                        style={{
                          color:
                            star <= response.rating
                              ? colors.accentGold
                              : colors.cardBorder,
                          fill:
                            star <= response.rating
                              ? colors.accentGold
                              : "none",
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div
                  className="text-xs flex-shrink-0"
                  style={{ color: colors.textSecondary }}
                >
                  {response.date}
                </div>
              </div>

              <p
                className="text-xs md:text-sm mb-3 line-clamp-2"
                style={{ color: colors.textSecondary }}
              >
                {response.comment}
              </p>

              <div
                className="flex items-center gap-2 text-xs"
                style={{ color: colors.textSecondary }}
              >
                <Ship className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{response.yachtPackage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomerSatisfaction;
