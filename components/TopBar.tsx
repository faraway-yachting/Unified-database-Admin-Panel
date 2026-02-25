import { Bell, Calendar, ChevronDown, Plus, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface TopBarProps {
  pageTitle: string;
  currentRegion: string;
  regions: string[];
  notificationCount: number;
}

export function TopBar({ pageTitle, currentRegion, regions, notificationCount }: TopBarProps) {
  const { theme, toggleTheme, colors } = useTheme();
  
  return (
    <div 
      className="fixed top-0 left-[240px] right-0 h-[72px] border-b backdrop-blur-sm z-10"
      style={{ 
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder
      }}
    >
      <div className="h-full px-8 flex items-center justify-between">
        {/* Page Title */}
        <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{pageTitle}</h1>
        
        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Region Dropdown */}
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:border-opacity-50 transition-all text-sm"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder,
              color: colors.textPrimary
            }}
          >
            <span className="font-medium">{currentRegion}</span>
            <ChevronDown className="w-4 h-4" style={{ color: colors.textSecondary }} />
          </button>
          
          {/* Date Picker */}
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:border-opacity-50 transition-all text-sm"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder,
              color: colors.textPrimary
            }}
          >
            <Calendar className="w-4 h-4" style={{ color: colors.textSecondary }} />
            <span className="font-medium">Feb 18, 2026</span>
          </button>
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-lg border hover:border-opacity-50 transition-all"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder
            }}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" style={{ color: colors.accentGold }} />
            ) : (
              <Moon className="w-5 h-5" style={{ color: colors.accent }} />
            )}
          </button>
          
          {/* Notifications */}
          <button 
            className="relative p-2.5 rounded-lg border hover:border-opacity-50 transition-all"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder
            }}
          >
            <Bell className="w-5 h-5" style={{ color: colors.textSecondary }} />
            {notificationCount > 0 && (
              <div 
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.accentGold }}
              >
                <span className="text-xs font-bold" style={{ color: colors.background }}>{notificationCount}</span>
              </div>
            )}
          </button>
          
          {/* New Booking Button */}
          <button 
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all text-sm font-semibold text-white shadow-lg"
            style={{
              background: `linear-gradient(to right, ${colors.accent}, #00B39F)`,
              boxShadow: `0 10px 25px -5px ${colors.accent}30`
            }}
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </button>
        </div>
      </div>
    </div>
  );
}