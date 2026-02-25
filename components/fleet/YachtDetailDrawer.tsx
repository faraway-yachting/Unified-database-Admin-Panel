import { X, ChevronLeft, ChevronRight, FileText, Shield, Calendar, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Yacht } from './YachtCard';

interface YachtDetailDrawerProps {
  yacht: Yacht | null;
  onClose: () => void;
}

export function YachtDetailDrawer({ yacht, onClose }: YachtDetailDrawerProps) {
  const { colors } = useTheme();
  
  if (!yacht) return null;
  
  const images = [yacht.image, yacht.image, yacht.image, yacht.image];
  
  const specs = [
    { label: 'Length Overall', value: `${yacht.length} ft` },
    { label: 'Beam', value: '24 ft' },
    { label: 'Draft', value: '8.5 ft' },
    { label: 'Max Speed', value: '18 knots' },
    { label: 'Cruising Speed', value: '14 knots' },
    { label: 'Fuel Capacity', value: '2,800 L' },
    { label: 'Water Capacity', value: '1,200 L' },
    { label: 'Engine', value: '2x Volvo Penta D6' },
  ];
  
  const amenities = [
    'Air Conditioning', 'WiFi', 'Water Sports Equipment', 
    'Tender & Toys', 'BBQ Grill', 'Swimming Platform',
    'Sun Deck', 'Entertainment System', 'Full Kitchen'
  ];
  
  const documents = [
    { name: 'Insurance Certificate', expiry: 'Dec 15, 2026', status: 'valid' },
    { name: 'Safety Certificate', expiry: 'Aug 22, 2026', status: 'valid' },
    { name: 'Registration', expiry: 'Jan 30, 2025', status: 'expiring' },
  ];
  
  const upcomingBookings = [
    { id: 'BK-2847', guest: 'Michael Chen', dates: 'Feb 22 - Feb 28', amount: 24500 },
    { id: 'BK-2901', guest: 'Sarah Williams', dates: 'Mar 5 - Mar 12', amount: 32800 },
    { id: 'BK-2954', guest: 'James Rodriguez', dates: 'Mar 18 - Mar 25', amount: 28900 },
  ];
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-6xl max-h-[90vh] rounded-2xl border overflow-y-auto"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="sticky top-0 flex items-center justify-between p-6 border-b backdrop-blur-sm z-10"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.cardBorder
          }}
        >
          <div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
              {yacht.name}
            </h2>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {yacht.type} • {yacht.region}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg transition-all"
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
        
        <div className="p-6">
          {/* Image Gallery */}
          <div className="mb-8">
            <div className="relative h-80 rounded-xl overflow-hidden mb-4">
              <img 
                src={yacht.image} 
                alt={yacht.name}
                className="w-full h-full object-cover"
              />
              <button 
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full backdrop-blur-sm"
                style={{
                  backgroundColor: `${colors.cardBg}CC`,
                  color: colors.textPrimary
                }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full backdrop-blur-sm"
                style={{
                  backgroundColor: `${colors.cardBg}CC`,
                  color: colors.textPrimary
                }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div 
                  key={idx}
                  className="h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all"
                  style={{ borderColor: idx === 0 ? colors.accent : 'transparent' }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Full Specs */}
              <div 
                className="rounded-xl p-6 border"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.cardBorder
                }}
              >
                <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {specs.map((spec, idx) => (
                    <div key={idx}>
                      <div className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                        {spec.label}
                      </div>
                      <div className="text-sm font-mono font-bold" style={{ color: colors.textPrimary }}>
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Amenities */}
              <div 
                className="rounded-xl p-6 border"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.cardBorder
                }}
              >
                <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                  Amenities & Features
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: colors.accent }} />
                      <span className="text-sm" style={{ color: colors.textPrimary }}>
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Documents */}
              <div 
                className="rounded-xl p-6 border"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.cardBorder
                }}
              >
                <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                  Documents & Certificates
                </h3>
                <div className="space-y-3">
                  {documents.map((doc, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg border"
                      style={{
                        backgroundColor: colors.cardBg,
                        borderColor: colors.cardBorder
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{
                            backgroundColor: doc.status === 'valid' ? `${colors.accent}15` : `${colors.accentGold}15`
                          }}
                        >
                          {doc.name.includes('Insurance') ? (
                            <Shield className="w-4 h-4" style={{ color: doc.status === 'valid' ? colors.accent : colors.accentGold }} />
                          ) : (
                            <FileText className="w-4 h-4" style={{ color: doc.status === 'valid' ? colors.accent : colors.accentGold }} />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                            {doc.name}
                          </div>
                          <div className="text-xs" style={{ color: colors.textSecondary }}>
                            Expires: {doc.expiry}
                          </div>
                        </div>
                      </div>
                      <div 
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: doc.status === 'valid' ? `${colors.success}15` : `${colors.warning}15`,
                          color: doc.status === 'valid' ? colors.success : colors.warning
                        }}
                      >
                        {doc.status === 'valid' ? 'Valid' : 'Expiring Soon'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              {/* Upcoming Bookings */}
              <div 
                className="rounded-xl p-6 border"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.cardBorder
                }}
              >
                <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                  Upcoming Bookings
                </h3>
                <div className="space-y-3">
                  {upcomingBookings.map((booking, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-lg border"
                      style={{
                        backgroundColor: colors.cardBg,
                        borderColor: colors.cardBorder
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-mono" style={{ color: colors.accent }}>
                          #{booking.id}
                        </span>
                        <span className="text-sm font-mono font-bold" style={{ color: colors.textPrimary }}>
                          ${booking.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>
                        {booking.guest}
                      </div>
                      <div className="flex items-center gap-2 text-xs" style={{ color: colors.textSecondary }}>
                        <Calendar className="w-3 h-3" />
                        <span>{booking.dates}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Monthly Availability Calendar */}
              <div 
                className="rounded-xl p-6 border"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.cardBorder
                }}
              >
                <h3 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
                  February 2026 Availability
                </h3>
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                    <div 
                      key={idx}
                      className="text-center text-xs font-medium py-1"
                      style={{ color: colors.textSecondary }}
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => {
                    const isBooked = day >= 22 && day <= 28;
                    const isToday = day === 18;
                    
                    return (
                      <div 
                        key={day}
                        className="aspect-square flex items-center justify-center text-sm rounded-lg border cursor-pointer transition-all"
                        style={{
                          backgroundColor: isBooked ? `${colors.accentGold}15` : isToday ? `${colors.accent}15` : 'transparent',
                          borderColor: isToday ? colors.accent : colors.cardBorder,
                          color: isBooked ? colors.accentGold : isToday ? colors.accent : colors.textPrimary
                        }}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: `${colors.accent}30` }} />
                    <span style={{ color: colors.textSecondary }}>Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: `${colors.accentGold}30` }} />
                    <span style={{ color: colors.textSecondary }}>Booked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
