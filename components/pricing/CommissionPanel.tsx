import { Eye, Edit, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Commission {
  id: string;
  agentName: string;
  region: string;
  commissionRate: number;
  bookingsThisMonth: number;
  totalEarned: number;
  payoutStatus: 'paid' | 'pending';
}

interface CommissionPanelProps {
  commissions: Commission[];
  onView: (commission: Commission) => void;
  onEdit: (commission: Commission) => void;
  onAddAgent: () => void;
}

export function CommissionPanel({ commissions, onView, onEdit, onAddAgent }: CommissionPanelProps) {
  const { colors } = useTheme();
  
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
          <h3 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>Commission Management</h3>
          <p className="text-sm" style={{ color: colors.textSecondary }}>{commissions.length} active agents</p>
        </div>
        <button 
          onClick={onAddAgent}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            backgroundColor: `${colors.accentGold}15`,
            color: colors.accentGold,
            border: `1px solid ${colors.accentGold}30`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${colors.accentGold}25`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = `${colors.accentGold}15`;
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Agent</span>
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
              <th className="text-left text-xs font-semibold uppercase tracking-wide pb-3 px-2" style={{ color: colors.textSecondary }}>Agent/Partner</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide pb-3 px-2" style={{ color: colors.textSecondary }}>Region</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide pb-3 px-2" style={{ color: colors.textSecondary }}>Rate</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide pb-3 px-2" style={{ color: colors.textSecondary }}>Bookings</th>
              <th className="text-right text-xs font-semibold uppercase tracking-wide pb-3 px-2" style={{ color: colors.textSecondary }}>Earned</th>
              <th className="text-center text-xs font-semibold uppercase tracking-wide pb-3 px-2" style={{ color: colors.textSecondary }}>Status</th>
              <th className="text-center text-xs font-semibold uppercase tracking-wide pb-3 px-2" style={{ color: colors.textSecondary }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map((commission) => (
              <tr 
                key={commission.id}
                className="transition-colors"
                style={{ borderBottom: `1px solid ${colors.cardBorder}` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.hoverBg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <td className="py-3 px-2">
                  <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    {commission.agentName}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="text-sm" style={{ color: colors.textSecondary }}>
                    {commission.region}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="text-sm font-mono font-semibold" style={{ color: colors.accent }}>
                    {commission.commissionRate}%
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="text-sm font-mono" style={{ color: colors.textPrimary }}>
                    {commission.bookingsThisMonth}
                  </div>
                </td>
                <td className="py-3 px-2 text-right">
                  <div className="text-sm font-mono font-bold" style={{ color: colors.textPrimary }}>
                    ${commission.totalEarned.toLocaleString()}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="flex justify-center">
                    <div 
                      className="px-2 py-1 rounded-full text-xs font-medium capitalize"
                      style={{
                        backgroundColor: commission.payoutStatus === 'paid' ? `${colors.success}15` : `${colors.accentGold}15`,
                        color: commission.payoutStatus === 'paid' ? colors.success : colors.accentGold
                      }}
                    >
                      {commission.payoutStatus}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => onView(commission)}
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
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onEdit(commission)}
                      className="p-1.5 rounded-lg transition-all"
                      style={{
                        backgroundColor: colors.background,
                        color: colors.textSecondary
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${colors.accentGold}15`;
                        e.currentTarget.style.color = colors.accentGold;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colors.background;
                        e.currentTarget.style.color = colors.textSecondary;
                      }}
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
