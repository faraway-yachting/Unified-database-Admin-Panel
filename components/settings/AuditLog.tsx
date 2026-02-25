import { Search, Filter } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: 'Created' | 'Updated' | 'Deleted' | 'Login';
  module: string;
  description: string;
  ipAddress: string;
}

const auditLogs: AuditLogEntry[] = [
  {
    id: 'A-001',
    timestamp: 'Feb 19, 2026 14:35:22',
    user: 'Sarah Mitchell',
    action: 'Updated',
    module: 'Packages',
    description: 'Updated pricing for "Sunset Experience" package',
    ipAddress: '192.168.1.105'
  },
  {
    id: 'A-002',
    timestamp: 'Feb 19, 2026 13:28:15',
    user: 'James Rodriguez',
    action: 'Created',
    module: 'Fleet',
    description: 'Added new yacht "Azure Dream" to Dubai fleet',
    ipAddress: '192.168.1.89'
  },
  {
    id: 'A-003',
    timestamp: 'Feb 19, 2026 12:15:08',
    user: 'Emma Thompson',
    action: 'Updated',
    module: 'Regions',
    description: 'Changed Monaco site status to Draft',
    ipAddress: '192.168.1.142'
  },
  {
    id: 'A-004',
    timestamp: 'Feb 19, 2026 11:42:33',
    user: 'Michael Chen',
    action: 'Login',
    module: 'System',
    description: 'User logged in successfully',
    ipAddress: '192.168.1.67'
  },
  {
    id: 'A-005',
    timestamp: 'Feb 19, 2026 10:58:19',
    user: 'Sarah Mitchell',
    action: 'Updated',
    module: 'Settings',
    description: 'Modified email notification preferences',
    ipAddress: '192.168.1.105'
  },
  {
    id: 'A-006',
    timestamp: 'Feb 19, 2026 09:22:47',
    user: 'Lisa Anderson',
    action: 'Created',
    module: 'Bookings',
    description: 'Created new booking B-2026-1847',
    ipAddress: '192.168.1.201'
  },
  {
    id: 'A-007',
    timestamp: 'Feb 18, 2026 16:45:55',
    user: 'James Rodriguez',
    action: 'Deleted',
    module: 'Fleet',
    description: 'Removed yacht "Sea Breeze" from fleet',
    ipAddress: '192.168.1.89'
  },
  {
    id: 'A-008',
    timestamp: 'Feb 18, 2026 15:30:12',
    user: 'Emma Thompson',
    action: 'Updated',
    module: 'CRM',
    description: 'Updated customer profile for John Smith',
    ipAddress: '192.168.1.142'
  },
  {
    id: 'A-009',
    timestamp: 'Feb 18, 2026 14:18:29',
    user: 'Michael Chen',
    action: 'Created',
    module: 'Pricing',
    description: 'Created seasonal pricing rule for summer 2026',
    ipAddress: '192.168.1.67'
  },
  {
    id: 'A-010',
    timestamp: 'Feb 18, 2026 13:05:44',
    user: 'Sarah Mitchell',
    action: 'Login',
    module: 'System',
    description: 'User logged in successfully',
    ipAddress: '192.168.1.105'
  }
];

const actionColors: Record<string, string> = {
  'Created': '#10B981',
  'Updated': '#F4A924',
  'Deleted': '#EF4444',
  'Login': '#6B7280'
};

export function AuditLog() {
  const { colors } = useTheme();
  
  return (
    <div 
      className="rounded-lg border p-4 md:p-6"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold" style={{ color: colors.textPrimary }}>
          Audit Log
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" 
              style={{ color: colors.textSecondary }} 
            />
            <input
              type="text"
              placeholder="Search logs..."
              className="pl-10 pr-4 py-2 rounded-lg border text-sm w-full sm:w-64"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder,
                color: colors.textPrimary
              }}
            />
          </div>
          
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all hover:scale-105"
            style={{
              borderColor: colors.cardBorder,
              color: colors.textPrimary,
              backgroundColor: colors.background
            }}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>
      
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr 
              className="border-b text-left"
              style={{ borderColor: colors.cardBorder }}
            >
              <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>Timestamp</th>
              <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>User</th>
              <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>Action</th>
              <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>Module</th>
              <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>Description</th>
              <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr 
                key={log.id}
                className="border-b"
                style={{ borderColor: colors.cardBorder }}
              >
                <td className="py-3 text-sm font-mono" style={{ color: colors.textSecondary }}>
                  {log.timestamp}
                </td>
                <td className="py-3 text-sm font-medium" style={{ color: colors.textPrimary }}>
                  {log.user}
                </td>
                <td className="py-3">
                  <span
                    className="px-2 py-1 rounded text-xs font-semibold"
                    style={{
                      backgroundColor: `${actionColors[log.action]}20`,
                      color: actionColors[log.action]
                    }}
                  >
                    {log.action}
                  </span>
                </td>
                <td className="py-3 text-sm" style={{ color: colors.textSecondary }}>
                  {log.module}
                </td>
                <td className="py-3 text-sm" style={{ color: colors.textPrimary }}>
                  {log.description}
                </td>
                <td className="py-3 text-sm font-mono" style={{ color: colors.textSecondary }}>
                  {log.ipAddress}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {auditLogs.map((log) => (
          <div
            key={log.id}
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <span
                className="px-2 py-1 rounded text-xs font-semibold"
                style={{
                  backgroundColor: `${actionColors[log.action]}20`,
                  color: actionColors[log.action]
                }}
              >
                {log.action}
              </span>
              <span className="text-xs" style={{ color: colors.textSecondary }}>
                {log.module}
              </span>
            </div>
            
            <div className="text-sm mb-2" style={{ color: colors.textPrimary }}>
              {log.description}
            </div>
            
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: colors.textSecondary }}>
              <div>
                <span className="font-medium">User:</span> {log.user}
              </div>
              <div>
                <span className="font-medium">IP:</span> <span className="font-mono">{log.ipAddress}</span>
              </div>
              <div className="w-full">
                <span className="font-mono">{log.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t" style={{ borderColor: colors.cardBorder }}>
        <div className="text-sm" style={{ color: colors.textSecondary }}>
          Showing 1-10 of 247 entries
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 rounded-lg border text-sm transition-all hover:scale-105"
            style={{
              borderColor: colors.cardBorder,
              color: colors.textPrimary,
              backgroundColor: colors.background
            }}
          >
            Previous
          </button>
          <button
            className="px-3 py-1.5 rounded-lg text-sm text-white transition-all hover:scale-105"
            style={{
              backgroundColor: colors.accent
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
