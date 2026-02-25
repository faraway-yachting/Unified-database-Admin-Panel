import { Plus, Edit, Trash2, RefreshCw, Info } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Currency {
  id: string;
  flag: string;
  name: string;
  code: string;
  rate: number;
  lastUpdated: string;
  autoUpdate: boolean;
}

const currencies: Currency[] = [
  { id: 'C-001', flag: '🇺🇸', name: 'US Dollar', code: 'USD', rate: 1.00, lastUpdated: 'Feb 19, 2026 10:30 AM', autoUpdate: true },
  { id: 'C-002', flag: '🇪🇺', name: 'Euro', code: 'EUR', rate: 0.92, lastUpdated: 'Feb 19, 2026 10:30 AM', autoUpdate: true },
  { id: 'C-003', flag: '🇬🇧', name: 'British Pound', code: 'GBP', rate: 0.79, lastUpdated: 'Feb 19, 2026 10:30 AM', autoUpdate: true },
  { id: 'C-004', flag: '🇦🇪', name: 'UAE Dirham', code: 'AED', rate: 3.67, lastUpdated: 'Feb 19, 2026 10:30 AM', autoUpdate: true },
  { id: 'C-005', flag: '🇨🇭', name: 'Swiss Franc', code: 'CHF', rate: 0.88, lastUpdated: 'Feb 19, 2026 10:30 AM', autoUpdate: false },
  { id: 'C-006', flag: '🇯🇵', name: 'Japanese Yen', code: 'JPY', rate: 149.82, lastUpdated: 'Feb 19, 2026 10:30 AM', autoUpdate: true },
];

export function CurrencySettings() {
  const { colors } = useTheme();
  
  return (
    <div className="space-y-6">
      {/* Base Currency Selector */}
      <div 
        className="rounded-lg border p-4 md:p-6"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder
        }}
      >
        <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: colors.textPrimary }}>
          Currency & Exchange Rates
        </h2>
        
        <div className="max-w-md">
          <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
            Base Currency
          </label>
          <select
            defaultValue="USD"
            className="w-full px-4 py-3 rounded-lg border text-sm"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder,
              color: colors.textPrimary
            }}
          >
            <option value="USD">🇺🇸 US Dollar (USD)</option>
            <option value="EUR">🇪🇺 Euro (EUR)</option>
            <option value="GBP">🇬🇧 British Pound (GBP)</option>
            <option value="AED">🇦🇪 UAE Dirham (AED)</option>
          </select>
          <p className="text-xs mt-2" style={{ color: colors.textSecondary }}>
            All exchange rates will be calculated relative to this base currency
          </p>
        </div>
      </div>
      
      {/* Currencies Table */}
      <div 
        className="rounded-lg border p-4 md:p-6"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
            Supported Currencies
          </h3>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
            style={{
              background: `linear-gradient(to right, ${colors.accent}, #00B39F)`
            }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Currency</span>
          </button>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr 
                className="border-b text-left"
                style={{ borderColor: colors.cardBorder }}
              >
                <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>Currency</th>
                <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>Code</th>
                <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>Exchange Rate</th>
                <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>Last Updated</th>
                <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>Auto-Update</th>
                <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currencies.map((currency) => (
                <tr 
                  key={currency.id}
                  className="border-b"
                  style={{ borderColor: colors.cardBorder }}
                >
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{currency.flag}</span>
                      <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                        {currency.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span 
                      className="text-sm font-mono font-semibold"
                      style={{ color: colors.textPrimary }}
                    >
                      {currency.code}
                    </span>
                  </td>
                  <td className="py-4">
                    <span 
                      className="text-sm font-mono"
                      style={{ color: colors.textPrimary }}
                    >
                      {currency.rate.toFixed(4)}
                    </span>
                  </td>
                  <td className="py-4 text-sm" style={{ color: colors.textSecondary }}>
                    {currency.lastUpdated}
                  </td>
                  <td className="py-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={currency.autoUpdate} />
                      <div 
                        className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{
                          backgroundColor: currency.autoUpdate ? colors.accent : colors.textSecondary
                        }}
                      />
                    </label>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded transition-all hover:scale-110"
                        style={{ color: colors.textSecondary }}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 rounded transition-all hover:scale-110"
                        style={{ color: colors.textSecondary }}
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {currencies.map((currency) => (
            <div
              key={currency.id}
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currency.flag}</span>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      {currency.name}
                    </div>
                    <div className="text-xs font-mono" style={{ color: colors.textSecondary }}>
                      {currency.code}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-mono font-bold" style={{ color: colors.textPrimary }}>
                    {currency.rate.toFixed(4)}
                  </div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>
                    Rate
                  </div>
                </div>
              </div>
              
              <div className="text-xs mb-3" style={{ color: colors.textSecondary }}>
                Updated: {currency.lastUpdated}
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: colors.cardBorder }}>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: colors.textSecondary }}>Auto-update</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={currency.autoUpdate} />
                    <div 
                      className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                      style={{
                        backgroundColor: currency.autoUpdate ? colors.accent : colors.textSecondary
                      }}
                    />
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 rounded"
                    style={{ color: colors.textSecondary, backgroundColor: `${colors.textSecondary}10` }}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 rounded"
                    style={{ color: colors.textSecondary, backgroundColor: `${colors.textSecondary}10` }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Info Card */}
      <div 
        className="rounded-lg border p-4 flex gap-3"
        style={{
          backgroundColor: `${colors.accent}10`,
          borderColor: colors.accent
        }}
      >
        <Info className="w-5 h-5 flex-shrink-0" style={{ color: colors.accent }} />
        <div>
          <div className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>
            Automatic Exchange Rate Updates
          </div>
          <div className="text-xs" style={{ color: colors.textSecondary }}>
            When enabled, exchange rates are automatically updated every hour from a reliable financial data provider. Manual rates can be set by disabling auto-update for specific currencies.
          </div>
        </div>
      </div>
    </div>
  );
}
