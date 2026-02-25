import { Edit, Pause, Plus, Users } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Sequence {
  id: string;
  name: string;
  trigger: string;
  steps: number;
  activeCustomers: number;
  isActive: boolean;
}

interface FollowUpSequencesProps {
  sequences: Sequence[];
  onEdit: (sequence: Sequence) => void;
  onToggle: (sequence: Sequence) => void;
  onCreateNew: () => void;
}

export function FollowUpSequences({ sequences, onEdit, onToggle, onCreateNew }: FollowUpSequencesProps) {
  const { colors } = useTheme();
  
  return (
    <div 
      className="rounded-xl p-4 md:p-6 border backdrop-blur-sm"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder
      }}
    >
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h3 className="text-base md:text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
            Follow-up Sequences
          </h3>
          <p className="text-xs md:text-sm" style={{ color: colors.textSecondary }}>
            {sequences.length} automated sequences
          </p>
        </div>
        <button 
          onClick={onCreateNew}
          className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-all text-xs md:text-sm font-semibold text-white"
          style={{
            background: `linear-gradient(to right, ${colors.accent}, #00B39F)`,
            boxShadow: `0 10px 25px -5px ${colors.accent}30`
          }}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Sequence</span>
        </button>
      </div>
      
      <div className="space-y-3">
        {sequences.map((sequence) => (
          <div 
            key={sequence.id}
            className="p-4 rounded-lg border transition-all"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder
            }}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <div className="text-sm md:text-base font-semibold mb-1" style={{ color: colors.textPrimary }}>
                  {sequence.name}
                </div>
                <div className="text-xs md:text-sm mb-2" style={{ color: colors.textSecondary }}>
                  Trigger: {sequence.trigger}
                </div>
                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs">
                  <div className="flex items-center gap-1.5" style={{ color: colors.textSecondary }}>
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: colors.accent }}
                    />
                    <span>{sequence.steps} steps</span>
                  </div>
                  <div className="flex items-center gap-1.5" style={{ color: colors.textSecondary }}>
                    <Users className="w-3 h-3" />
                    <span>{sequence.activeCustomers} active</span>
                  </div>
                </div>
              </div>
              
              {/* Status Toggle */}
              <button
                onClick={() => onToggle(sequence)}
                className="relative w-12 h-6 rounded-full transition-all flex-shrink-0"
                style={{
                  backgroundColor: sequence.isActive ? colors.accent : `${colors.textSecondary}30`
                }}
              >
                <div 
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg transition-all"
                  style={{
                    left: sequence.isActive ? 'calc(100% - 20px)' : '4px'
                  }}
                />
              </button>
            </div>
            
            <div className="flex gap-2 pt-3 border-t" style={{ borderColor: colors.cardBorder }}>
              <button 
                onClick={() => onEdit(sequence)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-xs md:text-sm font-medium transition-all"
                style={{
                  backgroundColor: colors.cardBg,
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
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button 
                onClick={() => onToggle(sequence)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-xs md:text-sm font-medium transition-all"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.cardBorder,
                  color: colors.textSecondary
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.accentGold;
                  e.currentTarget.style.color = colors.accentGold;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.cardBorder;
                  e.currentTarget.style.color = colors.textSecondary;
                }}
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
