import { Eye, Edit, Anchor, Users, Calendar } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface Yacht {
  id: string;
  name: string;
  type: 'Sailboat' | 'Motor Yacht' | 'Catamaran';
  image: string;
  length: number;
  capacity: number;
  year: number;
  region: string;
  status: 'Available' | 'Booked' | 'Maintenance';
}

interface YachtCardProps {
  yacht: Yacht;
  onViewDetails: (yacht: Yacht) => void;
  onEdit: (yacht: Yacht) => void;
}

export function YachtCard({ yacht, onViewDetails, onEdit }: YachtCardProps) {
  const { colors } = useTheme();
  
  const getStatusConfig = () => {
    switch (yacht.status) {
      case 'Available':
        return { bgColor: `${colors.accent}15`, textColor: colors.accent, borderColor: `${colors.accent}50` };
      case 'Booked':
        return { bgColor: `${colors.accentGold}15`, textColor: colors.accentGold, borderColor: `${colors.accentGold}50` };
      case 'Maintenance':
        return { bgColor: `${colors.danger}15`, textColor: colors.danger, borderColor: `${colors.danger}50` };
    }
  };
  
  const getTypeColor = () => {
    switch (yacht.type) {
      case 'Sailboat':
        return '#8B5CF6';
      case 'Motor Yacht':
        return '#EC4899';
      case 'Catamaran':
        return '#06B6D4';
    }
  };
  
  const statusConfig = getStatusConfig();
  
  return (
    <div 
      className="rounded-xl border backdrop-blur-sm overflow-hidden group transition-all"
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
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={yacht.image} 
          alt={yacht.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Type Badge */}
        <div 
          className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
          style={{
            backgroundColor: `${getTypeColor()}30`,
            color: getTypeColor(),
            border: `1px solid ${getTypeColor()}50`
          }}
        >
          {yacht.type}
        </div>
        
        {/* Status Badge */}
        <div 
          className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border"
          style={{
            backgroundColor: statusConfig.bgColor,
            color: statusConfig.textColor,
            borderColor: statusConfig.borderColor
          }}
        >
          {yacht.status}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Name & Region */}
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-1 truncate" style={{ color: colors.textPrimary }}>
            {yacht.name}
          </h3>
          <div className="flex items-center gap-2 text-sm" style={{ color: colors.textSecondary }}>
            <Anchor className="w-4 h-4" />
            <span>{yacht.region}</span>
          </div>
        </div>
        
        {/* Specs */}
        <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b" style={{ borderColor: colors.cardBorder }}>
          <div>
            <div className="text-xs mb-1" style={{ color: colors.textSecondary }}>Length</div>
            <div className="text-sm font-mono font-bold" style={{ color: colors.textPrimary }}>
              {yacht.length}ft
            </div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: colors.textSecondary }}>Capacity</div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" style={{ color: colors.accent }} />
              <span className="text-sm font-mono font-bold" style={{ color: colors.textPrimary }}>
                {yacht.capacity}
              </span>
            </div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: colors.textSecondary }}>Year</div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" style={{ color: colors.accentGold }} />
              <span className="text-sm font-mono font-bold" style={{ color: colors.textPrimary }}>
                {yacht.year}
              </span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => onViewDetails(yacht)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder,
              color: colors.textPrimary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.accent;
              e.currentTarget.style.backgroundColor = `${colors.accent}0D`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.cardBorder;
              e.currentTarget.style.backgroundColor = colors.background;
            }}
          >
            <Eye className="w-4 h-4" />
            <span>Details</span>
          </button>
          <button 
            onClick={() => onEdit(yacht)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
            style={{
              background: `linear-gradient(to right, ${colors.accent}, #00B39F)`
            }}
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
