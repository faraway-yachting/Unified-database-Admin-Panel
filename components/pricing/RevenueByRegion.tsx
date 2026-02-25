import { Crown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface RegionRevenue {
  name: string;
  flag: string;
  revenue: number;
  bookings: number;
  percentage: number;
}

interface RevenueByRegionProps {
  regions: RegionRevenue[];
}

export function RevenueByRegion({ regions }: RevenueByRegionProps) {
  const { colors } = useTheme();
  
  return (
    <div 
      className="rounded-xl p-6 border backdrop-blur-sm"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder
      }}
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
          Revenue by Region
        </h3>
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          Regional performance breakdown
        </p>
      </div>
      
      <div className="space-y-4">
        {regions.map((region, idx) => {
          const isTopPerformer = idx === 0;
          
          return (
            <div 
              key={region.name}
              className="p-4 rounded-lg border transition-all"
              style={{
                backgroundColor: isTopPerformer ? `${colors.accentGold}0A` : colors.background,
                borderColor: isTopPerformer ? `${colors.accentGold}30` : colors.cardBorder
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">{region.flag}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      {region.name}
                    </span>
                    {isTopPerformer && (
                      <Crown className="w-4 h-4" style={{ color: colors.accentGold }} />
                    )}
                  </div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>
                    {region.bookings} bookings
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-mono font-bold" style={{ color: colors.textPrimary }}>
                    ${(region.revenue / 1000).toFixed(0)}k
                  </div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>
                    {region.percentage}%
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${colors.cardBorder}` }}>
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ 
                    width: `${region.percentage}%`,
                    backgroundColor: isTopPerformer ? colors.accentGold : colors.accent
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
