import { X, Mail, Phone, MapPin, Calendar, Check, FileText, Bell, XCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Booking } from './BookingsTable';

interface BookingDetailPanelProps {
  booking: Booking | null;
  onClose: () => void;
}

export function BookingDetailPanel({ booking, onClose }: BookingDetailPanelProps) {
  const { colors } = useTheme();
  
  if (!booking) return null;
  
  const customerDetails = {
    email: 'michael.chen@email.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop'
  };
  
  const yachtImage = 'https://images.unsplash.com/photo-1683964012191-7cd5617e164d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
  
  const extras = [
    { name: 'Premium Wine Package', price: 250 },
    { name: 'Professional Photography', price: 400 },
    { name: 'Water Sports Equipment', price: 150 }
  ];
  
  const pricingBreakdown = {
    basePrice: 3850,
    extras: 800,
    taxes: 465,
    total: 5115
  };
  
  const timeline = [
    { step: 'Inquiry', status: 'completed', date: 'Feb 10, 2026' },
    { step: 'Confirmed', status: 'completed', date: 'Feb 12, 2026' },
    { step: 'Paid', status: 'current', date: 'Feb 15, 2026' },
    { step: 'Completed', status: 'pending', date: '-' }
  ];
  
  return (
    <div 
      className="rounded-xl p-4 md:p-6 border backdrop-blur-sm"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6 pb-4 md:pb-6 border-b" style={{ borderColor: colors.cardBorder }}>
        <div>
          <h3 className="text-lg md:text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
            Booking Details
          </h3>
          <p className="text-xs md:text-sm font-mono" style={{ color: colors.accent }}>
            {booking.id}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-lg transition-all flex-shrink-0"
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
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Customer & Yacht Info */}
        <div className="space-y-4 md:space-y-6">
          {/* Customer Info */}
          <div 
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder
            }}
          >
            <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: colors.textPrimary }}>
              Customer Information
            </h4>
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={customerDetails.avatar}
                alt={booking.customer}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <div className="text-base font-semibold mb-1" style={{ color: colors.textPrimary }}>
                  {booking.customer}
                </div>
                <div className="text-xs" style={{ color: colors.textSecondary }}>
                  Premium Member
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" style={{ color: colors.textSecondary }} />
                <span className="text-sm" style={{ color: colors.textPrimary }}>
                  {customerDetails.email}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4" style={{ color: colors.textSecondary }} />
                <span className="text-sm" style={{ color: colors.textPrimary }}>
                  {customerDetails.phone}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" style={{ color: colors.textSecondary }} />
                <span className="text-sm" style={{ color: colors.textPrimary }}>
                  {booking.region}
                </span>
              </div>
            </div>
          </div>
          
          {/* Yacht Info */}
          <div 
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder
            }}
          >
            <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: colors.textPrimary }}>
              Booked Yacht
            </h4>
            <div className="mb-4 rounded-lg overflow-hidden">
              <img 
                src={yachtImage}
                alt={booking.yacht}
                className="w-full h-32 object-cover"
              />
            </div>
            <div className="text-base font-semibold mb-2" style={{ color: colors.textPrimary }}>
              {booking.yacht}
            </div>
            <div className="text-sm mb-4" style={{ color: colors.textSecondary }}>
              {booking.package}
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: colors.textPrimary }}>
              <Calendar className="w-4 h-4" style={{ color: colors.accent }} />
              <span>{booking.checkIn} - {booking.checkOut}</span>
            </div>
          </div>
        </div>
        
        {/* Middle Column - Extras & Pricing */}
        <div className="space-y-4 md:space-y-6">
          {/* Extras List */}
          <div 
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder
            }}
          >
            <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: colors.textPrimary }}>
              Extra Services
            </h4>
            <div className="space-y-3">
              {extras.map((extra, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg border"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder
                  }}
                >
                  <span className="text-sm" style={{ color: colors.textPrimary }}>
                    {extra.name}
                  </span>
                  <span className="text-sm font-mono font-medium" style={{ color: colors.accent }}>
                    ${extra.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Pricing Breakdown */}
          <div 
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder
            }}
          >
            <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: colors.textPrimary }}>
              Pricing Breakdown
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: colors.textSecondary }}>Base Package</span>
                <span className="text-sm font-mono" style={{ color: colors.textPrimary }}>
                  ${pricingBreakdown.basePrice.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: colors.textSecondary }}>Extras</span>
                <span className="text-sm font-mono" style={{ color: colors.textPrimary }}>
                  ${pricingBreakdown.extras.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: colors.cardBorder }}>
                <span className="text-sm" style={{ color: colors.textSecondary }}>Taxes & Fees</span>
                <span className="text-sm font-mono" style={{ color: colors.textPrimary }}>
                  ${pricingBreakdown.taxes.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-base font-bold" style={{ color: colors.textPrimary }}>Total</span>
                <span className="text-lg font-mono font-bold" style={{ color: colors.accent }}>
                  ${pricingBreakdown.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Payment Status */}
          <div 
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder
            }}
          >
            <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: colors.textPrimary }}>
              Payment Status
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: colors.textSecondary }}>Deposit Paid</span>
                <div 
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: `${colors.success}15`,
                    color: colors.success
                  }}
                >
                  <Check className="w-3 h-3" />
                  <span>$1,535</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: colors.textSecondary }}>Balance Due</span>
                <span className="text-sm font-mono font-bold" style={{ color: colors.accentGold }}>
                  $3,580
                </span>
              </div>
              <div className="pt-2">
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${colors.cardBorder}` }}>
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: '30%',
                      background: `linear-gradient(to right, ${colors.accent}, ${colors.success})`
                    }}
                  />
                </div>
                <div className="text-xs mt-2 text-center" style={{ color: colors.textSecondary }}>
                  30% paid
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Timeline & Actions */}
        <div className="space-y-4 md:space-y-6">
          {/* Booking Timeline */}
          <div 
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder
            }}
          >
            <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: colors.textPrimary }}>
              Booking Timeline
            </h4>
            <div className="space-y-4">
              {timeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="relative">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center border-2"
                      style={{
                        backgroundColor: item.status === 'completed' ? `${colors.accent}15` : 
                                       item.status === 'current' ? `${colors.accentGold}15` : colors.cardBg,
                        borderColor: item.status === 'completed' ? colors.accent : 
                                   item.status === 'current' ? colors.accentGold : colors.cardBorder
                      }}
                    >
                      {item.status === 'completed' ? (
                        <Check className="w-4 h-4" style={{ color: colors.accent }} />
                      ) : (
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ 
                            backgroundColor: item.status === 'current' ? colors.accentGold : colors.cardBorder 
                          }}
                        />
                      )}
                    </div>
                    {idx < timeline.length - 1 && (
                      <div 
                        className="absolute left-1/2 top-8 w-0.5 h-8 -translate-x-1/2"
                        style={{ 
                          backgroundColor: item.status === 'completed' ? colors.accent : colors.cardBorder 
                        }}
                      />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      {item.step}
                    </div>
                    <div className="text-xs" style={{ color: colors.textSecondary }}>
                      {item.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div 
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder
            }}
          >
            <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: colors.textPrimary }}>
              Quick Actions
            </h4>
            <div className="space-y-3">
              <button 
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-white transition-all"
                style={{
                  background: `linear-gradient(to right, ${colors.accent}, #00B39F)`,
                  boxShadow: `0 10px 25px -5px ${colors.accent}30`
                }}
              >
                <FileText className="w-4 h-4" />
                <span>Send Invoice</span>
              </button>
              <button 
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-all"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.cardBorder,
                  color: colors.textPrimary
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.accentGold;
                  e.currentTarget.style.backgroundColor = `${colors.accentGold}0D`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.cardBorder;
                  e.currentTarget.style.backgroundColor = colors.cardBg;
                }}
              >
                <Bell className="w-4 h-4" />
                <span>Send Reminder</span>
              </button>
              <button 
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-all"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.cardBorder,
                  color: colors.textSecondary
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.danger;
                  e.currentTarget.style.backgroundColor = `${colors.danger}0D`;
                  e.currentTarget.style.color = colors.danger;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.cardBorder;
                  e.currentTarget.style.backgroundColor = colors.cardBg;
                  e.currentTarget.style.color = colors.textSecondary;
                }}
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel Booking</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}