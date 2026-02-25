import { Package, Ship, Globe, Settings, FileEdit, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Activity {
  id: string;
  type: 'package' | 'yacht' | 'site' | 'settings';
  description: string;
  region: string;
  admin: string;
  timestamp: string;
}

interface ActivityLogProps {
  activities: Activity[];
}

const activityIcons = {
  package: Package,
  yacht: Ship,
  site: Globe,
  settings: Settings,
};

const activityColors = {
  package: '#00C9B1',
  yacht: '#F4A924',
  site: '#8B5CF6',
  settings: '#6B7280',
};

export function ActivityLog({ activities }: ActivityLogProps) {
  const { colors } = useTheme();
  
  return (
    <div 
      className="rounded-lg border p-4 md:p-6"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder
      }}
    >
      <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
        Recent Activity
      </h3>
      
      <div className="space-y-4 max-h-[480px] overflow-y-auto">
        {activities.map((activity, index) => {
          const Icon = activityIcons[activity.type];
          const iconColor = activityColors[activity.type];
          
          return (
            <div key={activity.id} className="flex gap-3">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${iconColor}20`
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: iconColor }} />
                </div>
                {index < activities.length - 1 && (
                  <div 
                    className="w-px flex-1 mt-2"
                    style={{ backgroundColor: colors.cardBorder }}
                  />
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 pb-4">
                <div 
                  className="text-sm mb-1"
                  style={{ color: colors.textPrimary }}
                >
                  {activity.description}
                </div>
                <div 
                  className="text-xs mb-2"
                  style={{ color: colors.textSecondary }}
                >
                  <span className="font-medium">{activity.region}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="flex items-center gap-1.5 px-2 py-1 rounded text-xs"
                    style={{
                      backgroundColor: colors.background,
                      color: colors.textSecondary
                    }}
                  >
                    <User className="w-3 h-3" />
                    {activity.admin}
                  </div>
                  <span 
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
