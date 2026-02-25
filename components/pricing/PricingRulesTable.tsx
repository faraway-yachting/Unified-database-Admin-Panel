import { Edit, Trash2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface PricingRule {
  id: string;
  name: string;
  package: string;
  region: string;
  dateRange: string;
  multiplier: string;
  type: 'peak' | 'holiday' | 'lastminute' | 'discount';
  status: 'active' | 'inactive';
}

interface PricingRulesTableProps {
  rules: PricingRule[];
  onEdit: (rule: PricingRule) => void;
  onDelete: (rule: PricingRule) => void;
  onToggleStatus: (rule: PricingRule) => void;
}

export function PricingRulesTable({ rules, onEdit, onDelete, onToggleStatus }: PricingRulesTableProps) {
  const { colors } = useTheme();
  
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'peak':
        return { bgColor: `${colors.accent}15`, textColor: colors.accent };
      case 'holiday':
        return { bgColor: `${colors.accentGold}15`, textColor: colors.accentGold };
      case 'lastminute':
        return { bgColor: '#FF634715', textColor: '#FF6347' };
      case 'discount':
        return { bgColor: `${colors.success}15`, textColor: colors.success };
      default:
        return { bgColor: `${colors.textSecondary}15`, textColor: colors.textSecondary };
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
        <h3 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>Pricing Rules</h3>
        <p className="text-sm" style={{ color: colors.textSecondary }}>{rules.length} active rules</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
              <th className="text-left text-xs font-semibold uppercase tracking-wide pb-4 px-2" style={{ color: colors.textSecondary }}>Rule Name</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide pb-4 px-2" style={{ color: colors.textSecondary }}>Package</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide pb-4 px-2" style={{ color: colors.textSecondary }}>Region</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide pb-4 px-2" style={{ color: colors.textSecondary }}>Date Range</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide pb-4 px-2" style={{ color: colors.textSecondary }}>Multiplier</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide pb-4 px-2" style={{ color: colors.textSecondary }}>Type</th>
              <th className="text-center text-xs font-semibold uppercase tracking-wide pb-4 px-2" style={{ color: colors.textSecondary }}>Status</th>
              <th className="text-center text-xs font-semibold uppercase tracking-wide pb-4 px-2" style={{ color: colors.textSecondary }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => {
              const typeConfig = getTypeConfig(rule.type);
              
              return (
                <tr 
                  key={rule.id}
                  className="transition-colors"
                  style={{ borderBottom: `1px solid ${colors.cardBorder}` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.hoverBg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td className="py-4 px-2">
                    <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                      {rule.name}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="text-sm" style={{ color: colors.textSecondary }}>
                      {rule.package}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="text-sm" style={{ color: colors.textSecondary }}>
                      {rule.region}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="text-sm font-mono" style={{ color: colors.textPrimary }}>
                      {rule.dateRange}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="text-sm font-mono font-bold" style={{ color: colors.accent }}>
                      {rule.multiplier}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div 
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium capitalize"
                      style={{
                        backgroundColor: typeConfig.bgColor,
                        color: typeConfig.textColor
                      }}
                    >
                      {rule.type}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex justify-center">
                      <button
                        onClick={() => onToggleStatus(rule)}
                        className="relative w-12 h-6 rounded-full transition-all"
                        style={{
                          backgroundColor: rule.status === 'active' ? colors.accent : `${colors.textSecondary}30`
                        }}
                      >
                        <div 
                          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg transition-all"
                          style={{
                            left: rule.status === 'active' ? 'calc(100% - 20px)' : '4px'
                          }}
                        />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => onEdit(rule)}
                        className="p-1.5 rounded-lg transition-all"
                        style={{
                          backgroundColor: colors.background,
                          color: colors.textSecondary
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${colors.accent}15`;
                          e.currentTarget.style.color = colors.accent;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = colors.background;
                          e.currentTarget.style.color = colors.textSecondary;
                        }}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(rule)}
                        className="p-1.5 rounded-lg transition-all"
                        style={{
                          backgroundColor: colors.background,
                          color: colors.textSecondary
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${colors.danger}15`;
                          e.currentTarget.style.color = colors.danger;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = colors.background;
                          e.currentTarget.style.color = colors.textSecondary;
                        }}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
