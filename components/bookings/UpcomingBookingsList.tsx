import { Eye, Calendar, MapPin } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface UpcomingBooking {
  id: string;
  customer: {
    name: string;
    avatar: string;
  };
  yacht: string;
  package: string;
  dateRange: string;
  region: string;
  status: 'confirmed' | 'inquiry' | 'paid';
}

interface UpcomingBookingsListProps {
  bookings: UpcomingBooking[];
  onQuickView: (booking: UpcomingBooking) => void;
}

export function UpcomingBookingsList({ bookings, onQuickView }: UpcomingBookingsListProps) {
  const { colors } = useTheme();
  
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { bgColor: `${colors.accent}15`, textColor: colors.accent, label: 'Confirmed' };
      case 'inquiry':
        return { bgColor: `${colors.accentGold}15`, textColor: colors.accentGold, label: 'Inquiry' };
      case 'paid':
        return { bgColor: `${colors.success}15`, textColor: colors.success, label: 'Paid' };
      default:
        return { bgColor: `${colors.textSecondary}15`, textColor: colors.textSecondary, label: status };
    }
  };
  
  return (
    <div 
      className="rounded-xl p-4 md:p-6 border backdrop-blur-sm"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder
      }}
    >
      <div className="mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
          Upcoming Bookings
        </h3>
        <p className="text-xs md:text-sm" style={{ color: colors.textSecondary }}>
          Next {bookings.length} bookings
        </p>
      </div>
      
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: `${colors.cardBorder} transparent`
      }}>
        {bookings.map((booking) => {
          const statusConfig = getStatusConfig(booking.status);
          
          return (
            <div 
              key={booking.id}
              className="p-3 md:p-4 rounded-lg border transition-all cursor-pointer"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${colors.accent}50`;
                e.currentTarget.style.backgroundColor = colors.hoverBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.cardBorder;
                e.currentTarget.style.backgroundColor = colors.background;
              }}
            >
              {/* Customer Info */}
              <div className="flex items-center gap-2 md:gap-3 mb-3">
                <img 
                  src={booking.customer.avatar}
                  alt={booking.customer.name}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs md:text-sm font-semibold truncate" style={{ color: colors.textPrimary }}>
                    {booking.customer.name}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] md:text-xs" style={{ color: colors.textSecondary }}>
                    <Calendar className="w-3 h-3" />
                    <span>{booking.dateRange}</span>
                  </div>
                </div>
                <div 
                  className="px-2 py-1 rounded text-[10px] md:text-xs font-medium flex-shrink-0"
                  style={{
                    backgroundColor: statusConfig.bgColor,
                    color: statusConfig.textColor
                  }}
                >
                  {statusConfig.label}
                </div>
              </div>
              
              {/* Booking Details */}
              <div className="space-y-1.5 md:space-y-2 mb-2 md:mb-3">
                <div className="text-xs md:text-sm" style={{ color: colors.textPrimary }}>
                  <span className="font-medium">Yacht: </span>
                  <span style={{ color: colors.textSecondary }}>{booking.yacht}</span>
                </div>
                <div className="text-xs md:text-sm" style={{ color: colors.textPrimary }}>
                  <span className="font-medium">Package: </span>
                  <span style={{ color: colors.textSecondary }}>{booking.package}</span>
                </div>
              </div>
              
              {/* Region & Action */}
              <div className="flex items-center justify-between pt-2 md:pt-3 border-t" style={{ borderColor: colors.cardBorder }}>
                <div className="flex items-center gap-1 text-[10px] md:text-xs" style={{ color: colors.textSecondary }}>
                  <MapPin className="w-3 h-3" />
                  <span>{booking.region}</span>
                </div>
                <button 
                  onClick={() => onQuickView(booking)}
                  className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[10px] md:text-xs font-medium transition-all"
                  style={{
                    backgroundColor: colors.cardBg,
                    color: colors.textSecondary
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${colors.accent}15`;
                    e.currentTarget.style.color = colors.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.cardBg;
                    e.currentTarget.style.color = colors.textSecondary;
                  }}
                >
                  <Eye className="w-3 h-3" />
                  <span className="hidden sm:inline">Quick View</span>
                  <span className="sm:hidden">View</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}