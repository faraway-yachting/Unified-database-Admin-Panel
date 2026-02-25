import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface BookingKPICardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change: number;
}

export function BookingKPICard({ icon: Icon, label, value, change }: BookingKPICardProps) {
  const { colors } = useTheme();
  const isPositive = change >= 0;
  
  return (
    <div 
      className="rounded-xl p-6 border backdrop-blur-sm relative overflow-hidden group transition-all"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${colors.accent}50`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colors.cardBorder;
      }}
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(to bottom right, ${colors.accent}0D, transparent)`
        }}
      />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div 
            className="p-2.5 rounded-lg"
            style={{ backgroundColor: `${colors.accent}15` }}
          >
            <Icon className="w-5 h-5" style={{ color: colors.accent }} />
          </div>
          
          {/* Change Badge */}
          <div 
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: isPositive ? `${colors.success}15` : `${colors.danger}15`,
              color: isPositive ? colors.success : colors.danger
            }}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{Math.abs(change)}%</span>
          </div>
        </div>
        
        <div className="text-3xl font-mono font-bold mb-1" style={{ color: colors.textPrimary }}>
          {value}
        </div>
        <div className="text-sm" style={{ color: colors.textSecondary }}>
          {label}
        </div>
      </div>
    </div>
  );
}
