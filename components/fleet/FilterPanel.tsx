import { ChevronDown, Search, SlidersHorizontal } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface FilterPanelProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedRegion: string;
  selectedType: string;
  selectedStatus: string;
  capacityRange: [number, number];
  yearRange: [number, number];
  onRegionChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function FilterPanel({ 
  searchQuery, 
  onSearchChange,
  selectedRegion,
  selectedType,
  selectedStatus,
  onRegionChange,
  onTypeChange,
  onStatusChange
}: FilterPanelProps) {
  const { colors } = useTheme();
  
  const regions = ['All Regions', 'Mediterranean', 'Caribbean', 'Pacific', 'Indian Ocean'];
  const types = ['All Types', 'Sailboat', 'Motor Yacht', 'Catamaran'];
  const statuses = ['All Status', 'Available', 'Booked', 'Maintenance'];
  
  return (
    <div 
      className="rounded-xl p-6 border backdrop-blur-sm sticky top-[96px]"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder
      }}
    >
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="w-5 h-5" style={{ color: colors.accent }} />
        <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Filters</h3>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
          Search Yacht
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.textSecondary }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition-all"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder,
              color: colors.textPrimary
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = `${colors.accent}50`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = colors.cardBorder;
            }}
          />
        </div>
      </div>
      
      {/* Region Filter */}
      <div className="mb-6">
        <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
          Region
        </label>
        <div className="relative">
          <select
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border text-sm appearance-none transition-all cursor-pointer"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder,
              color: colors.textPrimary
            }}
          >
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: colors.textSecondary }} />
        </div>
      </div>
      
      {/* Type Filter */}
      <div className="mb-6">
        <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
          Yacht Type
        </label>
        <div className="relative">
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border text-sm appearance-none transition-all cursor-pointer"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder,
              color: colors.textPrimary
            }}
          >
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: colors.textSecondary }} />
        </div>
      </div>
      
      {/* Status Filter */}
      <div className="mb-6">
        <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
          Status
        </label>
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border text-sm appearance-none transition-all cursor-pointer"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder,
              color: colors.textPrimary
            }}
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: colors.textSecondary }} />
        </div>
      </div>
      
      {/* Capacity Range */}
      <div className="mb-6">
        <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
          Capacity
        </label>
        <div className="flex items-center gap-2 text-sm" style={{ color: colors.textPrimary }}>
          <span>2</span>
          <div className="flex-1 h-1 rounded-full relative" style={{ backgroundColor: `${colors.cardBorder}` }}>
            <div className="absolute h-full rounded-full" style={{ width: '60%', backgroundColor: colors.accent }} />
          </div>
          <span>20</span>
        </div>
        <div className="text-xs mt-2 text-center" style={{ color: colors.textSecondary }}>
          2 - 12 guests
        </div>
      </div>
      
      {/* Year Range */}
      <div className="mb-6">
        <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
          Year Built
        </label>
        <div className="flex items-center gap-2 text-sm" style={{ color: colors.textPrimary }}>
          <span>2015</span>
          <div className="flex-1 h-1 rounded-full relative" style={{ backgroundColor: `${colors.cardBorder}` }}>
            <div className="absolute h-full rounded-full" style={{ width: '70%', backgroundColor: colors.accent }} />
          </div>
          <span>2024</span>
        </div>
        <div className="text-xs mt-2 text-center" style={{ color: colors.textSecondary }}>
          2018 - 2024
        </div>
      </div>
      
      {/* Clear Filters Button */}
      <button 
        className="w-full py-2.5 rounded-lg border text-sm font-medium transition-all"
        style={{
          backgroundColor: 'transparent',
          borderColor: colors.cardBorder,
          color: colors.textSecondary
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = colors.accent;
          e.currentTarget.style.color = colors.accent;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = colors.cardBorder;
          e.currentTarget.style.color = colors.textSecondary;
        }}
      >
        Clear Filters
      </button>
    </div>
  );
}
