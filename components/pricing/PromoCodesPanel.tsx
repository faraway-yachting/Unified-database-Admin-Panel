import { Copy, Power, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  usageCount: number;
  expiryDate: string;
  status: 'active' | 'expired';
}

interface PromoCodesPanelProps {
  promoCodes: PromoCode[];
  onCopy: (code: PromoCode) => void;
  onDeactivate: (code: PromoCode) => void;
  onCreate: () => void;
}

export function PromoCodesPanel({ promoCodes, onCopy, onDeactivate, onCreate }: PromoCodesPanelProps) {
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
          <h3 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>Promo Codes</h3>
          <p className="text-sm" style={{ color: colors.textSecondary }}>{promoCodes.length} active codes</p>
        </div>
        <button 
          onClick={onCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            backgroundColor: `${colors.accent}15`,
            color: colors.accent,
            border: `1px solid ${colors.accent}30`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${colors.accent}25`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = `${colors.accent}15`;
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Create Code</span>
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
              <th className="text-left text-xs font-semibold uppercase tracking-wide pb-3 px-2" style={{ color: colors.textSecondary }}>Code</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide pb-3 px-2" style={{ color: colors.textSecondary }}>Type</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide pb-3 px-2" style={{ color: colors.textSecondary }}>Value</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide pb-3 px-2" style={{ color: colors.textSecondary }}>Usage</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide pb-3 px-2" style={{ color: colors.textSecondary }}>Expires</th>
              <th className="text-center text-xs font-semibold uppercase tracking-wide pb-3 px-2" style={{ color: colors.textSecondary }}>Status</th>
              <th className="text-center text-xs font-semibold uppercase tracking-wide pb-3 px-2" style={{ color: colors.textSecondary }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promoCodes.map((promo) => (
              <tr 
                key={promo.id}
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
                  <div className="text-sm font-mono font-bold" style={{ color: colors.accent }}>
                    {promo.code}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="text-sm capitalize" style={{ color: colors.textSecondary }}>
                    {promo.discountType}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="text-sm font-mono font-semibold" style={{ color: colors.textPrimary }}>
                    {promo.discountType === 'percentage' ? `${promo.value}%` : `$${promo.value}`}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="text-sm font-mono" style={{ color: colors.textPrimary }}>
                    {promo.usageCount}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="text-sm" style={{ color: colors.textSecondary }}>
                    {promo.expiryDate}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="flex justify-center">
                    <div 
                      className="px-2 py-1 rounded-full text-xs font-medium capitalize"
                      style={{
                        backgroundColor: promo.status === 'active' ? `${colors.success}15` : `${colors.danger}15`,
                        color: promo.status === 'active' ? colors.success : colors.danger
                      }}
                    >
                      {promo.status}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => onCopy(promo)}
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
                      title="Copy"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {promo.status === 'active' && (
                      <button 
                        onClick={() => onDeactivate(promo)}
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
                        title="Deactivate"
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    )}
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
