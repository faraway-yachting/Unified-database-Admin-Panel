import { useTheme } from '../context/ThemeContext';

interface FleetStatusItem {
  id: string;
  name: string;
  image: string;
  region: string;
  status: 'available' | 'booked' | 'maintenance';
  nextAvailable?: string;
}

interface FleetStatusListProps {
  items: FleetStatusItem[];
}

export function FleetStatusList({ items }: FleetStatusListProps) {
  const { colors } = useTheme();
  
  const getStatusConfig = (status: 'available' | 'booked' | 'maintenance') => {
    switch (status) {
      case 'available':
        return { 
          label: 'Available', 
          bgColor: `${colors.accent}15`, 
          textColor: colors.accent, 
          borderColor: `${colors.accent}50` 
        };
      case 'booked':
        return { 
          label: 'Booked', 
          bgColor: `${colors.accentGold}15`, 
          textColor: colors.accentGold, 
          borderColor: `${colors.accentGold}50` 
        };
      case 'maintenance':
        return { 
          label: 'Maintenance', 
          bgColor: `${colors.danger}15`, 
          textColor: colors.danger, 
          borderColor: `${colors.danger}50` 
        };
    }
  };
  
  return (
    <div 
      className="rounded-xl p-6 border backdrop-blur-sm"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder
      }}
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>Fleet Status</h3>
        <p className="text-sm" style={{ color: colors.textSecondary }}>Real-time yacht availability</p>
      </div>
      
      <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => {
          const statusConfig = getStatusConfig(item.status);
          
          return (
            <div 
              key={item.id}
              className="flex items-center gap-4 p-3 rounded-lg border transition-all group"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${colors.accent}50`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.cardBorder;
              }}
            >
              <img 
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold mb-1 truncate" style={{ color: colors.textPrimary }}>{item.name}</h4>
                <p className="text-xs" style={{ color: colors.textSecondary }}>{item.region}</p>
                {item.nextAvailable && (
                  <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Next: {item.nextAvailable}</p>
                )}
              </div>
              <div 
                className="px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap"
                style={{
                  backgroundColor: statusConfig.bgColor,
                  color: statusConfig.textColor,
                  borderColor: statusConfig.borderColor
                }}
              >
                {statusConfig.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
