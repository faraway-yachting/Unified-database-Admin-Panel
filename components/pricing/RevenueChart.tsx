import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

interface RevenueChartProps {
  data: Array<{
    month: string;
    mediterranean: number;
    caribbean: number;
    pacific: number;
    indianOcean: number;
  }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const { colors } = useTheme();
  const [timeFilter, setTimeFilter] = useState('1Y');
  
  const timeFilters = ['1M', '3M', '6M', '1Y'];
  
  const regionColors = {
    mediterranean: colors.accent,
    caribbean: colors.accentGold,
    pacific: '#8B5CF6',
    indianOcean: '#EC4899'
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
          <h3 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
            Revenue Overview
          </h3>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Monthly revenue by region
          </p>
        </div>
        
        {/* Time Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: colors.background }}>
          {timeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: timeFilter === filter ? colors.accent : 'transparent',
                color: timeFilter === filter ? '#FFFFFF' : colors.textSecondary
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorMediterranean" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={regionColors.mediterranean} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={regionColors.mediterranean} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCaribbean" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={regionColors.caribbean} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={regionColors.caribbean} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPacific" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={regionColors.pacific} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={regionColors.pacific} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorIndianOcean" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={regionColors.indianOcean} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={regionColors.indianOcean} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.cardBorder} opacity={0.3} />
            <XAxis 
              dataKey="month" 
              stroke={colors.textSecondary} 
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke={colors.textSecondary} 
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${value}k`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: '8px',
                color: colors.textPrimary
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
            />
            <Area 
              type="monotone" 
              dataKey="mediterranean" 
              stackId="1"
              stroke={regionColors.mediterranean} 
              fill="url(#colorMediterranean)"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="caribbean" 
              stackId="1"
              stroke={regionColors.caribbean} 
              fill="url(#colorCaribbean)"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="pacific" 
              stackId="1"
              stroke={regionColors.pacific} 
              fill="url(#colorPacific)"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="indianOcean" 
              stackId="1"
              stroke={regionColors.indianOcean} 
              fill="url(#colorIndianOcean)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t" style={{ borderColor: colors.cardBorder }}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: regionColors.mediterranean }} />
          <span className="text-xs" style={{ color: colors.textSecondary }}>Mediterranean</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: regionColors.caribbean }} />
          <span className="text-xs" style={{ color: colors.textSecondary }}>Caribbean</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: regionColors.pacific }} />
          <span className="text-xs" style={{ color: colors.textSecondary }}>Pacific</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: regionColors.indianOcean }} />
          <span className="text-xs" style={{ color: colors.textSecondary }}>Indian Ocean</span>
        </div>
      </div>
    </div>
  );
}
