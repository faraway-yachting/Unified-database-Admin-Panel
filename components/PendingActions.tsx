import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PendingAction {
  id: string;
  type: 'urgent' | 'warning' | 'info';
  title: string;
  description: string;
  time: string;
}

interface PendingActionsProps {
  actions: PendingAction[];
}

export function PendingActions({ actions }: PendingActionsProps) {
  const { colors } = useTheme();
  
  const getTypeConfig = (type: 'urgent' | 'warning' | 'info') => {
    switch (type) {
      case 'urgent':
        return {
          icon: AlertCircle,
          color: colors.danger,
          bgColor: `${colors.danger}15`,
          borderColor: `${colors.danger}50`
        };
      case 'warning':
        return {
          icon: Clock,
          color: colors.accentGold,
          bgColor: `${colors.accentGold}15`,
          borderColor: `${colors.accentGold}50`
        };
      case 'info':
        return {
          icon: CheckCircle,
          color: colors.accent,
          bgColor: `${colors.accent}15`,
          borderColor: `${colors.accent}50`
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
        <h3 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>Pending Actions</h3>
        <p className="text-sm" style={{ color: colors.textSecondary }}>Items requiring attention</p>
      </div>
      
      <div className="space-y-3">
        {actions.map((action) => {
          const config = getTypeConfig(action.type);
          const Icon = config.icon;
          
          return (
            <div 
              key={action.id}
              className="flex items-start gap-3 p-4 rounded-lg border"
              style={{
                backgroundColor: config.bgColor,
                borderColor: config.borderColor
              }}
            >
              <div 
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: colors.background,
                  color: config.color
                }}
              >
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>{action.title}</h4>
                <p className="text-xs mb-2" style={{ color: colors.textSecondary }}>{action.description}</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" style={{ color: colors.textSecondary }} />
                  <span className="text-xs" style={{ color: colors.textSecondary }}>{action.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
