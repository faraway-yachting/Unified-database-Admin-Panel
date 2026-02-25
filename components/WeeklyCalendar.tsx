import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Generate weeks of calendar data
function generateWeekData(weekOffset: number = 0) {
  const today = new Date(2026, 1, 18); // Feb 18, 2026
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7)); // Start on Monday
  
  const days = [];
  const bookingCounts = [
    [8, 12, 9, 15, 18, 22, 19],    // Current week
    [7, 10, 11, 13, 16, 20, 17],   // Previous week
    [10, 14, 12, 16, 19, 24, 21],  // Next week
    [6, 9, 8, 12, 14, 18, 15],     // Two weeks ago
    [9, 13, 11, 17, 20, 25, 22],   // Two weeks ahead
  ];
  
  const weekIndex = Math.abs(weekOffset % 5);
  const counts = bookingCounts[weekIndex];
  
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(startOfWeek.getDate() + i);
    
    const isToday = currentDay.getDate() === today.getDate() && 
                    currentDay.getMonth() === today.getMonth() &&
                    currentDay.getFullYear() === today.getFullYear();
    
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    days.push({
      date: currentDay.getDate().toString(),
      dayName: dayNames[i],
      bookingCount: counts[i],
      isToday,
      fullDate: currentDay
    });
  }
  
  return days;
}

function getWeekLabel(weekOffset: number) {
  if (weekOffset === 0) return 'This Week';
  if (weekOffset === -1) return 'Last Week';
  if (weekOffset === 1) return 'Next Week';
  if (weekOffset < 0) return `${Math.abs(weekOffset)} Weeks Ago`;
  return `${weekOffset} Weeks Ahead`;
}

export function WeeklyCalendar() {
  const { colors } = useTheme();
  const [weekOffset, setWeekOffset] = useState(0);
  const days = generateWeekData(weekOffset);
  
  const handlePrevWeek = () => {
    setWeekOffset(prev => prev - 1);
  };
  
  const handleNextWeek = () => {
    setWeekOffset(prev => prev + 1);
  };
  
  const getMonthYear = () => {
    if (days.length === 0) return '';
    const firstDay = days[0].fullDate;
    const lastDay = days[6].fullDate;
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (firstDay.getMonth() === lastDay.getMonth()) {
      return `${monthNames[firstDay.getMonth()]} ${firstDay.getFullYear()}`;
    } else {
      return `${monthNames[firstDay.getMonth()]} - ${monthNames[lastDay.getMonth()]} ${lastDay.getFullYear()}`;
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>{getWeekLabel(weekOffset)}</h3>
          <p className="text-sm" style={{ color: colors.textSecondary }}>{getMonthYear()}</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrevWeek}
            className="p-1.5 rounded-lg border transition-all"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${colors.accent}50`;
              e.currentTarget.style.backgroundColor = `${colors.accent}0D`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.cardBorder;
              e.currentTarget.style.backgroundColor = colors.background;
            }}
          >
            <ChevronLeft className="w-4 h-4" style={{ color: colors.textSecondary }} />
          </button>
          <button 
            onClick={handleNextWeek}
            className="p-1.5 rounded-lg border transition-all"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${colors.accent}50`;
              e.currentTarget.style.backgroundColor = `${colors.accent}0D`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.cardBorder;
              e.currentTarget.style.backgroundColor = colors.background;
            }}
          >
            <ChevronRight className="w-4 h-4" style={{ color: colors.textSecondary }} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-3">
        {days.map((day, index) => (
          <div 
            key={index}
            className="p-3 rounded-lg border transition-all cursor-pointer"
            style={{
              backgroundColor: day.isToday ? `${colors.accent}15` : colors.background,
              borderColor: day.isToday ? `${colors.accent}80` : colors.cardBorder
            }}
            onMouseEnter={(e) => {
              if (!day.isToday) {
                e.currentTarget.style.borderColor = `${colors.textSecondary}30`;
              }
            }}
            onMouseLeave={(e) => {
              if (!day.isToday) {
                e.currentTarget.style.borderColor = colors.cardBorder;
              }
            }}
          >
            <div className="text-center">
              <div 
                className="text-[10px] font-medium mb-1 uppercase tracking-wide"
                style={{ color: day.isToday ? colors.accent : colors.textSecondary }}
              >
                {day.dayName}
              </div>
              <div 
                className="text-lg font-bold mb-1.5"
                style={{ color: day.isToday ? colors.accent : colors.textPrimary }}
              >
                {day.date}
              </div>
              <div 
                className="text-[11px] font-mono"
                style={{ color: day.bookingCount > 0 ? colors.accentGold : colors.textSecondary }}
              >
                {day.bookingCount}
              </div>
              <div 
                className="text-[9px] mt-0.5"
                style={{ color: day.bookingCount > 0 ? colors.textSecondary : `${colors.textSecondary}80` }}
              >
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}