import { useTheme } from '../context/ThemeContext';

interface Booking {
  id: string;
  guestName: string;
  yacht: string;
  region: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
}

interface RecentBookingsTableProps {
  bookings: Booking[];
}

export function RecentBookingsTable({ bookings }: RecentBookingsTableProps) {
  const { colors } = useTheme();
  
  const getStatusConfig = (status: 'confirmed' | 'pending' | 'completed' | 'cancelled') => {
    switch (status) {
      case 'confirmed':
        return { 
          label: 'Confirmed', 
          bgColor: `${colors.accent}15`, 
          textColor: colors.accent, 
          borderColor: `${colors.accent}50` 
        };
      case 'pending':
        return { 
          label: 'Pending', 
          bgColor: `${colors.accentGold}15`, 
          textColor: colors.accentGold, 
          borderColor: `${colors.accentGold}50` 
        };
      case 'completed':
        return { 
          label: 'Completed', 
          bgColor: '#3B82F615', 
          textColor: '#60A5FA', 
          borderColor: '#3B82F650' 
        };
      case 'cancelled':
        return { 
          label: 'Cancelled', 
          bgColor: `${colors.danger}15`, 
          textColor: colors.danger, 
          borderColor: `${colors.danger}50` 
        };
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
        <h3 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>Recent Bookings</h3>
        <p className="text-sm" style={{ color: colors.textSecondary }}>Latest reservation activity</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
              <th className="text-left text-xs font-semibold pb-3 px-2" style={{ color: colors.textSecondary }}>BOOKING ID</th>
              <th className="text-left text-xs font-semibold pb-3 px-2" style={{ color: colors.textSecondary }}>GUEST</th>
              <th className="text-left text-xs font-semibold pb-3 px-2" style={{ color: colors.textSecondary }}>YACHT</th>
              <th className="text-left text-xs font-semibold pb-3 px-2" style={{ color: colors.textSecondary }}>REGION</th>
              <th className="text-left text-xs font-semibold pb-3 px-2" style={{ color: colors.textSecondary }}>DATES</th>
              <th className="text-right text-xs font-semibold pb-3 px-2" style={{ color: colors.textSecondary }}>AMOUNT</th>
              <th className="text-center text-xs font-semibold pb-3 px-2" style={{ color: colors.textSecondary }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              
              return (
                <tr 
                  key={booking.id}
                  className="transition-colors group"
                  style={{ borderBottom: `1px solid ${colors.cardBorder}` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.hoverBg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td className="py-4 px-2">
                    <span className="text-sm font-mono" style={{ color: colors.accent }}>#{booking.id}</span>
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>{booking.guestName}</span>
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-sm" style={{ color: colors.textPrimary }}>{booking.yacht}</span>
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-sm" style={{ color: colors.textSecondary }}>{booking.region}</span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="text-xs font-mono" style={{ color: colors.textSecondary }}>
                      {booking.startDate} - {booking.endDate}
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <span className="text-sm font-mono font-bold" style={{ color: colors.textPrimary }}>
                      ${booking.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex justify-center">
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-medium border"
                        style={{
                          backgroundColor: statusConfig.bgColor,
                          color: statusConfig.textColor,
                          borderColor: statusConfig.borderColor
                        }}
                      >
                        {statusConfig.label}
                      </span>
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
