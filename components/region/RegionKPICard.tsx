import { LucideIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface RegionKPICardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  status: string;
  statusColor?: string;
}

export function RegionKPICard({ icon: Icon, label, value, status, statusColor = '#00C9B1' }: RegionKPICardProps) {
  const { colors } = useTheme();
  
  return (
    <div 
      className="relative overflow-hidden rounded-lg p-4 md:p-6 border backdrop-blur-sm transition-all hover:scale-[1.02]"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div 
          className="p-2.5 md:p-3 rounded-lg"
          style={{
            backgroundColor: `${colors.accent}15`
          }}
        >
          <Icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: colors.accent }} />
        </div>
      </div>
      
      <div className="mb-2">
        <div 
          className="text-2xl md:text-3xl font-bold font-mono mb-1"
          style={{ color: colors.textPrimary }}
        >
          {value}
        </div>
        <div 
          className="text-xs md:text-sm"
          style={{ color: colors.textSecondary }}
        >
          {label}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div 
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: statusColor }}
        />
        <span 
          className="text-xs md:text-sm font-medium"
          style={{ color: statusColor }}
        >
          {status}
        </span>
      </div>
    </div>
  );
}
